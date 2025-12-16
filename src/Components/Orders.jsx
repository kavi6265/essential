import React, { useState, useEffect } from "react";
import { database } from "./firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "../css/Order.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = window.location;
  const isAdminView = location.pathname.includes("/admin/");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const ordersRef = ref(database, "userorders");
      const snapshot = await get(ordersRef);

      if (!snapshot.exists()) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const allUsersData = snapshot.val();
      const allOrders = [];

      Object.entries(allUsersData || {}).forEach(([userId, userOrders]) => {
        if (!userOrders || typeof userOrders !== "object") return;

        Object.entries(userOrders).forEach(([orderId, orderData]) => {
          if (!orderData || typeof orderData !== "object") return;

          if (!orderData.delivered) {
            let products = [];

            if (orderData.items && typeof orderData.items === "object") {
              products = Object.values(orderData.items).map((item) =>
                item && typeof item === "object" ? item : {}
              );
            } else {
              const metaFields = [
                "address",
                "phno",
                "username",
                "orderTimestamp",
                "orderTotal",
                "ordered",
                "delivered",
                "notes",
              ];
              products = Object.keys(orderData)
                .filter(
                  (k) =>
                    !metaFields.includes(k) &&
                    orderData[k] &&
                    typeof orderData[k] === "object"
                )
                .map((k) => orderData[k]);
            }

            allOrders.push({
              orderId: orderId || Math.random().toString(),
              userId: userId || "unknown",
              products,
              orderTimestamp: orderData.orderTimestamp || 0,
              ...orderData,
            });
          }
        });
      });

      allOrders.sort(
        (a, b) => (b.orderTimestamp || 0) - (a.orderTimestamp || 0)
      );
      setOrders(allOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Simplified universal image resolver
  const getImageUrl = (imageValue) => {
    const fallback = "/unknowenprofile.png";
    if (!imageValue) return fallback;

    const val = String(imageValue).trim();

    // ✅ Direct Firebase/HTTP URL
    if (val.startsWith("https://") || val.startsWith("http://")) {
      return val;
    }

    // ✅ Local file
    if (/\.(png|jpg|jpeg|gif|webp)$/i.test(val)) {
      return `/${val}`;
    }

    return fallback;
  };

  const handleOrderClick = (order) => {
    if (!order || !order.userId || !order.orderId) return;
    const path = isAdminView
      ? `/admin/OrderedProductpreviewadmin/${order.userId}/${order.orderId}`
      : `/OrderedProductpreview/${order.userId}/${order.orderId}`;
    navigate(path);
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="orders-containera">
      <div className="orders-headera">
        <h1>{isAdminView ? "Manage Orders" : "My Orders"}</h1>
      </div>

      {loading ? (
        <div className="loading-containera">
          <div className="loading-spinnera"></div>
          <p>Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="error-containera">
          <p>{error}</p>
          <button onClick={fetchAllOrders}>Try Again</button>
        </div>
      ) : safeOrders.length === 0 ? (
        <div className="empty-ordersa">
          <h2>No Pending Orders Found</h2>
          {!isAdminView && (
            <button
              className="shop-now-btna"
              onClick={() => navigate("/shop")}
            >
              Shop Now
            </button>
          )}
        </div>
      ) : (
        <div className="orders-lista">
          {safeOrders.map((order) => {
            const products = Array.isArray(order.products)
              ? order.products
              : [];

            return (
              <div
                key={order.orderId}
                className="order-carda"
                onClick={() => handleOrderClick(order)}
              >
                {/* Header */}
                <div className="order-headera">
                  <div className="order-infoa">
                    <span className="order-ida">
                      Order #{order.orderId.substring(0, 8)}
                    </span>
                    <span className="order-date">
                      {new Date(order.orderTimestamp).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="order-statusa">
                    {order.delivered ? (
                      <span className="status-badge delivered">Delivered</span>
                    ) : order.ordered ? (
                      <span className="status-badge pending">Processing</span>
                    ) : (
                      <span className="status-badge pending">Pending</span>
                    )}
                  </div>
                </div>

                {/* Products */}
                <div className="order-productsa">
                  {products.map((item, index) => {
                    const imgSrc = getImageUrl(
                      item?.productimageurl || item?.productimage
                    );
                    const altText = item?.productname || "Product";

                    return (
                      <div key={index} className="product-itema">
                        <div className="product-imagea">
                          <img
                            src={imgSrc}
                            alt={altText}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/unknowenprofile.png";
                            }}
                          />
                        </div>
                        <div className="product-detailsa">
                          <h3>{item?.productname}</h3>
                          <div className="product-metaa">
                            <span className="product-qtyA">
                              Qty: {item?.qty || 1}
                            </span>
                            <span className="product-pricea">
                              ₹{item?.productamt || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="order-footera">
                  <div className="shipping-infoa">
                    <h4>Shipping Details</h4>
                    <p>
                      <strong>Name:</strong> {order.username}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.phno}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.address}
                    </p>
                    {order.notes && (
                      <p>
                        <strong>Notes:</strong> {order.notes}
                      </p>
                    )}
                  </div>
                  <div className="order-summarya">
                    <div className="total-amounta">
                      <span>Total Amount:</span>
                      <span className="amounta">₹{order.orderTotal}</span>
                    </div>
                    <button className="track-order-btna">View Details</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
