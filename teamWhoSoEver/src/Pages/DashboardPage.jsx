import React from "react";
import Dashboard from "@/components/Dashboard";
import Shop from "@/components/Shop";
import { useAuth } from "@/contexts/Auth"; // Assuming you're using your Auth context

const DashboardPage = () => {
  const { session, loading } = useAuth();

  const adminEmails = ["headjada@gmail.com", "anotheradmin@example.com"];

  if (loading) return <p>Loading...</p>;
  if (!session) return <p>Please log in first.</p>;

  const userEmail = session.user.email;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">
      {adminEmails.includes(userEmail) ? (
        <Shop />
      ) : (
       
         <Dashboard />
      )}
    </div>
  );
};

export default DashboardPage;
