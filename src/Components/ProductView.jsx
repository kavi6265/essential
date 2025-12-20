import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { database, auth } from "./firebase";
import { ref, push, set, onValue } from "firebase/database";
import "../css/ProductView.css";


export function Navbar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("search") || "");
  }, [location.search]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/best-product?search=${encodeURIComponent(searchQuery)}`);
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  /* Icons */
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
  const HeaderHomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
  const HeaderCartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
  const HeaderUserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  );

  return (
    <>
      <header className="fk-header">
        <div className="fk-desktop-row">
          <div className="fk-left-section">
            <div className="fk-logo" onClick={() => navigate("/")}>
              <img src="/jasalogo512px.png" alt="Logo" />
            </div>
          </div>
          
          <div className="fk-search-new-style desktop-center-search">
            <input
              type="text"
              placeholder="Search of your order"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <span onClick={handleSearch}><SearchIcon /></span>
          </div>

          <div className="fk-right-buttons">
            <Link to="/" className={`fk-header-btn home-btn secondary-btn ${isActive("/")}`}>
                <HeaderHomeIcon /> <span>Home</span>
            </Link>
            <Link to="/cart" className={`fk-header-btn cart-btn secondary-btn ${isActive("/cart")}`}>
                <HeaderCartIcon /> <span>Cart</span>
            </Link>
            {user ? (
              <Link to="/profile" className={`fk-header-btn profile-btn secondary-btn ${isActive("/profile")}`}>
                <HeaderUserIcon /> <span>Profile</span>
              </Link>
            ) : (
              <Link to="/login" className={`fk-header-btn login-btn primary-btn ${isActive("/login")}`}>
                <HeaderUserIcon /> <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        <div className="fk-mobile-header">
          <div className="fk-logo" onClick={() => navigate("/")}>
            <img src="/jasalogo512px.png" alt="Logo" />
          </div>
          <div className="fk-search-new-style">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span onClick={handleSearch}><SearchIcon /></span>
          </div>
        </div>
      </header>

      <nav className="fk-bottom-nav">
        <Link to="/" className={isActive("/")}><HeaderHomeIcon /><span>Home</span></Link>
        <Link to="/cart" className={isActive("/cart")}><HeaderCartIcon /><span>Cart</span></Link>
        {user ? (
          <Link to="/profile" className={isActive("/profile")}><HeaderUserIcon /><span>Profile</span></Link>
        ) : (
          <Link to="/login" className={isActive("/login")}><HeaderUserIcon /><span>Login</span></Link>
        )}
      </nav>

      <style>{`
        /* ... Paste your CSS styles here ... */
         * { box-sizing: border-box; }

        .fk-header {
          background: #fff;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .fk-logo img {
          height: 45px;
          cursor: pointer;
        }

        /* --- DESKTOP STRUCTURE --- */
        
        .fk-desktop-row {
          display: flex;
          align-items: center;
          justify-content: space-between; 
          padding: 10px 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .fk-left-section {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-shrink: 0;
        }

        /* 1. RESTORED: Search Box (Center) */
        .fk-search-new-style {
          flex-grow: 1;
          max-width: 500px;
          margin: 0 20px;
          position: relative; 
          display: flex;
          align-items: center;
          border: 1.5px solid #ccc;
          border-radius: 999px;
          height: 40px;
          overflow: hidden; 
        }
        
        /* Ensure search bar is centered only on desktop */
        .desktop-center-search {
             margin: 0 20px; 
        }

        .fk-search-new-style input {
          flex: 1;
          border: none;
          outline: none;
          padding: 0 10px 0 20px;
          font-size: 14px;
          color: #333;
          height: 100%;
        }
        
        .fk-search-new-style input::placeholder {
            color: #aaa;
        }

        .fk-search-new-style span {
            cursor: pointer;
            padding: 0 15px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border-left: none;
        }
        
        .fk-search-new-style span svg {
             /* Use the primary blue color for the search icon */
            stroke: #007bff; 
        }

        /* 2. Right-side Buttons (Home/Cart/Profile/Login) */
        .fk-right-buttons {
            display: flex;
            gap: 5px;
            flex-shrink: 0;
        }
        
        /* Base button styles */
        .fk-header-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            cursor: pointer;
            
            /* Unified Size and Shape */
            height: 40px;
            padding: 0 18px; 
            border-radius: 999px; 
            
            font-size: 14px;
            font-weight: 600;
            transition: background 0.2s, color 0.2s, border-color 0.2s; 
            
            white-space: nowrap; 
            min-width: fit-content;
        }
        
        .fk-header-btn svg {
            margin-right: 5px;
            stroke-width: 2;
            width: 18px; 
            height: 18px; 
        }
        
        /* 🔵 Primary Button Style (Solid Blue - used for Login) */
        .primary-btn {
            background-color: #007bff; /* Solid Blue */
            border: 1px solid #007bff;
            color: #ffffff; 
        }

        .primary-btn svg {
            stroke: #ffffff; 
        }
        
        /* ⚪ Secondary Button Style (White/Blue Border - Default/Inactive) */
        .secondary-btn {
            background-color: #ffffff; 
            border: 1px solid #007bff; /* Blue Border */
            color: #007bff; /* Blue text */
        }
        
        .secondary-btn svg {
            stroke: #007bff; /* Blue icon stroke */
        }
        
        /* 🎨 Active State for Secondary Buttons (Solid Blue Background) */
        .secondary-btn.active {
            background-color: #007bff; /* Solid Blue */
            border-color: #007bff; 
            color: #ffffff; /* White text */
        }
        
        .secondary-btn.active svg {
            stroke: #ffffff; /* White icon */
        }


        /* Clear previous icon styles */
        .fk-desktop-icons, .fk-icons-new-style {
          display: none;
        }


        /* ================= MOBILE ================= */
        .fk-mobile-header,
        .fk-bottom-nav {
          display: none;
        }
        
        @media (max-width: 900px) {

          body {
            padding-bottom: 60px;
          }

          .fk-desktop-row {
            display: none;
          }

          /* Mobile header container now includes logo and search */
          .fk-mobile-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
          }
          
          .fk-mobile-header .fk-logo {
            flex-shrink: 0; 
          }

          /* Mobile search style: takes up remaining space */
          .fk-mobile-header .fk-search-new-style {
            display: flex; /* Override desktop hidden state */
            flex-grow: 1;
            max-width: none; 
            margin: 0; /* Remove desktop margin */
          }
          
          /* Hide the desktop icons in the mobile header view */
          .fk-desktop-icons {
            display: none;
          }

          /* Mobile Bottom Nav Styles */
          .fk-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 60px;
            background: #281c72ff;
            color: #fff;
            justify-content: space-around;
            align-items: center;
            z-index: 9999;
          }

          .fk-bottom-nav a,
          .fk-bottom-nav div {
            color: #fff;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 11px;
            cursor: pointer;
          }
          
          .fk-bottom-nav a svg,
          .fk-bottom-nav div svg {
              stroke: #fff;
          }

          .fk-bottom-nav .active {
            color: #1a73e8; 
          }
          
          .fk-bottom-nav .active svg {
             stroke: #1a73e8;
          }
        }
      `}</style>
    </>
  );
}

// Image ID mapping
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

function ProductView() {
  const location = useLocation();
  const navigate = useNavigate();

  const rawLocationProduct = location.state?.product || null;

  const [currentProduct, setCurrentProduct] = useState(null);
  const [dynamicProducts, setDynamicProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showCartPreview, setShowCartPreview] = useState(false);

  const normalizeProduct = (p = {}) => {
    const copy = { ...(p || {}) };

    let priceNum = 0;
    if (typeof copy.price === "number") priceNum = copy.price;
    else if (typeof copy.price === "string") priceNum = parseFloat(copy.price.replace(/[^\d.]/g, "")) || 0;
    else if (typeof copy.productamt === "string") priceNum = parseFloat(copy.productamt.replace(/[^\d.]/g, "")) || 0;
    else priceNum = Number(copy.productamt) || 0;

    let discountRaw = copy.discount ?? copy.discountPercent ?? copy.discountamt ?? null;
    let discountPercent = null;
    let discountPriceValue = null;

    if (discountRaw != null) {
      const dStr = String(discountRaw).trim();
      if (dStr.includes("%")) {
        discountPercent = parseFloat(dStr.replace(/[^\d.]/g, "")) || 0;
      } else {
        const dNum = parseFloat(dStr.replace(/[^\d.]/g, "")) || 0;
        if (dNum > 0 && dNum <= 100) {
          discountPercent = dNum;
        } else if (dNum > 100 && dNum < priceNum) {
          discountPriceValue = dNum;
        } else if (dNum > 0 && priceNum > 0 && dNum < priceNum) {
          discountPriceValue = dNum;
        }
      }
    }

    if (discountPercent != null && priceNum && discountPercent > 0 && discountPercent <= 100) {
      discountPriceValue = +(priceNum - (priceNum * discountPercent) / 100).toFixed(2);
    }

    const priceStr = `₹${Number(priceNum).toFixed(2).replace(/\.00$/, "")}`;
    const discountPriceStr = discountPriceValue ? `₹${Number(discountPriceValue).toFixed(2).replace(/\.00$/, "")}` : null;

    const img = copy.imageUrl || copy.img || copy.productimage || copy.productimageurl || "";
    const smallImages = (copy.smallImages && Array.isArray(copy.smallImages)) 
      ? copy.smallImages 
      : [img, img, img, img];

    return {
      id: copy.id || copy.key || copy.productid || null,
      name: copy.name || copy.productname || "Unnamed product",
      brand: copy.brand || copy.manufacturer || "Unknown",
      description: copy.description || copy.discription || copy.productdesc || "",
      priceValue: Number(priceNum) || 0,
      price: priceStr,
      discountPercent: discountPercent || 0,
      discountPriceValue: discountPriceValue || null,
      discountPrice: discountPriceStr,
      img,
      smallImages,
      raw: copy,
    };
  };

  const getImagePath = (img) => {
    if (!img) return "/unknowenprofile.png";
    try {
      if (typeof img !== "string") return "/unknowenprofile.png";
      if (img.startsWith("/") || img.startsWith("http")) return img;
      if (/^\d+$/.test(img) && IMAGE_ID_MAPPING[img]) return `/${IMAGE_ID_MAPPING[img]}`;
      if (/\.(png|jpe?g|webp|gif)$/i.test(img)) return `/${img}`;
      const found = Object.entries(IMAGE_ID_MAPPING).find(([k, v]) => v === img);
      if (found) return `/${found[1]}`;
      return "/unknowenprofile.png";
    } catch (err) {
      return "/unknowenprofile.png";
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        const cartRef = ref(database, `userscart/${user.uid}`);
        onValue(cartRef, snapshot => {
          const data = snapshot.val();
          const items = data ? Object.values(data) : [];
          setCartItems(items);
          if (currentProduct) setIsInCart(items.some(it => it.productname === currentProduct.name));
        });
      } else {
        setCartItems([]);
      }
    });
    return () => unsub();
  }, [currentProduct]);

  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsub = onValue(productsRef, snapshot => {
      const data = snapshot.val() || {};
      const arr = Object.entries(data).map(([k, v]) => ({ id: k, ...v }));
      const normalized = arr.map(normalizeProduct);
      setDynamicProducts(normalized);
      setLoading(false);

      if (rawLocationProduct && !currentProduct) {
        const normalizedFromLocation = normalizeProduct(rawLocationProduct);
        setCurrentProduct(normalizedFromLocation);
      } else if (!currentProduct && normalized.length > 0) {
        setCurrentProduct(normalized[0]);
      }
    }, err => {
      console.error("products onValue error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (rawLocationProduct && dynamicProducts.length > 0) {
      const match = dynamicProducts.find(d => {
        if (!rawLocationProduct) return false;
        return (rawLocationProduct.id && d.id === rawLocationProduct.id) || (rawLocationProduct.name && d.name === rawLocationProduct.name);
      });
      if (match) setCurrentProduct(match);
      else setCurrentProduct(normalizeProduct(rawLocationProduct));
    }
  }, [rawLocationProduct, dynamicProducts]);

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const checkIfProductInCart = (product) => {
    if (!product) return false;
    return cartItems.some(item => item.productname === product.name);
  };

  const addToCart = (productToAdd = currentProduct, qty = quantity) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (!productToAdd) return;

    if (checkIfProductInCart(productToAdd)) {
      showNotification(`${productToAdd.name} is already in your cart!`);
      return;
    }

    const cartRef = ref(database, `userscart/${currentUser.uid}`);
    const newItemRef = push(cartRef);

    // MODIFIED LOGIC:
    // Determine the selling price (discounted price if it exists, otherwise original)
    const priceToSave = (productToAdd.discountPriceValue && productToAdd.discountPriceValue > 0)
      ? productToAdd.discountPriceValue
      : productToAdd.priceValue;

    // Calculate the actual discount value (Original - Discounted)
    const discountValue = (productToAdd.discountPriceValue && productToAdd.discountPriceValue > 0)
      ? (productToAdd.priceValue - productToAdd.discountPriceValue).toFixed(2)
      : 0;

    const itemData = {
      key: newItemRef.key,
      productname: productToAdd.name,
      productamt: String(priceToSave),
      discount: String(discountValue), // New field: Stores the saved amount
      productimage: productToAdd.img,
      qty,
      rating: productToAdd.raw?.rating || 0,
      discription: productToAdd.description || `Brand: ${productToAdd.brand}`,
    };

    set(newItemRef, itemData)
      .then(() => {
        showNotification(`${productToAdd.name} added to cart!`);
        setShowCartPreview(true);
        setTimeout(() => setShowCartPreview(false), 4500);
        setIsInCart(true);
      })
      .catch(err => {
        console.error("addToCart error:", err);
        alert("Failed to add to cart");
      });
  };

  const goToCart = () => navigate("/cart");
  const setMainDisplayImg = (newImgUrl) => {
    setCurrentProduct(prev => ({ ...prev, img: newImgUrl }));
  };

  const relatedProducts = () => {
    if (!currentProduct) return [];
    const sameBrand = dynamicProducts.filter(item => item.id !== currentProduct.id && item.brand === currentProduct.brand);
    const others = dynamicProducts.filter(item => item.id !== currentProduct.id && item.brand !== currentProduct.brand);
    return [...sameBrand, ...others].slice(0, 3);
  };

  if (loading || !currentProduct) {
    return <div className="section-p1"><h2>Loading product...</h2></div>;
  }

  return (
    <div>
     <Navbar user={currentUser} />
      {/* Toast */}
      <div className={`toast ${showToast ? "show" : ""}`}>
        <i className={`bx ${toastMessage.includes("already") ? "bx-info-circle" : "bx-check-circle"}`}></i>
        <span>{toastMessage}</span>
      </div>

      {/* Cart preview */}
      {/* Cart preview */}
{showCartPreview && (
  <div className="cart-preview-overlay">
    <div className="cart-preview-container">
      <div className="cart-preview-header">
        <h3>Cart Preview</h3>
        <button className="close-preview" onClick={() => setShowCartPreview(false)}>
          <i className="bx bx-x"></i>
        </button>
      </div>
      
      <div className="cart-preview-items">
        {cartItems.length > 0 ? (
          cartItems.slice(-3).reverse().map((item, idx) => (
            <div className="cart-preview-item" key={idx}>
              <div className="cart-preview-img">
                <img src={getImagePath(item.productimage)} alt={item.productname} />
              </div>
              <div className="cart-preview-details">
                <h4>{item.productname}</h4>
                <p className="preview-price">₹{item.productamt} <span className="preview-qty">× {item.qty}</span></p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-msg">Your cart is empty</p>
        )}
      </div>

      <div className="cart-preview-footer">
        <div className="item-count">
          <strong>{cartItems.length}</strong> {cartItems.length === 1 ? 'item' : 'items'} in cart
        </div>
        <button className="view-cart-btn" onClick={goToCart}>View Full Cart</button>
      </div>
    </div>
  </div>
)}
      {/* Product Details */}
      <section id="prodetails" className="section-p1">
        <div className="single-pro-image">
          <img src={getImagePath(currentProduct.img)} alt={currentProduct.name} width="100%" onError={(e)=>{e.target.onerror=null;e.target.src="/unknowenprofile.png"}} />
          <div className="small-img-group">
            {currentProduct.smallImages.map((imgUrl, idx) => (
              <div className="small-img-col" key={idx} onClick={() => setMainDisplayImg(imgUrl)}>
                <img 
                  src={getImagePath(imgUrl)} 
                  alt="Thumbnail" 
                  className="small-img" 
                  onError={(e)=>{e.target.onerror=null;e.target.src="/unknowenprofile.png"}} 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="single-pro-details">
          <h6>Home / {currentProduct.brand}</h6>
          <h4>{currentProduct.name}</h4>

          <div className="price-container">
            {currentProduct.discountPriceValue ? (
              <div className="price-row">
                <span className="old-price">{currentProduct.price}</span>
                <span className="new-price">{currentProduct.discountPrice}</span>
                {currentProduct.discountPercent > 0 && (
                  <span className="discount-badge">{currentProduct.discountPercent}% OFF</span>
                )}
              </div>
            ) : (
              <h3 className="single-price">{currentProduct.price}</h3>
            )}
          </div>

          <div className="add-to-cart-container">
            <div className="quantity-controls">
              <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} disabled={isInCart}>-</button>
              <input type="number" value={quantity} min="1" onChange={e => setQuantity(Number(e.target.value || 1))} disabled={isInCart}/>
              <button onClick={() => setQuantity(q => q + 1)} disabled={isInCart}>+</button>
            </div>

            {isInCart ? (
              <button className="normal in-cart-btn" onClick={goToCart}>
                <i className="bx bx-check"></i> Already in Cart
              </button>
            ) : (
              <button className="normal add-cart-btn" onClick={() => addToCart()}>
                <i className="bx bx-cart-add"></i> Add To Cart
              </button>
            )}
          </div>

          <div className="product-info">
            <h4>Product Details</h4>
            <span>{currentProduct.description || "No description available"}</span>
          </div>
        </div>
      </section>

      {/* Newly Added Products */}
      <section id="product1" className="section-p1">
        <h2>Newly Added Products</h2>
        <div className="pro-container">
          {dynamicProducts.map((item, idx) => (
            <div
              className="pro"
              key={idx}
              onClick={() => {
                setCurrentProduct(item);
                setIsInCart(checkIfProductInCart(item));
                setQuantity(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img src={getImagePath(item.img)} alt={item.name} onError={(e)=>{e.target.onerror=null;e.target.src="/unknowenprofile.png"}} />
              <div className="des">
                <span>{item.brand}</span>
                <h5>{item.name}</h5>
                <div className="price-tag">
                  {item.discountPriceValue ? (
                    <h4>
                      <span className="old-price">{item.price}</span>{" "}
                      <span className="new-price">{item.discountPrice}</span>
                      {item.discountPercent > 0 && <span className="discount-badge small">{item.discountPercent}% OFF</span>}
                    </h4>
                  ) : (
                    <h4>{item.price}</h4>
                  )}
                </div>
              </div>
              {checkIfProductInCart(item) ? (
                <a href="#" onClick={e => { e.preventDefault(); showNotification(`${item.name} is already in your cart!`); }}>
                  <i className="bx bx-check cart-added"></i>
                </a>
              ) : (
                <a href="#" onClick={e => { e.preventDefault(); addToCart(item, 1); }}>
                  <i className="bx bx-cart cart"></i>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      <section id="related-products" className="section-p1">
        <h2>Related Products</h2>
        <div className="pro-container">
          {relatedProducts().map((item, idx) => (
            <div
              className="pro"
              key={idx}
              onClick={() => {
                setCurrentProduct(item);
                setIsInCart(checkIfProductInCart(item));
                setQuantity(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img src={getImagePath(item.img)} alt={item.name} onError={(e)=>{e.target.onerror=null;e.target.src="/unknowenprofile.png"}} />
              <div className="des">
                <span>{item.brand}</span>
                <h5>{item.name}</h5>
                <div className="price-tag"><h4>{item.price}</h4></div>
              </div>
              {checkIfProductInCart(item) ? (
                <a href="#" onClick={e => { e.preventDefault(); showNotification(`${item.name} is already in your cart!`); }}>
                  <i className="bx bx-check cart-added"></i>
                </a>
              ) : (
                <a href="#" onClick={e => { e.preventDefault(); addToCart(item, 1); }}>
                  <i className="bx bx-cart cart"></i>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col about">
            <h3>Jasa Essential</h3>
            <p>Your trusted partner for quality stationery products for students and professionals. We offer a wide range of supplies at competitive prices.</p>
            <div className="social-icons"><a href="#"><i className="bx bxl-instagram"></i></a></div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/shop">Shop</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="/account">My Account</a></li>
              <li><a href="/orders">Order History</a></li>
              <li><a href="/shipping">Shipping Policy</a></li>
              <li><a href="/returns">Returns & Exchanges</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="contact-info">
              <li><i className="bx bx-map"></i> 2/3 line medu pension line, Salem 636006</li>
              <li><i className="bx bx-phone"></i> (+91) 7418676705</li>
              <li><i className="bx bx-envelope"></i> jasaessential@gmail.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Jasa Essential. All Rights Reserved.</p>
          <p>Developed by <strong>RapCode Tech Solutions</strong></p>
        </div>
      </footer>
    </div>
  );
}

export default ProductView;