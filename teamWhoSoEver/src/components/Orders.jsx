import { useEffect, useState } from "react";    
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/Auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Orders = () => {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // For internal dialog
  const [showDialog, setShowDialog] = useState(false);
  const [pendingTrackingUrl, setPendingTrackingUrl] = useState("");

  const USPS_URL =
    "https://tools.usps.com/go/TrackConfirmAction_input?_gl=1*18kekve*_ga*MTU2MzI4OTU5NS4xNzYzNjU5NTY0*_ga_QM3XHZ2B95*czE3NjM3NTk0NzMkbzIkZzAkdDE3NjM3NTk0ODEkajUyJGwwJGgw";

  const fetchOrders = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", session.user.id)
      .order("placed_at", { ascending: false });

    if (!error) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [session]);

  const markDelivered = async (order_id) => {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "delivered",
        fulfilled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", order_id);

    if (!error) fetchOrders();
  };

  const statusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-blue-600";
      case "delivered":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) return <div className="p-6 text-xl">Loading orders...</div>;

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      {orders.map((order) => (
        <Card key={order.order_id} className="border rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Order #{order.order_number}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.placed_at).toLocaleString()}
              </p>
            </div>

            <Badge className={`${statusColor(order.status)} text-white`}>
              {order.status.toUpperCase()}
            </Badge>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <p><strong>Product:</strong> {order.product_name}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Size:</strong> {order.size ?? "—"}</p>
              <p><strong>Total:</strong> ₦{Number(order.total_amount).toLocaleString()}</p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-semibold">Shipping Details</p>
              {order.shipping_address_line1 ? (
                <>
                  <p>{order.shipping_name}</p>
                  <p>{order.shipping_address_line1}</p>
                  {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                  <p>
                    {order.shipping_city}, {order.shipping_state}, {order.shipping_country}
                  </p>
                </>
              ) : (
                <p className="text-gray-400 italic">No shipping info provided</p>
              )}
            </div>
          </CardContent>

          <CardContent>
            {/* Tracking */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <p className="font-semibold mb-1">Tracking Information</p>

              {order.tracking_number ? (
                <div className="flex items-center justify-between">
                  <p className="font-mono">{order.tracking_number}</p>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await navigator.clipboard.writeText(order.tracking_number);

                      // Prepare redirect
                      setPendingTrackingUrl(USPS_URL);

                      // Open dialog
                      setShowDialog(true);
                    }}
                  >
                    Copy & Track
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 italic">Product not yet moving</p>
              )}
            </div>

            {/* Mark as Delivered */}
            {order.status === "paid" && (
              <Button
                className="w-full mt-4"
                onClick={() => markDelivered(order.order_id)}
              >
                Mark as Delivered
              </Button>
            )}

            {order.status === "delivered" && (
              <p className="text-green-600 font-medium mt-3">
                ✔ Delivered on {new Date(order.fulfilled_at).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {/* ---------------------- */}
      {/* INTERNAL CUSTOM DIALOG */}
      {/* ---------------------- */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-[90%] max-w-md shadow-xl space-y-4">
            <h2 className="text-xl font-bold">Leaving This Page</h2>

            <p className="text-sm text-gray-700 dark:text-gray-300">
              You are about to visit an external tracking website.
              <br /><br />
              Your tracking number has already been copied to your clipboard.
              Simply paste it on the next page.
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  window.open(pendingTrackingUrl, "_blank");
                  setShowDialog(false);
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
