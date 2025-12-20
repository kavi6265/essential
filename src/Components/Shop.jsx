import React, { useState, useEffect } from "react"; 
import { useNavigate,useLocation, Link } from "react-router-dom"; 
import { database, auth } from "./firebase";
import { ref, push, set, get } from "firebase/database";
import "../css/shop.css";
import { Navbar } from "./BestProduct";


// Static image mapping
const IMAGE_ID_MAPPING = {
  "2131230840": "about_us.png", "2131230841": "afoursheet.png", "2131230842": "athreenote.png",
  "2131230843": "athreenotee.jpg", "2131230844": "athreenotess.jpg", "2131230847": "back.png",
  "2131230848": "backround_btn_profile.png", "2131230849": "backroundblack_btn_profile.png",
  "2131230850": "backspalsh.png", "2131230851": "badge_background.png", "2131230852": "banner_bgprofile.png",
  "2131230853": "baseline_add_24.png", "2131230854": "baseline_arrow_back_24.png",
  "2131230855": "baseline_call_24.png", "2131230856": "baseline_delete_24.png",
  "2131230857": "baseline_edit_24.png", "2131230858": "baseline_email_24.png",
  "2131230859": "baseline_file_download_24.png", "2131230860": "baseline_file_upload_24.png",
  "2131230861": "baseline_history_24.png", "2131230862": "baseline_home_24.png",
  "2131230863": "baseline_info_24.png", "2131230864": "baseline_keyboard_backspace_24.png",
  "2131230865": "baseline_local_printshop_24.png", "2131230866": "baseline_location_on_24.png",
  "2131230867": "baseline_lock_reset_24.png", "2131230868": "baseline_logout_24.png",
  "2131230869": "baseline_menu_24.png", "2131230870": "baseline_menu_book_24.png",
  "2131230871": "baseline_minimize_24.png", "2131230872": "baseline_person_24.png",
  "2131230873": "baseline_person_add_alt_1_24.png", "2131230874": "baseline_preview_24.png",
  "2131230875": "baseline_privacy_tip_24.png", "2131230876": "baseline_remove_red_eye_24.png",
  "2131230877": "baseline_search_24.png", "2131230878": "baseline_settings_24.png",
  "2131230879": "baseline_shopping_cart_24.png", "2131230880": "baseline_smartphone_24.png",
  "2131230881": "bikelogo.png", "2131230882": "bipolar.jpg", "2131230883": "black_circle.png",
  "2131230884": "bookimg.png", "2131230885": "books.png", "2131230886": "borrderlines.png",
  "2131230887": "btn_1.png", "2131230888": "btn_3.png", "2131230889": "btn_4.png",
  "2131230898": "btnbackroundprofile.png", "2131230899": "button_background.png",
  "2131230900": "calculatordeli.png", "2131230901": "calculatorr.png", "2131230902": "caltrix.jpg",
  "2131230957": "casio991.jpg", "2131230958": "circles.png", "2131230978": "cx.png",
  "2131230979": "cxd.png", "2131230985": "drafte1.png", "2131230986": "drafter.png",
  "2131230987": "drafter1.jpg", "2131230988": "draftercombo.png", "2131230989": "edittext_background.png",
  "2131230990": "edittext_background_wh.png", "2131230991": "eraser.png", "2131230992": "file_paths.png",
  "2131230993": "files.jpg", "2131230994": "flair.jpg", "2131230997": "gradient_circle.png",
  "2131230998": "graph.png", "2131230999": "graphh.png", "2131231000": "graybackround.png",
  "2131231001": "greycircle.png", "2131231002": "header_back.png", "2131231003": "home_bg_green.png",
  "2131231004": "hotot.jpg", "2131231005": "htt.jpg", "2131231008": "ic_baseline_email_24.png",
  "2131231009": "ic_baseline_person_24.png", "2131231010": "ic_baseline_security_24.png",
  "2131231020": "ic_launcher_background.png", "2131231021": "ic_launcher_foreground.png",
  "2131231033": "iconwhapp.png", "2131231035": "instalogo.png", "2131231036": "jasalogo.png",
  "2131231037": "jasalogo512px.png", "2131231038": "labcourt.png", "2131231039": "laodingpng.png",
  "2131231040": "lavender_round.png", "2131231062": "minus.png", "2131231100": "nav_item_background.png",
  "2131231101": "nav_profile.png", "2131231102": "nav_share.png", "2131231104": "note.png",
  "2131231118": "onebyone.png", "2131231119": "onebytwo.png", "2131231120": "pdflogo.png",
  "2131231121": "pen.png", "2131231122": "pencilcombo.png", "2131231123": "pencombo.png",
  "2131231124": "person3.jpg", "2131231125": "phonelogo.png", "2131231126": "phonepay.png",
  "2131231127": "phto.jpg", "2131231128": "pngegg.png", "2131231130": "previeew_bg.png",
  "2131231131": "productbackround.png", "2131231132": "productimagee.png", "2131231133": "profile_bg_green.png",
  "2131231134": "qrcodesalem.jpg", "2131231135": "rapcode.png", "2131231136": "red_circle.png",
  "2131231137": "review.png", "2131231138": "scale.png", "2131231139": "search_icon.png",
  "2131231140": "smallnote.jpg", "2131231141": "social_btn_background.png", "2131231142": "stabler.jpg",
  "2131231143": "stylishblackpen.png", "2131231144": "stylishpenblue.jpg", "2131231146": "tick.png",
  "2131231147": "tipbox.png", "2131231148": "tikpencil.png", "2131231151": "top_background.png",
  "2131231152": "uioop.png", "2131231153": "unknowenprofile.png", "2131231154": "upload.png",
  "2131231155": "upload2.png", "2131231156": "uploadqr.png", "2131231157": "vcc.jpg",
  "2131231158": "welcome.png", "2131231159": "white_box.png", "2131231160": "whitebg_profile.png",
  "2131231161": "whitebgcircleprofile.png", "2131231162": "whiteblack_bg.png",
  "2131231163": "women1.png", "2131231164": "xoblue.png", "2131231165": "xooblack.png"
};

