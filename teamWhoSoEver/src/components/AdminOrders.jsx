import { useEffect, useState } from "react";    
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/Auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 10;

const AdminOrders = () => {
  const { session } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [trackingInputs, setTrackingInputs] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async () => {
    if (!session?.user) return;

    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("placed_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (statusFilter) query = query.eq("status", statusFilter);

    if (search) {
      query = query
        .ilike("order_number", `%${search}%`)
        .or(`billing_email.ilike.%${search}%`)
        .or(`product_name.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (!error) {
      setOrders(data);
      setTotalOrders(count || 0);

      const newTrackingInputs = {};
      data.forEach((order) => {
        newTrackingInputs[order.order_id] = order.tracking_number || "";
      });
      setTrackingInputs(newTrackingInputs);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [session, search, statusFilter, page]);

  const updateStatus = async (order_id, newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        fulfilled_at: newStatus === "delivered" ? new Date().toISOString() : null,
      })
      .eq("order_id", order_id);

    if (!error) fetchOrders();
  };

  const updateTrackingNumber = async (order_id, tracking_number) => {
    const { error } = await supabase
      .from("orders")
      .update({
        tracking_number,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", order_id);

    if (!error) fetchOrders();
  };

  // ✅ DELETE ORDER FUNCTION
  const deleteOrder = async (order_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order? This cannot be undone."
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("order_id", order_id);

    if (error) {
      console.error(error);
    } else {
      fetchOrders();
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "paid": return "bg-blue-600";
      case "delivered": return "bg-green-600";
      case "pending": return "bg-yellow-500";
      case "cancelled": return "bg-red-600";
      default: return "bg-gray-500";
    }
  };

  const totalPages = Math.ceil(totalOrders / PAGE_SIZE);

  if (loading) return <div className="p-6 text-xl">Loading orders...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">All Orders</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by order number, email, or product"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="md:w-1/2 p-2 border rounded-md"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="p-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders */}
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.order_id} className="border rounded-2xl shadow-sm">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Order #{order.order_number}</CardTitle>
                <p className="text-sm text-gray-500">
                  By {order.billing_email || order.user_id} •{" "}
                  {new Date(order.placed_at).toLocaleString()}
                </p>
              </div>
              <Badge className={`${statusColor(order.status)} text-white`}>
                {order.status.toUpperCase()}
              </Badge>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p>
                  <strong>Product:</strong> {order.product_name}
                </p>
                <p>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p>
                  <strong>Size:</strong> {order.size ?? "—"}
                </p>
                <p>
                  <strong>Total:</strong> ₦
                  {Number(order.total_amount).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Shipping Details</p>
                {order.shipping_address_line1 ? (
                  <>
                    <p>{order.shipping_name}</p>
                    <p>{order.shipping_address_line1}</p>
                    {order.shipping_address_line2 && (
                      <p>{order.shipping_address_line2}</p>
                    )}
                    <p>
                      {order.shipping_city}, {order.shipping_state},{" "}
                      {order.shipping_country}
                    </p>
                  </>
                ) : (
                  <p className="italic text-gray-400">No shipping info</p>
                )}
              </div>
            </CardContent>

            <CardContent>
              {/* Tracking */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-2">
                <p className="font-semibold mb-1">Tracking Info</p>

                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Enter tracking number"
                    value={trackingInputs[order.order_id] ?? ""}
                    onChange={(e) =>
                      setTrackingInputs((prev) => ({
                        ...prev,
                        [order.order_id]: e.target.value,
                      }))
                    }
                    className="flex-1 p-2 border rounded-md"
                  />
                  <Button
                    size="sm"
                    onClick={() =>
                      updateTrackingNumber(
                        order.order_id,
                        trackingInputs[order.order_id]
                      )
                    }
                  >
                    Send/Update
                  </Button>
                </div>

                {order.tracking_number && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const url = `https://tools.usps.com/go/TrackConfirmAction_input?trackingnumber=${order.tracking_number}`;
                      window.open(url, "_blank");
                    }}
                  >
                    Track on USPS
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {order.status !== "delivered" && (
                  <Button
                    onClick={() =>
                      updateStatus(order.order_id, "delivered")
                    }
                  >
                    Mark as Delivered
                  </Button>
                )}

                {order.status === "delivered" && (
                  <p className="text-green-600 font-medium">
                    ✔ Delivered on{" "}
                    {new Date(order.fulfilled_at).toLocaleString()}
                  </p>
                )}

                {/* DELETE ORDER BUTTON */}
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => deleteOrder(order.order_id)}
                >
                  Delete Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <span className="px-2 py-1">
            {page} / {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
