import React from "react";
import { useAuth } from "@/contexts/Auth";
import AdminOrders from "@/components/AdminOrders";
import Orders from "@/components/Orders";

const OrderPage = () => {
  const { session, loading } = useAuth();

  const adminEmails = ["headjada@gmail.com", "anotheradmin@example.com"];

  if (loading) return <p>Loading...</p>;
  if (!session) return <p>Please log in first.</p>;

  const userEmail = session.user.email;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      {adminEmails.includes(userEmail) ? (
        <AdminOrders />
      ) : (
        <Orders />
      )}
    </div>
  );
};

export default OrderPage;