const REVERSE_IMAGE_MAPPING = Object.fromEntries(
  Object.entries(IMAGE_ID_MAPPING).map(([id, filename]) => [filename, id])
);

const Shop = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const products = [
    { img: "casio991.jpg", brand: "Casio", name: "FX-991MS Scientific Calculator", price: "₹1165" },
    { img: "caltrix.jpg", brand: "Caltrix", name: "CX-991S Scientific Calculator", price: "₹600" },
    { img: "graphh.png", brand: "SVE SIDDHI VINAYAK ENTERPRISES", name: "Graph Notebook - A4 Size, 100 Pages", price: "₹100" },
    { img: "xooblack.png", brand: "Hauser", name: "XO Ball Pen - Black Ink", price: "₹10" },
    { img: "xoblue.png", brand: "Hauser", name: "XO Ball Pen - Blue Ink", price: "₹10" },
    { img: "stylishpenblue.jpg", brand: "Stylish", name: "X3 Ball Pen - Blue (0.7mm)", price: "₹7" },
    { img: "stylishblackpen.png", brand: "Stylish", name: "X3 Ball Pen - Black (0.7mm)", price: "₹7" },
    { img: "athreenotee.jpg", brand: "Jasa Essential", name: "A3 Drawing Book", price: "₹80" },
    { img: "tikpencil.png", brand: "Faber-Castell", name: "Tri-Click Mechanical Pencil 0.7mm", price: "₹15" },
    { img: "bipolar.jpg", brand: "Jasa Essential", name: "Bipolar Graph Book (100 sheets)", price: "₹100" },
    { img: "tipbox.png", brand: "Camlin Kokuyo", name: "0.7mm B Lead Tube", price: "₹5" },
    { img: "scale.png", brand: "Camlin", name: "Exam Portfolio Scale 30cm", price: "₹10" },
    { img: "eraser.png", brand: "Apsara", name: "White Eraser", price: "₹5" },
    { img: "drafter.png", brand: "ORFORX", name: "Mini Drafter with Steel Rod", price: "₹350" },
    { img: "afoursheet.png", brand: "TNPL", name: "A4 Copier Paper 80 GSM (500 Sheets)", price: "₹280" },
    { img: "note.png", brand: "Classmate", name: "Long Size Notebook A4 - 120 Pages (UnRuled)", price: "₹60" },
    { img: "smallnote.jpg", brand: "Classmate", name: "Small Size Notebook - 120 Pages (Ruled)", price: "₹40" },
    { img: "labcourt.png", brand: "ALIS", name: "Unisex Lab Coat/Apron Cotton White", price: "₹500" },
    { img: "stabler.jpg", brand: "Kangaro", name: "No. 10 Stapler", price: "₹60" },
  ];

  const categories = ["All", "Casio", "Classmate", "Faber-Castell", "Hauser", "Jasa Essential", "Camlin"];

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchCart(currentUser.uid);
      else setCartItems([]);
    });
    return () => unsubscribe();
  }, []);

  const fetchCart = async (uid) => {
    try {
      const userCartRef = ref(database, `userscart/${uid}`);
      const snapshot = await get(userCartRef);
      const items = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => items.push({ id: child.key, ...child.val() }));
      }
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = ref(database, "products");
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const fetchedProducts = [];
          snapshot.forEach((child) => {
            const product = child.val();
            fetchedProducts.push({
              img: product.imageUrl || "/placeholder.png",
              brand: product.brand || "Unknown",
              name: product.name,
              price: product.price,
              rating: product.rating || 0,
              description: product.description || product.discription || "",
              discount: product.discount,
            });
          });
          setDynamicProducts(fetchedProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const allProducts = [...products, ...dynamicProducts];
  const filteredProducts = allProducts.filter((product) => activeCategory === "All" || product.brand === activeCategory);

  const getImageIdForFilename = (filename) => REVERSE_IMAGE_MAPPING[filename] || "0";
  const isProductInCart = (product) => cartItems.some((item) => item.productname === product.name);

  const showToastNotification = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const addToCart = async (e, product) => {
    e.stopPropagation();
    if (!user) {
      showToastNotification("Please login to add items to cart", "warning");
      navigate("/login");
      return;
    }
    if (isProductInCart(product)) {
      showToastNotification("This product is already in your cart!", "info");
      return;
    }
    const imageId = getImageIdForFilename(product.img);
    const productData = {
      productname: product.name,
      productimage: parseInt(imageId, 10),
      productamt: product.price.toString().replace(/[₹,]/g, ""),
      qty: 1,
      rating: product.rating || 0,
      discription: `Brand: ${product.brand}, Product: ${product.name}`,
    };
    try {
      const userCartRef = ref(database, `userscart/${user.uid}`);
      const newProductRef = push(userCartRef);
      await set(newProductRef, productData);
      setCartItems([...cartItems, { id: newProductRef.key, ...productData }]);
      showToastNotification("Product added to cart successfully!", "success");
    } catch (error) {
      showToastNotification("Failed to add product.", "error");
    }
  };

  // Inside your Product Card component
const handleBuyNow = (e, product) => {
  e.stopPropagation();

  // 1. Get the numeric ID for static images or keep the URL for dynamic ones
  const imageId = getImageIdForFilename(product.img);
  
  // 2. Clean the price (remove ₹ and commas) to ensure it's a valid number
  const cleanPrice = product.price.toString().replace(/[₹,]/g, "");

  const checkoutProduct = {
    // Standardize keys for Checkout.jsx
    id: product.id || Date.now().toString(),
    productname: product.name,           // Use 'productname' not 'name'
    productamt: cleanPrice,              // Use 'productamt' not 'price'
    discount: product.discount || 0,
    productimage: imageId !== "0" ? imageId : product.img, // Send the ID if static
    brand: product.brand
  };

  navigate("/checkout", { state: { product: checkoutProduct } });
};

  const handleProductClick = (product) => navigate("/product", { state: { product } });
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="shop-container">
        <Navbar user={user} />
      <style jsx="true">{`
        /* ======================================================= */
        /* === DESKTOP & GLOBAL STYLES === */
        /* ======================================================= */
        .shop-container { background: #f6f7f9; min-height: 100vh; }
        
        .hero-section {
          background: linear-gradient(135deg, #007bff 0%, #1a42b8 100%);
          color: #fff; padding: 60px 20px; text-align: center;
        }

        .categories-section {
          max-width: 1300px; margin: 20px auto; padding: 10px 20px;
          display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
        }

        .category-btn {
          background: #fff; border: 1px solid #ddd; padding: 8px 18px;
          border-radius: 999px; cursor: pointer; transition: all 0.2s;
        }

        .category-btn.active { background: #007bff; color: #fff; border-color: #007bff; }

        .products-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px; padding: 0 20px; max-width: 1300px; margin: 0 auto;
        }

        .product-card {
          background: #fff; border: 1px solid #e0e0e0; border-radius: 8px;
          padding: 15px; position: relative; display: flex; flex-direction: column;
          transition: transform 0.2s; cursor: pointer;
        }

        .product-card:hover { transform: translateY(-5px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }

        /* --- LOGO AT TOP-RIGHT --- */
        /* --- LOGO AT TOP-RIGHT --- */
.product-image-container {
  width: 100%; 
  height: 150px; 
  position: relative; /* Context for absolute positioning */
  display: flex; 
  align-items: center; 
  justify-content: center; 
  margin-bottom: 10px;
}

/* Updated logo positioning */
.logo-checkout-btn {
  position: absolute; 
  top: -5px;     /* Small negative value to tuck it into the very corner */
  right: -5px;   /* Using 'right' ensures it stays inside the card on mobile */
  cursor: pointer; 
  z-index: 20;   /* High z-index to stay above everything */
  margin-left: 0; /* Remove the problematic margin-left */
}

.logo-checkout-btn img { 
  width: 45px !important; 
  height: 45px !important; 
}

/* Ensure the card doesn't hide the logo if it's slightly outside */
.product-card {
  background: #fff; 
  border: 1px solid #e0e0e0; 
  border-radius: 8px;
  padding: 15px; 
  position: relative; 
  display: flex; 
  flex-direction: column;
  transition: transform 0.2s; 
  cursor: pointer;
  overflow: visible !important; /* CRITICAL: prevents logo from being cut off */
}

/* ======================================================= */
/* === MOBILE VIEW OVERRIDES === */
/* ======================================================= */
/* ================= MOBILE PRODUCT ALIGNMENT ================= */

.scroll-to-top {
  position: fixed !important;
  bottom: 80px !important;   /* lifted above mobile bottom bar */
  right: 16px !important;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #2874f0;
  color: #fff;
  border: none;
  font-size: 20px;
  cursor: pointer;
  z-index: 9999 !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

/* Mobile specific */
@media (max-width: 600px) {
  .scroll-to-top {
    bottom: 90px !important;
    right: 12px !important;
  }
}

       /* ================= FORCE MOBILE 2-COLUMN GRID ================= */
@media (max-width: 600px) {

  .products-grid {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 10px !important;
    padding: 10px !important;
    width: 100% !important;
  }

  .product-card {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 10px !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }

  .product-image-container {
    height: 80px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .product-image-container img {
    max-width: 80% !important;
    max-height: 80% !important;
    object-fit: contain !important;
  }

  .product-info {
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
  }

  .product-name {
    font-size: 0.75rem !important;
    line-height: 1.2 !important;
    height: 32px !important;
    overflow: hidden !important;
  }

  .add-cart-btn {
    width: 100% !important;
    margin-top: auto !important;
    font-size: 0.75rem !important;
    padding: 8px 0 !important;
  }
  .logo-checkout-btn {
  position: absolute; 
  top: -18px;     /* Small negative value to tuck it into the very corner */
  right: -18px;   /* Using 'right' ensures it stays inside the card on mobile */
  cursor: pointer; 
  z-index: 20;   /* High z-index to stay above everything */
  margin-left: 0; /* Remove the problematic margin-left */
}
}

      `}</style>

      {showToast && <div className={`toast-notification ${toastType}`}>{toastMessage}</div>}

      <section className="hero-section">
        <div className="hero-content">
          <h2>Find Your Perfect Stationery</h2>
          <p>Discover quality supplies for school, college, and office needs</p>
        </div>
      </section>

      <section className="categories-section">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="products-section">
        <div className="products-grid">
          {filteredProducts.map((product, index) => {
            const inCart = isProductInCart(product);
            const priceNum = parseFloat(product.price.toString().replace(/[₹,]/g, "")) || 0;
            const discPercent = parseFloat(product.discount) || 0;
            const finalPrice =  (priceNum - (priceNum * discPercent) / 100).toFixed(2);

            return (
              <div className="product-card" key={index} onClick={() => handleProductClick(product)}>
                <div className="product-image-container">
                  <img src={product.img} alt={product.name} />
                  {product.discount && <span className="product-offer-badge">{product.discount}% OFF</span>}
                  
                  {/* Clickable Logo for Checkout (Top Right) */}
                  <div className="logo-checkout-btn" onClick={(e) => handleBuyNow(e, product)}>
                    <img src="/jasalogo512px.png" alt="Checkout" />
                  </div>
                </div>

                <div className="product-info">
                  <h5 className="product-name">{product.name}</h5>
                  <div className="product-price-display">
                    ₹{finalPrice} {product.discount && <span style={{textDecoration:'line-through', fontSize:'0.7rem', color:'#888', marginLeft: '5px'}}>{product.price}</span>}
                  </div>
                  <button className="add-cart-btn" onClick={(e) => addToCart(e, product)}>
                    {inCart ? "✔ Added" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {showScrollButton && <button className="scroll-to-top" style={{position:'fixed', bottom:'20px', left:'20px', padding:'10px 15px', borderRadius:'50%', background:'#2874f0', color:'white', border:'none', cursor:'pointer'}} onClick={scrollToTop}>↑</button>}

    
    </div>
  );
};

export default Shop;