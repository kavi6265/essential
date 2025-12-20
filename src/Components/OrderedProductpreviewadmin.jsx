import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "./firebase";
import { ref as dbRef, onValue, update, set } from "firebase/database";
import "../css/OrderedProductpreviewadmin.css";

// 1. Image Mapping Object (Synchronized with Checkout.js)
const IMAGE_ID_MAPPING = { 
  "2131230840": "about_us.png",
  "2131230841": "afoursheet.png",
  "2131230842": "athreenote.png",
  "2131230843": "athreenotee.jpg",
  "2131230844": "athreenotess.jpg",
  "2131230847": "back.png",
  "2131230848": "backround_btn_profile.png",
  "2131230849": "backroundblack_btn_profile.png",
  "2131230850": "backspalsh.png",
  "2131230851": "badge_background.png",
  "2131230852": "banner_bgprofile.png",
  "2131230853": "baseline_add_24.png",
  "2131230854": "baseline_arrow_back_24.png",
  "2131230855": "baseline_call_24.png",
  "2131230856": "baseline_delete_24.png",
  "2131230857": "baseline_edit_24.png",
  "2131230858": "baseline_email_24.png",
  "2131230859": "baseline_file_download_24.png",
  "2131230860": "baseline_file_upload_24.png",
  "2131230861": "baseline_history_24.png",
  "2131230862": "baseline_home_24.png",
  "2131230863": "baseline_info_24.png",
  "2131230864": "baseline_keyboard_backspace_24.png",
  "2131230865": "baseline_local_printshop_24.png",
  "2131230866": "baseline_location_on_24.png",
  "2131230867": "baseline_lock_reset_24.png",
  "2131230868": "baseline_logout_24.png",
  "2131230869": "baseline_menu_24.png",
  "2131230870": "baseline_menu_book_24.png",
  "2131230871": "baseline_minimize_24.png",
  "2131230872": "baseline_person_24.png",
  "2131230873": "baseline_person_add_alt_1_24.png",
  "2131230874": "baseline_preview_24.png",
  "2131230875": "baseline_privacy_tip_24.png",
  "2131230876": "baseline_remove_red_eye_24.png",
  "2131230877": "baseline_search_24.png",
  "2131230878": "baseline_settings_24.png",
  "2131230879": "baseline_shopping_cart_24.png",
  "2131230880": "baseline_smartphone_24.png",
  "2131230881": "bikelogo.png",
  "2131230882": "bipolar.jpg",
  "2131230883": "black_circle.png",
  "2131230884": "bookimg.png",
  "2131230885": "books.png",
  "2131230886": "borrderlines.png",
  "2131230887": "btn_1.png",
  "2131230888": "btn_3.png",
  "2131230889": "btn_4.png",
  "2131230898": "btnbackroundprofile.png",
  "2131230899": "button_background.png",
  "2131230900": "calculatordeli.png",
  "2131230901": "calculatorr.png",
  "2131230902": "caltrix.jpg",
  "2131230957": "casio991.jpg",
  "2131230958": "circles.png",
  "2131230978": "cx.png",
  "2131230979": "cxd.png",
  "2131230985": "drafte1.png",
  "2131230986": "drafter.png",
  "2131230987": "drafter1.jpg",
  "2131230988": "draftercombo.png",
  "2131230989": "edittext_background.png",
  "2131230990": "edittext_background_wh.png",
  "2131230991": "eraser.png",
  "2131230992": "file_paths.png",
  "2131230993": "files.jpg",
  "2131230994": "flair.jpg",
  "2131230997": "gradient_circle.png",
  "2131230998": "graph.png",
  "2131230999": "graphh.png",
  "2131231000": "graybackround.png",
  "2131231001": "greycircle.png",
  "2131231002": "header_back.png",
  "2131231003": "home_bg_green.png",
  "2131231004": "hotot.jpg",
  "2131231005": "htt.jpg",
  "2131231008": "ic_baseline_email_24.png",
  "2131231009": "ic_baseline_person_24.png",
  "2131231010": "ic_baseline_security_24.png",
  "2131231020": "ic_launcher_background.png",
  "2131231021": "ic_launcher_foreground.png",
  "2131231033": "iconwhapp.png",
  "2131231035": "instalogo.png",
  "2131231036": "jasalogo.png",
  "2131231037": "jasalogo512px.png",
  "2131231038": "labcourt.png",
  "2131231039": "laodingpng.png",
  "2131231040": "lavender_round.png",
  "2131231062": "minus.png",
  "2131231100": "nav_item_background.png",
  "2131231101": "nav_profile.png",
  "2131231102": "nav_share.png",
  "2131231104": "note.png",
  "2131231118": "onebyone.png",
  "2131231119": "onebytwo.png",
  "2131231120": "pdflogo.png",
  "2131231121": "pen.png",
  "2131231122": "pencilcombo.png",
  "2131231123": "pencombo.png",
  "2131231124": "person3.jpg",
  "2131231125": "phonelogo.png",
  "2131231126": "phonepay.png",
  "2131231127": "phto.jpg",
  "2131231128": "pngegg.png",
  "2131231130": "previeew_bg.png",
  "2131231131": "productbackround.png",
  "2131231132": "productimagee.png",
  "2131231133": "profile_bg_green.png",
  "2131231134": "qrcodesalem.jpg",
  "2131231135": "rapcode.png",
  "2131231136": "red_circle.png",
  "2131231137": "review.png",
  "2131231138": "scale.png",
  "2131231139": "search_icon.png",
  "2131231140": "smallnote.jpg",
  "2131231141": "social_btn_background.png",
  "2131231142": "stabler.jpg",
  "2131231143": "stylishblackpen.png",
  "2131231144": "stylishpenblue.jpg",
  "2131231146": "tick.png",
  "2131231147": "tipbox.png",
  "2131231148": "tippencil.png",
  "2131231151": "top_background.png",
  "2131231152": "uioop.png",
  "2131231153": "unknowenprofile.png",
  "2131231154": "upload.png",
  "2131231155": "upload2.png",
  "2131231156": "uploadqr.png",
  "2131231157": "vcc.jpg",
  "2131231158": "welcome.png",
  "2131231159": "white_box.png",
  "2131231160": "whitebg_profile.png",
  "2131231161": "whitebgcircleprofile.png",
  "2131231162": "whiteblack_bg.png",
  "2131231163": "women1.png",
  "2131231164": "xoblue.png",
  "2131231165": "xooblack.png",
};

