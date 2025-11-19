import { useEffect } from "react";

const SuccessPage = () => {

  useEffect(() => {
    // Clear cart after successful payment
    localStorage.removeItem("cart");
   
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>
      <p>Your order has been received.</p>
    </div>
  );
};

export default SuccessPage;
