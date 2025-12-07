import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart after successful payment
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="p-10 text-center h-screen">
      <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>
      <p>Your order has been received.</p>

      <Button 
        className="mt-6 bg-purple-300"
        onClick={() => navigate("/orders")}
      >
        View Orders
      </Button>
    </div>
  );
};

export default SuccessPage;
