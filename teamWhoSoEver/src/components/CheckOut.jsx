import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/Auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

const CheckoutPage = () => {
  const { session } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [total, setTotal] = useState(0);

  // Shipping Address State
  const [shipping, setShipping] = useState({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal: "",
    country: "",
  });

  const [hasAddress, setHasAddress] = useState(false);
  const [confirmAddressPopup, setConfirmAddressPopup] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  // Load cart + shipping info
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    calculateTotal(storedCart);

    const savedAddress = JSON.parse(localStorage.getItem("shipping_address"));
    if (savedAddress) {
      setShipping(savedAddress);
      setHasAddress(true);
    }

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

  // Save shipping address to localStorage
  const saveAddress = () => {
    if (!shipping.name || !shipping.line1 || !shipping.city || !shipping.country) {
      alert("Please fill all required fields");
      return;
    }

    localStorage.setItem("shipping_address", JSON.stringify(shipping));
    setHasAddress(true);
    setEditingAddress(false);
  };

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

  // CONFIRM ADDRESS BEFORE CHECKOUT
  const startCheckoutFlow = async () => {
    if (!session) {
      alert("You must be logged in");
      return;
    }

    const valid = await validateCart();
    if (!valid) return;

    setConfirmAddressPopup(true);
  };

  // Final checkout after confirming address
  const handleCheckout = async () => {
    setConfirmAddressPopup(false);
  
    try {
      const order_number = `ORD-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}-${Math.floor(Math.random() * 10000)}`;
  
      const subtotal = total;
      const total_amount = total;
  
      for (let item of cart) {
        // Determine if item has custom base64
        const customProductUrl = item.base64 || null;
  
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
  
              // Product info
              product_id: item.id,
              product_name: item.name,
              size: item.selectedSize,
              unit_price: item.price,
              quantity: item.quantity,
              customProductUrl, // store base64 string if exists, else null
  
              // Shipping info
              shipping_name: shipping.name,
              shipping_address_line1: shipping.line1,
              shipping_address_line2: shipping.line2,
              shipping_city: shipping.city,
              shipping_state: shipping.state,
              shipping_postal_code: shipping.postal,
              shipping_country: shipping.country,
            },
          ])
          .select()
          .single();
  
        if (orderError) {
          console.error(orderError);
          alert(`Failed to create order for ${item.name}`);
          return;
        }
      }
  
      // Optional: call Stripe after all items added
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
            order_number,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!data.checkout_url) {
        alert("Stripe error");
        console.error(data);
        return;
      }
  
      window.location.href = data.checkout_url;
    } catch (err) {
      console.error(err);
      alert("Unexpected error");
    }
  };
  

  // UI STARTS HERE
  if (loading) return <div>Loading cart...</div>;
  if (cart.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* SHIPPING ADDRESS SECTION */}
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-xl font-bold mb-3">Shipping Address</h2>

        {/* If address exists but editing disabled */}
        {hasAddress && !editingAddress && (
          <div>
            <p>{shipping.name}</p>
            <p>{shipping.line1}</p>
            {shipping.line2 && <p>{shipping.line2}</p>}
            <p>
              {shipping.city}, {shipping.state}
            </p>
            <p>{shipping.postal}</p>
            <p>{shipping.country}</p>

            <Button
              className="mt-3 bg-blue-500 text-white"
              onClick={() => setEditingAddress(true)}
            >
              Change Shipping Address
            </Button>
          </div>
        )}

        {/* Address form when editing or no address saved */}
        {(!hasAddress || editingAddress) && (
          <div className="space-y-3 mt-3">
            <input
              className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
              placeholder="Full Name"
              value={shipping.name}
              onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
            />
            <input
              className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
              placeholder="Address Line 1"
              value={shipping.line1}
              onChange={(e) => setShipping({ ...shipping, line1: e.target.value })}
            />
            <input
              className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
              placeholder="Address Line 2 (optional)"
              value={shipping.line2}
              onChange={(e) => setShipping({ ...shipping, line2: e.target.value })}
            />
            <input
              className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
              placeholder="City"
              value={shipping.city}
              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
            />
            <input
              className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
              placeholder="State"
              value={shipping.state}
              onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
            />
            <input
              className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
              placeholder="Postal Code"
              value={shipping.postal}
              onChange={(e) => setShipping({ ...shipping, postal: e.target.value })}
            />
            <input
              className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
              placeholder="Country"
              value={shipping.country}
              onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
            />

            <Button onClick={saveAddress} className="bg-green-500 text-white">
              Save Address
            </Button>
          </div>
        )}
      </div>

      {/* CART */}
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.selectedSize}`}
            className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>Size: {item.selectedSize}</p>
                <p>Quantity: {item.quantity}</p>
                <p>${item.price.toFixed(2)}</p>
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

      {/* TOTAL */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        <Button onClick={startCheckoutFlow} className="bg-green-500 text-white">
          Proceed to Payment
        </Button>
      </div>

      {/* ADDRESS CONFIRMATION POPUP */}
      {confirmAddressPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-center">
              Is this your shipping address?
            </h3>

            <div className="mb-4 text-center">
              <p>{shipping.name}</p>
              <p>{shipping.line1}</p>
              {shipping.line2 && <p>{shipping.line2}</p>}
              <p>
                {shipping.city}, {shipping.state}
              </p>
              <p>{shipping.postal}</p>
              <p>{shipping.country}</p>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-green-500 text-white"
                onClick={handleCheckout}
              >
                Yes
              </Button>
              <Button
                className="flex-1 bg-red-500 text-white"
                onClick={() => {
                  setEditingAddress(true);
                  setConfirmAddressPopup(false);
                }}
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
