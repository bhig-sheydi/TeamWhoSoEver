import { useAuth } from "@/contexts/Auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {  Trash2 } from "lucide-react";

import "swiper/css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Dashboard = () => {
  const { session, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [merch, setMerch] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_name: "",
    product_description: "",
    selling_price: "",
    cost_price: "",
    product_quantity: "",
    product_image_url: "",
  });

        const handleDeleteProduct = async (id, imageUrl) => {
          if (!confirm("Are you sure you want to delete this product?")) return;

          try {
            // Delete image from storage
            if (imageUrl) {
              const filePath = imageUrl.split("/").pop();
              await supabase.storage.from("product_image").remove([filePath]);
            }

            // Delete product
            const { error } = await supabase.from("products").delete().eq("product_id", id);
            if (error) throw error;

            alert("🗑️ Product deleted successfully!");
            setMerch(merch.filter((m) => m.product_id !== id));
          } catch (error) {
            alert("❌ Failed to delete product: " + error.message);
          }
        };
  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, [session]);

  // Fetch merchandise and analytics
  useEffect(() => {
    const fetchMerchAndAnalytics = async () => {
      setLoadingProducts(true);

      // Fetch all products
      const { data: products, error: prodError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (prodError) console.error("Error fetching products:", prodError);
      else setMerch(products || []);

      // Fetch analytics data
      const { data: sales, error: salesError } = await supabase
        .from("product_sales")
        .select("product_id, quantity, total_price, sale_date");

      const { data: reviews, error: reviewError } = await supabase
        .from("product_reviews")
        .select("product_id, rating");

      if (salesError || reviewError)
        console.error("Error fetching analytics:", salesError || reviewError);
      else if (products) {
        const now = new Date();
        const filterByDays = (days) => {
          const cutoff = new Date();
          cutoff.setDate(now.getDate() - days);
          return sales.filter((s) => new Date(s.sale_date) >= cutoff);
        };




        const calculateStats = (filteredSales) => {
          let revenue = 0;
          let profit = 0;
          let loss = 0;
          let salesCount = 0;

          filteredSales.forEach((s) => {
            const product = products.find((p) => p.product_id === s.product_id);
            if (product) {
              const totalCost = product.cost_price * s.quantity;
              const totalProfit =
                (product.selling_price - product.cost_price) * s.quantity;
              revenue += s.total_price;
              profit += totalProfit > 0 ? totalProfit : 0;
              loss += totalProfit < 0 ? Math.abs(totalProfit) : 0;
              salesCount += s.quantity;
            }
          });

          return { sales: salesCount, revenue, profit, loss };
        };

        const daily = calculateStats(filterByDays(1));
        const weekly = calculateStats(filterByDays(7));
        const monthly = calculateStats(filterByDays(30));
        const yearly = calculateStats(filterByDays(365));
        const allTime = calculateStats(sales);

        setAnalytics({ daily, weekly, monthly, yearly, allTime });
      }

      setLoadingProducts(false);
    };

    fetchMerchAndAnalytics();
  }, [session]);

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { product_name, selling_price, cost_price, imageFile } = newProduct;

    if (!product_name || !selling_price || !cost_price) {
      alert("Please fill out required fields");
      return;
    }

    let imageUrl = "https://placehold.co/600x400?text=Product";

    try {
      // 1️⃣ Upload image if available
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product_image")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // 2️⃣ Get public URL of uploaded image
        const {
          data: { publicUrl },
        } = supabase.storage.from("product_image").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // 3️⃣ Insert product data with image URL
      const { error } = await supabase.from("products").insert([
        {
          product_name,
          product_description: newProduct.product_description || "",
          selling_price: parseFloat(selling_price),
          cost_price: parseFloat(cost_price),
          product_quantity: parseInt(newProduct.product_quantity) || 0,
          product_image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      alert("✅ Product added successfully!");
      setOpen(false);
      setNewProduct({
        product_name: "",
        product_description: "",
        selling_price: "",
        cost_price: "",
        product_quantity: "",
        product_image_url: "",
        imageFile: null,
      });

      // Refresh product list
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      setMerch(data || []);
    } catch (error) {
      console.error("Error adding product:", error.message);
      alert("❌ Failed to add product: " + error.message);
    }
  };


  if (loading || loadingProducts || !analytics)
    return <p className="text-center text-gray-500 mt-10">Loading dashboard...</p>;

  if (!session)
    return <p className="text-center text-gray-600 mt-10">Please log in</p>;

  const totalPages = Math.ceil(merch.length / itemsPerPage);
  const currentItems = merch.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-green-600 dark:text-green-400">
              Welcome,{" "}
              {profile?.full_name ||
                session.user.user_metadata.full_name ||
                session.user.email}{" "}
              👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your merchandise, sales, profits, and losses.
            </p>
          </div>
          <button
            onClick={async () => await supabase.auth.signOut()}
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Log Out
          </button>
        </div>

        {/* Analytics Section */}
        <div className="hidden md:grid grid-cols-4 gap-6 mb-12">
          {["daily", "weekly", "monthly", "yearly"].map((period) => (
            <Card
              key={period}
              className="p-6 rounded-2xl shadow-lg hover:shadow-2xl transition bg-white dark:bg-gray-800"
            >
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl font-semibold capitalize text-green-500">
                  {period} Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
                <p>Sales: {analytics[period].sales}</p>
                <p>
                  Revenue: $
                  {analytics[period].revenue.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p>
                  Profit: $
                  {analytics[period].profit.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p>
                  Loss: $
                  {analytics[period].loss.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:hidden mb-12">
          <Swiper spaceBetween={16} slidesPerView={1.2}>
            {["daily", "weekly", "monthly", "yearly"].map((period) => (
              <SwiperSlide key={period}>
                <Card className="p-4 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
                  <CardTitle className="text-lg font-semibold text-green-500 capitalize">
                    {period} Analytics
                  </CardTitle>
                  <CardContent className="p-0 mt-2 space-y-1">
                    <p>Sales: {analytics[period].sales}</p>
                    <p>
                      Revenue: $
                      {analytics[period].revenue.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p>
                      Profit: $
                      {analytics[period].profit.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p>
                      Loss: $
                      {analytics[period].loss.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Add Product Modal */}
        <div className="flex justify-end mb-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold shadow-lg transition-transform transform hover:scale-105">
                <Plus className="w-5 h-5" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-white dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle>Add a New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4 mt-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    value={newProduct.product_name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, product_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newProduct.product_description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        product_description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Selling Price *</Label>
                    <Input
                      type="number"
                      value={newProduct.selling_price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, selling_price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Cost Price *</Label>
                    <Input
                      type="number"
                      value={newProduct.cost_price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, cost_price: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={newProduct.product_quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        product_quantity: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Product Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageFile: e.target.files[0] })
                    }
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white mt-4"
                >
                  Save Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Merchandise List */}
        {merch.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">No products found.</p>
        ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {currentItems.map((item) => (
      <Card
        key={item.product_id}
        className="rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden hover:scale-[1.02]"
      >
        <CardHeader className="p-0 relative">
          <div className="overflow-hidden rounded-t-2xl">
            <img
              src={item.product_image_url}
              alt={item.product_name}
              className="w-full  object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-2">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {item.product_name}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {item.product_description || "No description provided."}
          </p>
          <p className="text-green-600 dark:text-green-400 font-bold">
            ${item.selling_price.toFixed(2)}
          </p>
          <div className="flex justify-between items-center mt-4">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-lg flex items-center"
              onClick={() =>
                handleDeleteProduct(item.product_id, item.product_image_url)
              }
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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

export default Dashboard;
