import { useAuth } from "@/contexts/Auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const Dashboard = () => {
  const { session, loading } = useAuth();
  const [profile, setProfile] = useState(null);

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

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (!session) return <p className="text-center text-gray-600 mt-10">Please log in</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-green-600 dark:text-green-400">
              Welcome, {profile?.full_name || session.user.user_metadata.full_name || session.user.email} 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your goods and merchandise easily from here.
            </p>
          </div>

          <button
            onClick={async () => await supabase.auth.signOut()}
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Log Out
          </button>
        </div>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-2 text-green-500">Total Goods</h3>
            <p className="text-3xl font-bold">48</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Items currently in stock</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-2 text-green-500">Total Sales</h3>
            <p className="text-3xl font-bold">$3,240</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Sales this month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-xl font-semibold mb-2 text-green-500">Pending Orders</h3>
            <p className="text-3xl font-bold">6</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Orders waiting for shipment</p>
          </div>
        </div>

        {/* Merchandise List Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">Your Merchandise</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example Item Cards */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <img
                src="https://via.placeholder.com/150"
                alt="Product 1"
                className="rounded-lg mb-4 w-full h-40 object-cover"
              />
              <h3 className="text-lg font-semibold">Walking Universe T-Shirt</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">$25.00</p>
              <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                View Details
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <img
                src="https://via.placeholder.com/150"
                alt="Product 2"
                className="rounded-lg mb-4 w-full h-40 object-cover"
              />
              <h3 className="text-lg font-semibold">Cosmic Hoodie</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">$45.00</p>
              <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                View Details
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <img
                src="https://via.placeholder.com/150"
                alt="Product 3"
                className="rounded-lg mb-4 w-full h-40 object-cover"
              />
              <h3 className="text-lg font-semibold">Universe Mug</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">$15.00</p>
              <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
