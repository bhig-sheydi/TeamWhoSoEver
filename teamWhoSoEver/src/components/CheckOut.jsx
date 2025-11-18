import React, { useState, useEffect } from "react"; 
import { useAuth } from "@/contexts/Auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const CheckoutPage = () => {
  const { session } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Fetch cart from localStorage and calculate total
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotal(storedCart);
    setLoading(false);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const handleRemoveItem = (id, size) => {
    const updatedCart = cart.filter(
      (item) => !(item.id === id && item.selectedSize === size)
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  // Validate prices against DB before payment
  const validateCart = async () => {
    const productIds = cart.map((item) => item.id);
    const { data: products, error } = await supabase
      .from("products")
      .select("product_id, selling_price, product_quantity")
      .in("product_id", productIds);

    if (error) {
      alert("Error fetching products for validation");
      return false;
    }

    for (let item of cart) {
      const product = products.find((p) => p.product_id === item.id);
      if (!product) {
        alert(`Product ${item.name} not found`);
        return false;
      }
      if (product.selling_price !== item.price) {
        alert(`Price of ${item.name} has changed. Please refresh cart.`);
        return false;
      }
      if (product.product_quantity < item.quantity) {
        alert(`Not enough stock for ${item.name}`);
        return false;
      }
    }

    return true;
  };

  // 🔥 Handle checkout: insert order + start Stripe checkout
  const handleCheckout = async () => {
    if (!session) {
      alert("You must be logged in to checkout");
      return;
    }

    const valid = await validateCart();
    if (!valid) return;

    try {
      // 1️⃣ Create a unique order number
      const order_number = `ORD-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${Math.floor(Math.random() * 10000)}`;

      const subtotal = total;
      const total_amount = total;
      const firstItem = cart[0]; // use first item for summary fields

      // 2️⃣ Insert order record in Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: session.user.id,
            order_number,
            status: "pending",
            subtotal,
            total_amount,
            payment_provider: "stripe",
            notes: "Awaiting payment confirmation",
            product_id: firstItem.id,
            product_name: firstItem.name,
            size: firstItem.selectedSize,
            unit_price: firstItem.price,
            quantity: firstItem.quantity,
          },
        ])
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        alert("Error creating order record");
        return;
      }

      console.log("✅ Order record created:", order);

      // 3️⃣ Create Stripe Checkout Session via Supabase Edge Function
      const response = await fetch(
        "https://yedqieqvcdrrnunhlxyw.supabase.co/functions/v1/strip-init",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            customer_id: session.user.id,
            items: cart.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              size: item.selectedSize,
            })),
            order_number: order.order_number, // ✅ pass order_number instead of order_id
          }),
        }
      );

      const data = await response.json();

      if (!data.checkout_url) {
        alert("Checkout URL not returned from server");
        console.error("Stripe error:", data);
        return;
      }

      // 4️⃣ Redirect to Stripe checkout
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error("Unexpected error creating checkout session:", err);
      alert("Unexpected error occurred. Please try again.");
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (cart.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.selectedSize}`}
            className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image || "https://example.com/placeholder.png"}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>Size: {item.selectedSize}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
              </div>
            </div>
            <Button
              onClick={() => handleRemoveItem(item.id, item.selectedSize)}
              className="bg-red-500 text-white"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        <Button onClick={handleCheckout} className="bg-green-500 text-white">
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