// 2. Helper function to resolve image sources
const getImageUrl = (imageIdOrPath) => {
  if (!imageIdOrPath) return "/unknowenprofile.png";
  const idStr = String(imageIdOrPath).trim();
  
  // Check if it's a numeric ID that exists in our map
  if (IMAGE_ID_MAPPING[idStr]) {
    return `/${IMAGE_ID_MAPPING[idStr]}`;
  }
  
  // If it's already a full URL
  if (idStr.startsWith("http")) return idStr;
  
  // If it's a local path already
  if (idStr.startsWith("/")) return idStr;

  // Fallback to placeholder
  return "/unknowenprofile.png";
};

function OrderedProductpreviewadmin() {
  const { orderId, userId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && orderId) {
      const orderRef = dbRef(database, `userorders/${userId}/${orderId}`);
      const unsubscribe = onValue(orderRef, (snapshot) => {
        if (!snapshot.exists()) {
          setOrder(null);
        } else {
          const data = snapshot.val();
          
          // Determine items list (handles both array and object formats)
          const items = data.items 
            ? Object.values(data.items) 
            : Object.entries(data)
                .filter(([key]) => !["orderTotal", "orderTimestamp", "username", "phno", "address", "notes", "delivered", "ordered", "status", "userId", "savings"].includes(key))
                .map(([_, value]) => value);

          setOrder({
            ...data,
            orderId: orderId,
            products: items
          });
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching order:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [userId, orderId]);

  const markAsDelivered = () => {
    if (!orderId || !userId) return;
    setUpdating(true);

    const updates = {};
    updates[`userorders/${userId}/${orderId}/delivered`] = true;
    updates[`orders/${orderId}/status`] = "Delivered";

    update(dbRef(database), updates)
      .then(() => {
        // Also copy to the dedicated admin node
        const adminRef = dbRef(database, `deliveredordersadmin/${orderId}`);
        return set(adminRef, { ...order, delivered: true, status: "Delivered" });
      })
      .then(() => {
        setUpdating(false);
        alert("✅ Order marked as delivered!");
      })
      .catch((err) => {
        console.error("Update failed:", err);
        setUpdating(false);
      });
  };

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    return new Date(ts).toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) return <div className="admin-loader">Loading Order Details...</div>;

  if (!order) {
    return (
      <div className="not-found-container">
        <h2>Order Not Found</h2>
        <button onClick={() => navigate(-1)}>Back to Orders</button>
      </div>
    );
  }

  return (
    <div className="admin-order-preview">
      <div className="preview-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1>Order #...{order.orderId.slice(-6)}</h1>
      </div>

      <div className="preview-grid">
        {/* Left Column: Customer & Shipping */}
        <div className="info-section">
          <div className="card">
            <h3><i className="bx bx-user"></i> Customer Info</h3>
            <p><strong>Name:</strong> {order.username}</p>
            <p><strong>Phone:</strong> {order.phno}</p>
            <p><strong>Placed on:</strong> {formatDate(order.orderTimestamp)}</p>
          </div>

          <div className="card">
            <h3><i className="bx bx-map"></i> Shipping Address</h3>
            <p className="address-text">{order.address}</p>
            {order.notes && <p className="notes-text"><strong>Notes:</strong> {order.notes}</p>}
          </div>

          <div className="card status-card">
            <h3>Status</h3>
            <div className={`status-badge ${order.delivered ? "delivered" : "pending"}`}>
              {order.delivered ? "DELIVERED" : "PENDING"}
            </div>
            {!order.delivered && (
              <button 
                className="delivery-btn" 
                onClick={markAsDelivered} 
                disabled={updating}
              >
                {updating ? "Updating..." : "Mark as Delivered"}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Items & Payment */}
        <div className="items-section">
          <div className="card">
            <h3>Order Items ({order.products.length})</h3>
            <div className="admin-items-list">
              {order.products.map((item, idx) => (
                <div key={idx} className="admin-item-row">
                  <img 
                    src={getImageUrl(item.productimage)} 
                    alt="" 
                    onError={(e) => e.target.src = "/unknowenprofile.png"}
                  />
                  <div className="item-meta">
                    <h4>{item.productname}</h4>
                    <p>₹{item.productamt} x {item.qty}</p>
                  </div>
                  <div className="item-total">
                    ₹{(parseFloat(item.productamt) * (parseInt(item.qty) || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="admin-payment-summary">
              <div className="pay-row">
                <span>Subtotal</span>
                <span>₹{order.orderTotal}</span>
              </div>
              <div className="pay-row">
                <span>Delivery</span>
                <span className="free">FREE</span>
              </div>
              <div className="pay-row grand-total">
                <span>Total Amount</span>
                <span>₹{order.orderTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderedProductpreviewadmin;