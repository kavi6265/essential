import React, { useState, useEffect } from "react";
import { database, auth } from "./firebase";
import { ref, remove, update, onValue } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "./Login";

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
  const idStr = String(imageIdOrPath); // Ensure string conversion
  if (IMAGE_ID_MAPPING[idStr]) return `/${IMAGE_ID_MAPPING[idStr]}`;
  return idStr;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totalOriginal, setTotalOriginal] = useState(0); 
  const [totalAmount, setTotalAmount] = useState(0);     
  
  const navigate = useNavigate();

  const formatPrice = (num) => {
    return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
  };

  
      
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    
    const userCartRef = ref(database, `userscart/${currentUser.uid}`);
    onValue(userCartRef, (snapshot) => {
      const items = [];
      let mrpSumAccumulator = 0;
      let finalSumAccumulator = 0;

      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          const data = child.val();
          const qty = parseInt(data.qty) || 1;
          
          const productName = data.name || data.productname || "Product Name";
          
          // Price in DB is the discounted price (what they pay)
          const sellingPricePerUnit = parseFloat(data.price) || parseFloat(data.productamt) || 0;
          // Discount in DB is the flat amount (e.g., 20)
          const discountAmountPerUnit = parseFloat(data.discount) || 0;
          
          // MRP = Selling Price + Flat Discount Amount
          const mrpPricePerUnit = sellingPricePerUnit + discountAmountPerUnit; 

          // Calculate Percentage: (Discount / MRP) * 100
          const percentOff = mrpPricePerUnit > 0 
            ? Math.round((discountAmountPerUnit / mrpPricePerUnit) * 100) 
            : 0;

          mrpSumAccumulator += (mrpPricePerUnit * qty);
          finalSumAccumulator += (sellingPricePerUnit * qty);

          items.push({ 
            id: child.key, 
            ...data,
            displayName: productName,
            displayPrice: sellingPricePerUnit,
            displayDiscountAmt: discountAmountPerUnit,
            percentOff: percentOff, // Added this
            displayImage: String(data.imageUrl || data.productimageurl ||data.productimage|| ""),
            displayBrand: data.brand || "",
            qty: qty,
            calculatedSelling: (sellingPricePerUnit).toFixed(2),
            calculatedOriginal: mrpPricePerUnit
          });
        });
      }
      
      setCartItems(items);
      setTotalOriginal(mrpSumAccumulator); 
      setTotalAmount(finalSumAccumulator);   
      setLoading(false);
    });
  });
  return () => unsubscribe();
}, [navigate]);

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await update(ref(database, `userscart/${user.uid}/${itemId}`), { qty: newQty });
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="fk-loader">Loading...</div>;

  return (
    <div className="fk-cart-page">
      <Navbar user={user} />
      
      <div className="fk-cart-container">
        <div className="fk-cart-left">
          <div className="fk-cart-header">
            <h3>My Cart ({cartItems.length})</h3>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-state">
              <p>Your cart is empty!</p>
              <Link to="/" className="shop-btn">Shop Now</Link>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="fk-cart-item">
                  <div className="item-main">
                    <img 
                      // Fixed logic: Safe check for string and fallback
                      src={item.displayImage && item.displayImage.startsWith('http') 
                        ? item.displayImage 
                        : getImageUrl(item.displayImage)} 
                      alt={item.displayName} 
                      onError={(e) => { e.target.src = "/unknowenprofile.png"; }}
                    />
                    <div className="item-info">
                      <h4>{item.displayName}</h4>
                      <p style={{color: '#878787', fontSize: '12px'}}>{item.displayBrand}</p>
                      <div className="item-price-row">
  <span className="current-price">₹{formatPrice(item.calculatedSelling)}</span>
  
  {item.displayDiscountAmt > 0 && (
    <>
      <span className="old-mrp">₹{formatPrice(item.calculatedOriginal)}</span>
      {/* Exact percentage like your image */}
      <span className="discount-percentage-tag">{item.percentOff}% OFF</span>
    </>
  )}
</div>
                    </div>
                  </div>
                  <div className="item-actions">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.id, (item.qty || 1) - 1)}>−</button>
                      <input type="text" value={item.qty || 1} readOnly />
                      <button onClick={() => updateQuantity(item.id, (item.qty || 1) + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => remove(ref(database, `userscart/${user.uid}/${item.id}`))}>REMOVE</button>
                  </div>
                </div>
              ))}
              <div className="place-order-footer">
                <button className="place-order-btn" onClick={() => navigate("/checkout")}>PLACE ORDER</button>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="fk-cart-right">
            <div className="fk-price-card">
              <h3>PRICE DETAILS</h3>
              
              <div className="price-row">
                <span>Price (Total MRP)</span>
                <span>₹{formatPrice(totalOriginal)}</span>
              </div>

              <div className="price-row">
                <span>Discount (Total Saved)</span>
                <span className="green">- ₹{formatPrice(totalOriginal - totalAmount)}</span>
              </div>

              <div className="price-row">
                <span>Delivery Charges</span>
                <span className="green">FREE</span>
              </div>

              <div className="total-payable">
                <span>Total Amount (Final Payable)</span>
                <span>₹{formatPrice(totalAmount)}</span>
              </div>

              <p className="save-msg">
                You will save ₹{formatPrice(totalOriginal - totalAmount)} on this order
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .fk-cart-page { background: #f1f3f6; min-height: 100vh; font-family: sans-serif; padding-bottom: 80px; }
        .fk-cart-container { display: flex; max-width: 1200px; margin: 20px auto; gap: 16px; padding: 0 10px; }
        .fk-cart-left { flex: 1; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .fk-cart-header { padding: 15px 24px; border-bottom: 1px solid #f0f0f0; }
        .fk-cart-item { padding: 24px; border-bottom: 1px solid #f0f0f0; }
        .item-main { display: flex; gap: 20px; }
        .item-main img { width: 100px; height: 100px; object-fit: contain; }
        .brand-text { color: #878787; font-size: 12px; margin: 5px 0; }
        .item-info h4 { margin: 0; font-weight: 400; font-size: 16px; overflow: hidden; text-overflow: ellipsis; }
        .item-price-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
        .current-price { font-size: 18px; font-weight: bold; }
        .old-mrp { text-decoration: line-through; color: #878787; font-size: 14px; }
        .discount-percentage-tag { color: #c02333ff; font-weight: bold; font-size: 14px; }
        .item-actions { display: flex; align-items: center; gap: 25px; margin-top: 15px; padding-left: 120px; }
        .qty-controls { display: flex; align-items: center; }
        .qty-controls button { width: 28px; height: 28px; border: 1px solid #c2c2c2; background: #fff; border-radius: 50%; cursor: pointer; }
        .qty-controls input { width: 40px; text-align: center; border: 1px solid #c2c2c2; margin: 0 5px; height: 24px; }
        .remove-btn { background: none; border: none; font-weight: bold; cursor: pointer; font-size: 14px; color: #212121; }
        .fk-cart-right { width: 380px; position: sticky; top: 20px; height: fit-content; }
        .fk-price-card { background: #fff; padding: 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .price-row { display: flex; justify-content: space-between; margin: 20px 0; font-size: 15px; }
        .green { color: #388e3c; font-weight: 500; }
        .total-payable { border-top: 1px dashed #e0e0e0; padding: 20px 0; font-weight: bold; font-size: 18px; display: flex; justify-content: space-between; }
        .save-msg { color: #388e3c; font-weight: bold; border-top: 1px solid #f0f0f0; padding-top: 15px; font-size: 14px; }
        .place-order-footer { padding: 15px 24px; display: flex; justify-content: flex-end; border-top: 1px solid #f0f0f0; background: #fff; }
        .place-order-btn { background: #fb641b; color: #fff; border: none; padding: 12px 40px; font-weight: bold; cursor: pointer; border-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
        .empty-state { padding: 50px; text-align: center; }
        .shop-btn { display: inline-block; margin-top: 20px; padding: 10px 30px; background: #2874f0; color: #fff; text-decoration: none; border-radius: 2px; }
        .mobile-checkout-bar { display: none; }

        /* Mobile View Styles */
        @media (max-width: 768px) {
          .fk-cart-container { flex-direction: column; margin: 0; padding: 0; }
          .fk-cart-right { width: 100%; position: static; order: 2; margin-bottom: 100px; }
          .fk-cart-left { order: 1; }
          .desktop-only { display: none; }
          .item-main img { width: 60px; height: 60px; }
          .item-actions { padding-left: 0; justify-content: space-between; gap: 10px; }
          .fk-cart-item { padding: 15px; }
          .item-info h4 { font-size: 14px; }
          .current-price { font-size: 16px; }
          
          /* Sticky Mobile Footer */
          .mobile-checkout-bar {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            padding: 10px 20px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
          }
          .mobile-price-info { display: flex; flex-direction: column; }
          .mobile-old-price { text-decoration: line-through; color: #878787; font-size: 12px; }
          .mobile-final-price { font-size: 18px; font-weight: bold; color: #212121; }
          .mobile-checkout-bar .place-order-btn { padding: 12px 30px; width: 50%; }
        }
        
      `}</style>
    </div>
  );
};

export default Cart;