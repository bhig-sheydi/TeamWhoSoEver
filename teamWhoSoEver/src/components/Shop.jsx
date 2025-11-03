import React, { useState, useMemo } from "react";
import { useAuth } from "@/contexts/Auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  // Dummy merch data (20 items for demo)
  const merchData = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Merch Item ${i + 1}`,
        price: (Math.random() * 50 + 5).toFixed(2),
        rating: (Math.random() * 5).toFixed(1),
        image: `https://source.unsplash.com/600x400/?merch,${i + 1}`,
        isNew: i % 5 === 0,
      })).sort((a, b) => a.price - b.price),
    []
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(merchData.length / itemsPerPage);

  const currentItems = merchData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Local state
  const [ratings, setRatings] = useState(
    merchData.reduce((acc, item) => ({ ...acc, [item.id]: parseFloat(item.rating) }), {})
  );
  const [favorites, setFavorites] = useState({});

  const handleCustomize = (id) => navigate(`/customize/${id}`);
  const handleAddToCart = (id) => alert(`Added item ${id} to cart!`);
  const handleRating = (id, value) => setRatings(prev => ({ ...prev, [id]: value }));
  const toggleFavorite = (id) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-black dark:text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Greeting */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          👋 Welcome back,{" "}
          <span className="text-purple-500">
            {session?.user?.user_metadata?.full_name || session?.user?.email?.split("@")[0]}
          </span>
          !
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Explore our faith-inspired merch. Customize, rate, and find your favorites ✨
        </p>

        {/* Merch Grid */}
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
                  src={item.image}
                  alt={item.name}
                  className="w-full h-56 object-cover rounded-t-3xl hover:scale-105 transition-transform duration-500"
                />
              </CardHeader>

              <CardContent className="space-y-4">
                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                  {item.name}
                  <Heart
                    onClick={() => toggleFavorite(item.id)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      favorites[item.id] ? "text-red-500 fill-red-500" : "text-gray-300 dark:text-gray-600"
                    } hover:text-red-500 hover:fill-red-500`}
                  />
                </CardTitle>

                <p className="text-sm text-gray-600 dark:text-gray-400">${item.price}</p>

                {/* Editable Rating */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      onClick={() => handleRating(item.id, i + 1)}
                      className={`w-6 h-6 cursor-pointer transition-colors ${
                        i < ratings[item.id] ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"
                      } hover:text-yellow-500 hover:fill-yellow-500`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">{ratings[item.id].toFixed(1)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleCustomize(item.id)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                  >
                    Customize
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

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
