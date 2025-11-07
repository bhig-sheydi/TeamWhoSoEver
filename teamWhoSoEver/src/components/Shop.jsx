import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/Auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Heart, Plus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Shop = () => {
  const { session } = useAuth();

  const [merchData, setMerchData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Ratings & Favorites
  const [ratings, setRatings] = useState({});
  const [favorites, setFavorites] = useState({});

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState(null);
  const [modalReviews, setModalReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(0);

  // Fetch merch data with aggregated ratings
  useEffect(() => {
    const fetchMerch = async () => {
      setLoading(true);

      // Fetch all products and their reviews (including reviewer info)
      const { data, error } = await supabase
        .from("products")
        .select(`
        *,
        product_reviews (
          rating,
          review_text,
          user_id,
          user_name,
          user_avatar_url
        )
      `)
        .order("selling_price", { ascending: true });

      if (error) {
        console.error("Error fetching merch:", error);
      } else if (data) {
        const formattedData = data.map((item) => {
          const ratingsArray = item.product_reviews || [];
          const avgRating =
            ratingsArray.length > 0
              ? ratingsArray.reduce((acc, r) => acc + r.rating, 0) / ratingsArray.length
              : 0;

          return {
            id: item.product_id,
            name: item.product_name,
            price: item.selling_price,
            image: item.product_image_url,
            isNew: false,
            average_rating: avgRating,
          };
        });

        setMerchData(formattedData);

        setRatings(
          formattedData.reduce(
            (acc, item) => ({ ...acc, [item.id]: item.average_rating }),
            {}
          )
        );
      }

      setLoading(false);
    };

    fetchMerch();
  }, []);


  const totalPages = Math.ceil(merchData.length / itemsPerPage);
  const currentItems = merchData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (id) => alert(`Added item ${id} to cart!`);

  const toggleFavorite = (id) =>
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));

  // Open modal and fetch reviews
// Open modal and fetch reviews
const handleViewReviews = async (product) => {
  setModalProduct(product);
  setModalOpen(true);

  const { data } = await supabase
    .from("product_reviews")
    .select("rating, review_text, user_id, user_name, user_avatar_url")
    .eq("product_id", product.id);

  setModalReviews(data || []);

  const userReview = data?.find((r) => r.user_id === session?.user?.id);
  if (userReview) {
    setNewReviewText(userReview.review_text || "");
    setNewReviewRating(userReview.rating || 0);
  } else {
    setNewReviewText("");
    setNewReviewRating(0);
  }
};



  // Submit or update review
  const handleSubmitReview = async () => {
    if (!session?.user?.id || !modalProduct) return;

    // Upsert review
    await supabase.from("product_reviews").upsert(
      {
        product_id: modalProduct.id,
        user_id: session.user.id,
        rating: newReviewRating,
        review_text: newReviewText,
      },
      { onConflict: ["product_id", "user_id"] }
    );

    // Recalculate average rating
    const { data: reviews } = await supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", modalProduct.id);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    // Update average_rating in products table
    await supabase
      .from("products")
      .update({ average_rating: avgRating })
      .eq("product_id", modalProduct.id);

    // Update UI
    setRatings((prev) => ({ ...prev, [modalProduct.id]: avgRating }));

    // Refresh modal reviews
    const { data: updatedReviews } = await supabase
      .from("product_reviews")
      .select("rating, review_text, user_id")
      .eq("product_id", modalProduct.id);

    setModalReviews(updatedReviews || []);
    setNewReviewText("");
    setNewReviewRating(0);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading merch...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-black dark:text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          👋 Welcome back,{" "}
          <span className="text-purple-500">
            {session?.user?.user_metadata?.full_name ||
              session?.user?.email?.split("@")[0]}
          </span>
          !
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Explore our faith-inspired merch. Rate, and find your favorites ✨
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((item) => (
            <Card
              key={item.id}
              className="relative rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 bg-gradient-to-tr from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {item.isNew && (
                <span className="absolute top-3 left-3 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  NEW
                </span>
              )}

              <CardHeader className="p-0">
                <img
                  src={item.image || "https://example.com/placeholder.png"}
                  alt={item.name}
                  className="w-full object-cover rounded-t-3xl hover:scale-105 transition-transform duration-500"
                />
              </CardHeader>

              <CardContent className="space-y-4">
                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                  {item.name}
                  <Heart
                    onClick={() => toggleFavorite(item.id)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${favorites[item.id]
                      ? "text-red-500 fill-red-500"
                      : "text-gray-300 dark:text-gray-600"
                      } hover:text-red-500 hover:fill-red-500`}
                  />
                </CardTitle>

                <p className="text-sm text-gray-600 dark:text-gray-400">${item.price}</p>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      onClick={async () => {
                        setRatings((prev) => ({ ...prev, [item.id]: i + 1 }));
                        await supabase.from("product_reviews").upsert(
                          {
                            product_id: item.id,
                            user_id: session.user.id,
                            rating: i + 1,
                          },
                          { onConflict: ["product_id", "user_id"] }
                        );
                      }}
                      className={`w-6 h-6 cursor-pointer transition-colors ${i < ratings[item.id]
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                        } hover:text-yellow-500 hover:fill-yellow-500`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">
                    {ratings[item.id]?.toFixed(1)}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleViewReviews(item)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                  >
                    <Plus className="inline mr-2 w-4 h-4" /> View Reviews
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(item.id)}
                    className="flex-1 bg-green-500 text-white font-bold shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Reviews Modal */}
      {modalOpen && modalProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-24 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full relative">
            <h2 className="text-xl font-bold mb-4">
              Reviews for {modalProduct.name}
            </h2>
            <button
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 font-bold"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>

            <div className="max-h-80 overflow-y-auto mb-4 space-y-2">
              {modalReviews.length === 0 && <p>No reviews yet.</p>}
              {modalReviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700 pb-3"
                >
                  <div className="flex items-center space-x-3 mb-1">
                    <img
                      src={rev.user_avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      alt={rev.user_name || "User"}
                      className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {rev.user_name || "Anonymous"}
                      </p>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rev.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 ml-11">
                    {rev.review_text}
                  </p>
                </div>
              ))}

            </div>

            <div className="space-y-2">
              <label className="block font-semibold">Your Rating:</label>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    onClick={() => setNewReviewRating(i + 1)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${i < newReviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                      } hover:text-yellow-500 hover:fill-yellow-500`}
                  />
                ))}
              </div>
              <textarea
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                placeholder="Write your review..."
              />
              <Button
                onClick={handleSubmitReview}
                className="w-full bg-purple-500 text-white font-bold"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
