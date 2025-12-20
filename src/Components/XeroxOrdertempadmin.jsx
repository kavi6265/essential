import { useState, useEffect, useRef } from "react";
import { ref, onValue, getDatabase } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "../css/XeroxOrdertempadmin.css";

function XeroxOrdertempadmin() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const debounceTimerRef = useRef(null);
  const navigate = useNavigate();

  const handleOrderClick = (order) => {
    navigate(`/tempadmin/XeroxOrderpreviewtempadmin/${order.userId}/${order.orderId}/${order.grandTotal}`);
  };

  useEffect(() => {
    const database = getDatabase();
    const pdfsRef = ref(database, "pdfs");

    onValue(pdfsRef, (snapshot) => {
      try {
        const uniqueOrders = {};
        snapshot.forEach((userIdSnapshot) => {
          const userId = userIdSnapshot.key;
          userIdSnapshot.forEach((orderIdSnapshot) => {
            const orderId = orderIdSnapshot.key;
            let someFileNotDelivered = false;
            let orderData = null;

            orderIdSnapshot.forEach((fileSnapshot) => {
              const fileData = fileSnapshot.val();
              if (!orderData) {
                orderData = {
                  name: fileData.name0 || "Document",
                  uri: fileData.uri0,
                  grandTotal: fileData.grandTotal0 || 0,
                  orderId: orderId,
                  delivered: fileData.delivered || false,
                  username: fileData.username || "Customer",
                  userId: userId,
                  // Assuming uploadTime is available for "Ordered on" text
                  date: fileData.uploadTime ? new Date(fileData.uploadTime).toDateString() : ""
                };
              }
              if (!fileData.delivered) someFileNotDelivered = true;
            });

            if (orderData && someFileNotDelivered && !uniqueOrders[orderId]) {
              uniqueOrders[orderId] = orderData;
            }
          });
        });

        const ordersArray = Object.values(uniqueOrders);
        setOrders(ordersArray);
        setFilteredOrders(ordersArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    });
  }, []);

  const handleSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const filtered = orders.filter(order => 
        order.orderId.toLowerCase().includes(text.toLowerCase()) ||
        (order.username && order.username.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredOrders(filtered);
    }, 300);
  };

  return (
    <div className="fk-admin-page">
      {/* Flipkart Header */}
      <header className="fk-header">
        <div className="fk-header-content">
          <div className="fk-logo-section">
            <span className="fk-brand">Flipkart</span>
            <span className="fk-plus">Explore <span className="fk-plus-gold">Plus</span></span>
          </div>
          
          <div className="fk-search-container">
            <input
              type="text"
              className="fk-search-input"
              placeholder="Search for orders, customers and more"
              value={searchText}
              onChange={handleSearch}
            />
            <button className="fk-search-btn">
               <svg width="20" height="20" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 15.5L11.5 11.5M13.5 7.5C13.5 10.8137 10.8137 13.5 7.5 13.5C4.18629 13.5 1.5 10.8137 1.5 7.5C1.5 4.18629 4.18629 1.5 7.5 1.5C10.8137 1.5 13.5 4.18629 13.5 7.5Z" stroke="#2874F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <div className="fk-nav-actions">
            <button className="fk-login-btn">Admin</button>
          </div>
        </div>
      </header>

      <main className="fk-container">
        <div className="fk-toolbar">
          <h2>All Orders ({filteredOrders.length})</h2>
        </div>

        {loading ? (
          <div className="fk-loader-container">
            <div className="fk-spinner"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="fk-empty-state">
            <p>No pending orders found.</p>
          </div>
        ) : (
          <div className="fk-order-list">
            {filteredOrders.map((order) => (
              <div 
                key={order.orderId} 
                className="fk-order-row"
                onClick={() => handleOrderClick(order)}
              >
                {/* Column 1: Icon */}
                <div className="fk-col fk-col-img">
                  <div className="fk-doc-box">
                    <span className="fk-doc-label">PDF</span>
                  </div>
                </div>

                {/* Column 2: Main Details */}
                <div className="fk-col fk-col-main">
                  <span className="fk-order-id">ID: {order.orderId}</span>
                  <p className="fk-doc-name">{order.name}</p>
                  <span className="fk-customer-name">Customer: {order.username}</span>
                </div>

                {/* Column 3: Price */}
                <div className="fk-col fk-col-price">
                  <span className="fk-price">₹{order.grandTotal}</span>
                  <span className="fk-pay-mode">Cash on Delivery</span>
                </div>

                {/* Column 4: Status */}
                <div className="fk-col fk-col-status">
                  <div className="fk-status-wrapper">
                    <div className="fk-dot dot-pending"></div>
                    <span className="fk-status-text">Ordered on {order.date || 'Today'}</span>
                  </div>
                  <span className="fk-delivery-estimate">Processing for print</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default XeroxOrdertempadmin;