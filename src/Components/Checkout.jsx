import React, { useState, useEffect } from "react";
import { database, auth } from "./firebase";
import { ref, set, get, push, update } from "firebase/database";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Navbar } from "./Login";

// 1. Image Mapping Object
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

const getImageUrl = (imageIdOrPath) => {
  if (!imageIdOrPath) return "/unknowenprofile.png";
  const idStr = String(imageIdOrPath).trim();
  if (IMAGE_ID_MAPPING[idStr]) return `/${IMAGE_ID_MAPPING[idStr]}`;
  return idStr;
};

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0); 
  const [totalMrp, setTotalMrp] = useState(0);      
  const [formData, setFormData] = useState({ username: "", phno: "", address: "" });

  const navigate = useNavigate();
  const location = useLocation();
  const productFromBuyNow = location.state?.product || null;

  // --- CALCULATION LOGIC ---
  const calculateTotals = (items) => {
    let mrpSum = 0;
    let sellingSum = 0;

    items.forEach(item => {
      const qty = parseInt(item.qty) || 1;
      const mrp = parseFloat(item.mrp) || 0;
      const selling = parseFloat(item.productamt) || 0;

      mrpSum += mrp * qty;
      sellingSum += selling * qty;
    });

    setTotalMrp(mrpSum);
    setTotalAmount(sellingSum);
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    const updatedItems = cartItems.map((item) => 
        item.id === itemId ? { ...item, qty: newQty } : item
    );
    setCartItems(updatedItems);
    calculateTotals(updatedItems);
    
    if (!productFromBuyNow && user) {
      try {
        await update(ref(database, `userscart/${user.uid}/${itemId}`), { qty: newQty });
      } catch (err) { console.error("Update Qty Error:", err); }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) { navigate("/login"); return; }
      setUser(currentUser);

      try {
        const userSnap = await get(ref(database, `users/${currentUser.uid}`));
        if (userSnap.exists()) {
          setFormData({ 
            username: userSnap.val().name || "", 
            phno: userSnap.val().phno || "", 
            address: userSnap.val().address || "" 
          });
        }

        if (productFromBuyNow) {
          // LOGIC FIX BASED ON YOUR IMAGE
          // input rawPrice (e.g. 100) and discount (e.g. 5)
          const rawPrice = typeof productFromBuyNow.productamt === "string" 
            ? parseFloat(productFromBuyNow.productamt.replace(/[₹,]/g, "")) 
            : parseFloat(productFromBuyNow.productamt || productFromBuyNow.price) || 0;

          const discountVal = parseFloat(productFromBuyNow.discount) || 0;

          // MRP is the original (100), ProductAmt is what they pay (100 - 5 = 95)
          const finalSellingPrice = rawPrice - discountVal;

          const singleItem = {
            id: productFromBuyNow.id || Date.now().toString(),
            productname: productFromBuyNow.productname || productFromBuyNow.name, 
            productamt: finalSellingPrice, 
            mrp: rawPrice,                 
            productimage: productFromBuyNow.productimage || productFromBuyNow.imageUrl || "", 
            brand: productFromBuyNow.brand || "",
            qty: 1
          };
          
          setCartItems([singleItem]);
          calculateTotals([singleItem]);
          setLoading(false);
        } else {
          await fetchCartItems(currentUser.uid);
        }
      } catch (err) { 
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate, productFromBuyNow]);

 const fetchCartItems = async (userId) => {
    const snapshot = await get(ref(database, `userscart/${userId}`));
    if (snapshot.exists()) {
      const items = [];
      snapshot.forEach(child => {
        const data = child.val();
        const selling = parseFloat(data.productamt) || parseFloat(data.price) || 0;
        const discount = parseFloat(data.discount) || 0;
        const mrp = parseFloat(data.mrp) || (selling + discount);
        
        items.push({ 
          id: child.key, 
          ...data,
          productname: data.productname || data.name,
          productamt: selling,
          mrp: mrp,
          qty: parseInt(data.qty) || 1
        });
      });
      setCartItems(items);
      calculateTotals(items);
    } else { navigate("/cart"); }
    setLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!formData.username || !formData.phno || !formData.address) { 
      alert("Please fill shipping details"); 
      return; 
    }
    if (totalAmount < 100) {
      alert(`Minimum order amount is ₹${100}. Please add more items to your cart.`);
      return;
    }
    const orderId = push(ref(database, "orders")).key;
    const completeOrder = { 
        ...formData, 
        orderTimestamp: Date.now(), 
        orderTotal: totalAmount.toFixed(2), 
        savings: (totalMrp - totalAmount).toFixed(2), 
        items: cartItems, 
        userId: user.uid,
        status: "Confirmed"
    };

    try {
      await set(ref(database, `userorders/${user.uid}/${orderId}`), completeOrder);
      await set(ref(database, `orders/${orderId}`), completeOrder);
      if (!productFromBuyNow) await set(ref(database, `userscart/${user.uid}`), null);
      navigate("/success", { state: { orderId, totalAmount: totalAmount.toFixed(2) } });
    } catch (err) { alert("Failed to place order."); }
  };

  if (loading) return <div className="fk-loader">Loading Checkout...</div>;

  return (
    <div className="fk-checkout-page">
      <Navbar user={user} />
      <div className="fk-checkout-container">
        <div className="fk-checkout-left">
          <div className="fk-step-card active">
            <div className="step-header active-header"><span></span> DELIVERY ADDRESS</div>
            <div className="step-body">
              <input className="fk-input" type="text" placeholder="Name" value={formData.username} onChange={(e)=>setFormData({...formData, username: e.target.value})} />
              <input className="fk-input" type="tel" placeholder="Mobile" value={formData.phno} onChange={(e)=>setFormData({...formData, phno: e.target.value})} />
              <textarea className="fk-input" placeholder="Address" rows="3" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})}></textarea>
            </div>
          </div>

          <div className="fk-step-card">
            <div className="step-header"><span></span> ORDER SUMMARY</div>
            <div className="step-body">
              {cartItems.map((item) => {
                const discountPercent = item.mrp > 0 ? Math.round(((item.mrp - item.productamt) / item.mrp) * 100) : 0;
                return (
                  <div key={item.id} className="fk-summary-item">
                    <div className="item-img-container">
                        <img src={getImageUrl(item.productimage)} alt={item.productname} onError={(e) => { e.target.src = "/unknowenprofile.png"; }} />
                    </div>
                    <div className="item-details">
                      <p className="brand-label">{item.brand || ""}</p>
                      <h4 className="product-name-text">{item.productname}</h4>
                      <div className="qty-controls">
                        <button onClick={() => updateQuantity(item.id, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                      </div>
                      <div className="item-price-row">
                        <span className="current-price">₹{item.productamt.toFixed(2)}</span>
                        {item.mrp > item.productamt && (
                          <>
                            <span className="old-mrp">₹{item.mrp.toFixed(2)}</span>
                            <span className="discount-tag-badge">{discountPercent}% OFF</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="fk-checkout-right">
          <div className="fk-price-card">
            <h3 className="price-title">PRICE DETAILS</h3>
            <div className="price-row"><span>Price</span><span>₹{totalMrp.toFixed(2)}</span></div>
            <div className="price-row"><span>Discount</span><span className="green">- ₹{(totalMrp - totalAmount).toFixed(2)}</span></div>
            <div className="price-row"><span>Delivery</span><span className="green">FREE</span></div>
            <div className="total-payable"><span>Total Payable</span><span>₹{totalAmount.toFixed(2)}</span></div>
            { (totalMrp - totalAmount) > 0 && (
              <p className="save-msg">You will save ₹{(totalMrp - totalAmount).toFixed(2)} on this order!</p>
            )}
            <button className="fk-confirm-btn" onClick={handlePlaceOrder}>CONFIRM ORDER</button>
          </div>
        </div>
      </div>
      
      <style>{`
        .fk-checkout-page { background: #f1f3f6; min-height: 100vh; font-family: Roboto, Arial, sans-serif; }
        .fk-checkout-header { background: #2874f0; padding: 12px 10%; }
        .fk-logo { height: 28px; }
        .fk-checkout-container { display: flex; max-width: 1100px; margin: 20px auto; gap: 16px; padding: 0 10px; }
        .fk-checkout-left { flex: 1; }
        .fk-checkout-right { width: 380px; position: sticky; top: 20px; }
        .fk-step-card { background: #fff; margin-bottom: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .step-header { padding: 15px 20px; font-weight: bold; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 15px; }
        .active-header { background: #2874f0; color: #fff; }
        .step-body { padding: 20px; }
        .fk-input { padding: 12px; border: 1px solid #e0e0e0; margin-bottom: 10px; width: 100%; box-sizing: border-box; }
        .fk-summary-item { display: flex; gap: 20px; padding: 15px 0; border-bottom: 1px solid #f0f0f0; }
        .item-img-container { width: 100px; height: 100px; }
        .item-img-container img { width: 100%; height: 100%; object-fit: contain; }
        .product-name-text { font-size: 18px; margin: 8px 0; font-weight: 600; }
        .qty-controls { display: flex; align-items: center; gap: 12px; margin: 10px 0; }
        .qty-controls button { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #c2c2c2; background: #fff; cursor: pointer; }
        .item-price-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
        .current-price { font-size: 20px; font-weight: bold; color: #212121; }
        .old-mrp { text-decoration: line-through; color: #878787; font-size: 14px; }
        .discount-tag-badge { background: #ff0000; color: #fff; font-size: 12px; padding: 2px 6px; font-weight: bold; border-radius: 2px; }
        .fk-price-card { background: #fff; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .price-title { color: #878787; font-size: 16px; margin-bottom: 20px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
        .price-row { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .green { color: #388e3c; }
        .total-payable { border-top: 1px dashed #e0e0e0; padding-top: 20px; font-weight: bold; font-size: 18px; display: flex; justify-content: space-between; }
        .save-msg { color: #388e3c; font-weight: bold; margin-top: 15px; font-size: 14px; }
        .fk-confirm-btn { background: #fb641b; color: #fff; border: none; width: 100%; padding: 15px; font-weight: bold; cursor: pointer; margin-top: 20px; font-size: 16px; }
        @media (max-width: 768px) { .fk-checkout-container { flex-direction: column; } .fk-checkout-right { width: 100%; position: static; } }
      `}</style>
    </div>
  );
};

export default Checkout;