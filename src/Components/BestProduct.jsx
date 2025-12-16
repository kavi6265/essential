import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { auth, database } from "./firebase";
import { ref, get, set, push } from "firebase/database";

/*
  BestProduct.jsx (Modified with 3-Banner Slider)
*/
function Navbar({ user, auth }) {
  const location = useLocation();
  const navigate = useNavigate();
  // RESTORED: State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // RESTORED: useEffect to read search query from URL on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("search") || "");
  }, [location.search]);

  // RESTORED: function to handle search and navigation
  const handleSearch = () => {
    // Note: Assuming you want to search products, adjust the path if necessary
    if (!searchQuery.trim()) return;
    navigate(`/best-product?search=${encodeURIComponent(searchQuery)}`);
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  /* ================= ICONS ================= */

  // RESTORED: Search Icon
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
  
  // Home Icon
  const HeaderHomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );

  // Cart Icon
  const HeaderCartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
  
  // User Icon
  const HeaderUserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  );

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fk-header">
        {/* DESKTOP HEADER */}
        <div className="fk-desktop-row">
          
          <div className="fk-left-section">
             {/* Logo */}
            <div className="fk-logo" onClick={() => navigate("/")}>
              <img src="/jasalogo512px.png" alt="Logo" />
            </div>
          </div>
          
          {/* RESTORED: CENTER Search Bar */}
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

          {/* RIGHT: Home/Cart/Profile/Login Buttons (styled as buttons) */}
          <div className="fk-right-buttons">
            
            {/* Home button: Applied isActive() */}
            <Link to="/" className={`fk-header-btn home-btn secondary-btn ${isActive("/")}`}>
                <HeaderHomeIcon />
                <span>Home</span>
            </Link>
            
            {/* Cart button: Applied isActive() */}
            <Link to="/cart" className={`fk-header-btn cart-btn secondary-btn ${isActive("/cart")}`}>
                <HeaderCartIcon />
                <span>Cart</span>
            </Link>

            {user ? (
              // Profile button: Applied isActive()
              <Link to="/profile" className={`fk-header-btn profile-btn secondary-btn ${isActive("/profile")}`}>
                <HeaderUserIcon />
                <span>Profile</span>
              </Link>
            ) : (
              // Login uses primary-btn (solid blue)
              <Link to="/login" className={`fk-header-btn login-btn primary-btn ${isActive("/login")}`}>
                <HeaderUserIcon />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* MOBILE HEADER */}
        <div className="fk-mobile-header">
          <div className="fk-logo" onClick={() => navigate("/")}>
            <img src="/jasalogo512px.png" alt="Logo" />
          </div>

          {/* RESTORED: Mobile Search Bar */}
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

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="fk-bottom-nav">
        <Link to="/" className={isActive("/")}>
          <HeaderHomeIcon />
          <span>Home</span>
        </Link>

        <Link to="/cart" className={isActive("/cart")}>
          <HeaderCartIcon />
          <span>Cart</span>
        </Link>

        {user ? (
          <Link to="/profile" className={isActive("/profile")}>
            <HeaderUserIcon />
            <span>Profile</span>
          </Link>
        ) : (
          <Link to="/login" className={isActive("/login")}>
            <HeaderUserIcon />
            <span>Login</span>
          </Link>
        )}
      </nav>

      {/* ================= CSS (Desktop & Mobile) ================= */}
      <style>{`
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
// =========================================================================
// BestProduct Component with Slider Logic
// =========================================================================

const BestProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [stationaryProducts, setStationaryProducts] = useState([]);
  const [electronicProducts, setElectronicProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [bannerProducts, setBannerProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // banner state - NOW CONTROLS THE SLIDER
  const [currentBanner, setCurrentBanner] = useState(0);
  // textVisible is no longer strictly needed for smooth transition with CSS transform
  // const [textVisible, setTextVisible] = useState(true); 

  // --- Banner Data Array ---
  const banners = [
    {
        className: "fk-banner-1",
        image: "/pencilcombo.png", // Use your placeholder or actual image URL
        height: "250px", 
        overlay: "rgba(0, 0, 0, 0.4)",
        title: `"All Your Stationery Needs"`,
        buttonText: "Shop Now →",
        buttonBg: "#ffffff",
        link: '/shop',
        buttonColor: '#333',
        buttonBorder: "1px solid #ccc",
        fontSize: "28px",
    },
    {
        className: "fk-banner-2",
        image: "/pencilcombo.png", // Use your placeholder or actual image URL
        height: "250px", 
        overlay: "rgba(30, 70, 100, 0.5)",
        title: `Get 10% Off All Book Orders!`,
        buttonText: "Explore Books",
        buttonBg: "#4CAF50",
        link: '/books',
        buttonColor: '#fff',
        buttonBorder: "none",
        fontSize: "24px",
    },
    {
        className: "fk-banner-3",
        image: "/pencilcombo.png", // Use your placeholder or actual image URL
        height: "250px", 
        overlay: "rgba(180, 0, 0, 0.6)",
        title: `Need a Printout? Quick Xerox Service Available!`,
        buttonText: "Start Printing",
        buttonBg: "#ffc107",
        link: '/xerox',
        buttonColor: '#333',
        buttonBorder: "none",
        fontSize: "24px",
    }
  ];
  // --- End Banner Data Array ---

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search")?.trim() || "";
    setSearchQuery(query);
    setIsSearching(query !== "");
  }, [location.search]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchAllProducts = async () => {
      try {
        const stationarySnap = await get(ref(database, "products"));
        const electronicSnap = await get(ref(database, "ELECTRONIC"));

        const stationary = stationarySnap.exists() ? Object.values(stationarySnap.val()) : [];
        const electronic = electronicSnap.exists() ? Object.values(electronicSnap.val()) : [];

        if (!mounted) return;

        setStationaryProducts(stationary);
        setElectronicProducts(electronic);
        
        const combinedProducts = [...stationary, ...electronic];

        setBannerProducts(stationary.slice(0, 4)); // Using this just to keep product fetching logic

        if (searchQuery) {
          const all = combinedProducts;
          const filtered = all.filter(
            (p) =>
              p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAllProducts();
    return () => {
      mounted = false;
    };
  }, [searchQuery]);

  // SLIDER AUTO-ROTATE LOGIC
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (banners.length ? (prev + 1) % banners.length : 0));
    }, 5000); // Rotates every 5 seconds
    return () => clearInterval(interval);
  }, [banners.length]);

  // FUNCTION TO JUMP TO A SPECIFIC SLIDE (for dots)
  const goToSlide = (index) => {
    setCurrentBanner(index);
  };
  
  // The rest of the component's logic is unchanged

  // This function is still used for the main cart link in the Navbar, 
  // but the small card button now bypasses it for "Buy Now"
  const handleAddToCart = async (product) => {
    try {
      if (!user) {
        alert("Please login to add items to your cart.");
        navigate("/login");
        return;
      }
      const cartRef = ref(database, `carts/${user.uid}`);
      const newItemRef = push(cartRef);
      await set(newItemRef, {
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  const renderProductCard = (product, index) => {
    const priceValue =
      typeof product.price === "string"
        ? product.price.replace(/[₹,]/g, "")
        : product.price;

    const numericPrice = parseFloat(priceValue) || 0;
    const discountPercent = parseFloat(product.discount) || 0;
    const discountedPrice = discountPercent
      ? (numericPrice - (numericPrice * discountPercent) / 100).toFixed(2)
      : numericPrice.toFixed(2);

    return (
      <article
        key={index}
        className="fk-card"
        onClick={() => navigate("/product", { state: { product } })}
        aria-label={product.name}
      >
        {/* ⭐ DISCOUNT BADGE IN TOP LEFT CORNER ⭐ */}
        {discountPercent > 0 && (
          <span className="fk-discount-badge">
            {discountPercent}% OFF
          </span>
        )}
        
        {/* --- Card Header: Contains the new "Buy Now" button on the right --- */}
        <div className="fk-card-header">
            {/* THIS BUTTON IS NOW "BUY NOW" AND GOES TO CHECKOUT */}
            <button
              type="button"
              className="fk-icon-cart-btn"
              onClick={(e) => {
                e.stopPropagation();
                // Direct navigation to checkout with the product data
                navigate("/checkout", { state: { product } });
              }}
              aria-label="Buy now"
            >
              <img 
                src="/jasalogo512px.png" // Use your logo path here
                alt="Jasa Buy Now"
                className="fk-buy-now-logo" // New class for sizing the image
              />
            </button>
        </div>
        {/* ----------------------------------------------------------- */}

        <div className="fk-imgbox">
          <img
            src={product.imageUrl || "/placeholder.png"}
            alt={product.name || "Product"}
            className="fk-img"
          />
        </div>

        {/* Product Details Area */}
        <div className="fk-details-wrapper">
            <div className="fk-title" title={product.name}>
              {product.name}
            </div>

            {/* Price and Rating (Rating is a placeholder) */}
            <div className="fk-price-rating-row">
              <span className="fk-rating">⭐⭐⭐</span>
              <span className="fk-price">₹{discountedPrice}</span>
              {/* Show original price with a strikethrough if discounted */}
              {discountPercent > 0 && (
                <span style={{ fontSize: '10px', color: '#777', textDecoration: 'line-through', marginLeft: '6px' }}>
                    ₹{numericPrice}
                </span>
              )}
            </div>

            {/* Button at the bottom (This button also goes to checkout/shop now) */}
            <button
              type="button"
              className="fk-shop-now-btn"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/product", { state: { product } });
              }}
            >
              Add to cart
            </button>
        </div>
      </article>
    );
  };

  const css = `
    /* Embedded Flipkart-like styles */
    :root{--primary:#007bff;--accent:#ff9f00;--bg:#f6f7f9}
    .fk-root{font-family: 'Poppins', Arial, sans-serif;background:var(--bg);color:#111}
    
    /* Section wrapper */
    .banner-container { margin-top: 12px; }
    
    .section-header {
      position: relative;
      width: 95%;
      max-width: 1300px;
      margin: 12px auto 4px;
      padding: 8px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-header h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      margin-right:90px
      
    }

    /* ⭐ CAROUSEL STYLES ⭐ */
    .fk-grid-outer {
      width: 95%;
      max-width: 1300px;
      margin: 0 auto;
      overflow-x: scroll; /* Enable horizontal scrolling */
      -webkit-overflow-scrolling: touch;
      padding-bottom: 20px;
      scroll-snap-type: x mandatory;
      scrollbar-width: none; /* Hide scrollbar for Firefox */
    }

    .fk-grid-outer::-webkit-scrollbar {
        display: none;
    }

    .fk-grid {
      display: flex; /* Use flexbox for horizontal layout */
      gap: 14px;
      padding-right: 40px; 
      width: fit-content; 
    }

    /* ===== PRODUCT CARD (Matching Scientific Calculator UI) ===== */
    .fk-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      padding: 8px; /* Reduced padding for compact look */
      height: 280px; 
      box-shadow: 0 4px 10px rgba(0,0,0,0.05); 
      cursor: pointer;
      
      flex: 0 0 200px; /* Smaller fixed width for more cards */
      min-width: 200px;
      scroll-snap-align: start;
      
      display: flex;
      flex-direction: column;
      position: relative; 
      transition: transform 0.2s;
    }

    .fk-card:hover {
      border-color: #cfd8dc;
      transform: translateY(-2px); 
    }

    /* Discount Badge Style */
    .fk-discount-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        background: #dd163aff; 
        color: #fff;
        padding: 4px 8px;
        font-size: 11px;
        font-weight: 700;
        border-radius: 4px;
        z-index: 10;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .fk-card-header {
        height: 30px; /* Increased height to accommodate the logo */
        display: flex;
        justify-content: flex-end; 
        width: 100%;
    }

    /* Styles for the button container (now just a container for the image) */
    .fk-icon-cart-btn {
        background: none; /* Removed background */
        border: none;
        padding: 0; /* Removed padding */
        cursor: pointer;
        z-index: 10;
        transition: transform 0.2s;
    }
    .fk-icon-cart-btn:hover {
        background: none;
        transform: scale(1.1); /* Added scale effect back for visual feedback */
    }

    /* New style to size the logo inside the button */
    .fk-buy-now-logo {
        height: 30px; /* Set the size of the logo */
        width: auto;
        display: block;
    }
    
    .fk-imgbox {
        width: 100%;
        height: 100px; 
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;
        overflow: hidden;
    }
    
    .fk-imgbox img {
        max-width: 80%;
        max-height: 100%;
        object-fit: contain;
    }

    .fk-details-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between; 
        padding: 0 4px;
    }

    .fk-title {
        font-size: 13px; 
        font-weight: 500;
        color: #212121;
        line-height: 1.3;
        height: 34px; 
        overflow: hidden;
    }

    .fk-price-rating-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 4px 0 8px;
    }

    .fk-rating {
        font-size: 10px; 
    }

    .fk-price {
        font-size: 14px;
        font-weight: 600;
        color: #000;
    }

    /* Shop Now Button Style (Main bottom button) */
    .fk-shop-now-btn {
        background: #2874f0; 
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 0;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        width: 100%; 
        margin-top: auto; 
    }
    .fk-shop-now-btn:hover {
        background: #1e63d0;
    }

    /* General View All Button */
    .view-all-btn {
      position: absolute;
      right: 0;
      top: 50%; 
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: #2874f0;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
      margin-bottom: 20px
    }
    .view-all-btn .arrow { transition: transform .2s ease; }
    .view-all-btn:hover .arrow { transform: translateX(4px); }

    /* Category Bar Styling */
   /* Add this CSS rule */
/* --- CSS for the 4-Column Layout and Appearance --- */

/* 1. Main Category Bar Container */
/* Container for the categories, matching the layout in the screenshot */
/* 1. Mobile Styles (Default - Less gap is needed) */
.categories-bar {
    display: flex;
    justify-content: space-around; /* Adds space around items on small screens */
    align-items: flex-start;
    padding: 10px 0;
    margin-bottom: 20px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.categories-bar::-webkit-scrollbar {
    display: none;
}

.category-item {
    text-align: center;
    cursor: pointer;
    padding: 0 10px; /* Slightly increased padding for better spacing */
    flex: 0 0 25%; 
    min-width: 80px;
    box-sizing: border-box;
    max-width: 100px;
}

/* ... (rest of the category-img-wrapper and text CSS here) ... */

.category-img-wrapper {
    width: 60px;
    height: 60px;
    margin: 0 auto 5px;
    border-radius: 5px; /* Square shape with rounded corners */
    background-color: #f7f7f7; 
    border: 1px solid #e0e0e0;
    display: flex;
    align-items: center; 
    justify-content: center; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-img-wrapper img {
    width: 80%; 
    height: 80%;
    object-fit: contain;
    display: block;
}

.category-item p {
    margin: 5px 0 0;
    font-weight: 600; 
    font-size: 10px; 
    line-height: 1.2;
    text-transform: uppercase;
    color: #333;
}

/* --- 2. Desktop/Tablet Styles (Media Query to reduce gap) --- */
@media (min-width: 768px) {
    /* Set a maximum width for the whole bar to control spacing */
    .categories-bar {
        max-width: 500px; /* Adjust this value (e.g., 500px-700px) */
        margin-left: auto;
        margin-right: auto; /* Centers the whole container */
        justify-content: space-between; /* Use this to put minimal space between the 4 items */
    }

    .category-item {
        /* On desktop, remove the flexible width constraint and let space-between handle it */
        flex: 0 0 auto; 
        width: 100px; /* Set a fixed, slightly larger width for desktop icons */
        max-width: 100px; 
    }

    .category-img-wrapper {
        width: 70px; /* Slightly larger icon size for desktop */
        height: 70px;
    }

    .category-item p {
        font-size: 11px; /* Slightly larger text */
    }
}
    /* ⭐ SLIDER CONTAINER STYLES ADDED ⭐ */
    .slider-wrapper {
        width: 95%;
        max-width: 1250px;
        margin: 20px auto;
        position: relative;
        overflow: hidden; 
        border-radius: 10px; 
        box-shadow: 0 5px 25px rgba(0,0,0,0.12);
    }
    .slides-inner {
        display: flex;
        width: ${banners.length * 100}%; // Total width of all slides
        transition: transform 0.5s ease-in-out; 
    }
    .slider-dots {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        z-index: 10;
    }
    
    @media (max-width: 600px) {
        .fk-card {
            flex: 0 0 160px;
            min-width: 160px;
            height: 240px; 
        }
        .fk-imgbox {
            height: 80px;
        }
        .fk-title {
            font-size: 12px;
            height: 30px;
        }
    }
  `;

  return (
    <div className="fk-root">
      <style>{css}</style>
      <Navbar user={user} profileImageUrl={user?.photoURL} />


      <div className="banner-container">

        {/* ===================== CATEGORIES BAR (Unchanged) ===================== */}
        
        
        {/* ===================== SLIDER WRAPPER (Modified Section) ===================== */}
        <div 
            className="slider-wrapper"
            // The margin and max-width styles are now managed by the .slider-wrapper CSS class
        >
          {/* SLIDES CONTAINER: This moves left/right to show the current slide */}
          <div 
              className="slides-inner"
              style={{
                  transform: `translateX(-${currentBanner * (100 / banners.length)}%)` // Move container
              }}
          >
              
              {/* Map through all banners to create slide items */}
              {banners.map((banner, index) => (
                  <div
                      key={index}
                      className={`fk-main-banner ${banner.className}`}
                      style={{
                          width: `${100 / banners.length}%`, // Each slide takes up equal width
                          flexShrink: 0, // Prevent slides from shrinking
                          position: "relative",
                          height: banner.height,
                          display: "flex",
                          alignItems: "center", 
                          justifyContent: "center", 
                          // Background with image and overlay
                          background: `linear-gradient(${banner.overlay}, ${banner.overlay}), url(${banner.image}) center/cover no-repeat`,
                      }}
                  >
                      <div 
                          className={`fk-banner-content-${index + 1}`}
                          style={{ 
                              width: "100%", 
                              display: "flex", 
                              flexDirection: "column", 
                              alignItems: "center", 
                              justifyContent: "center", 
                              padding: "0 20px", 
                              textAlign: "center",
                              zIndex: 2,
                          }}
                      >
                          <h2 
                              style={{ 
                                  fontSize: banner.fontSize, 
                                  margin: "0 0 15px 0", 
                                  fontWeight: "600", 
                                  color: "#fff", 
                                  lineHeight: "1.2"
                              }}
                          >
                              {banner.title}
                          </h2>
                          
                          <button 
                              onClick={() => navigate(banner.link)} 
                              style={{ 
                                  background: banner.buttonBg, 
                                  color: banner.buttonColor,
                                  padding: "10px 20px", 
                                  borderRadius: "20px", 
                                  border: banner.buttonBorder, 
                                  fontSize: "16px", 
                                  fontWeight: "600", 
                                  cursor: "pointer", 
                                  width: "fit-content",
                                  display: "flex",
                                  alignItems: "center",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                              }}
                          >
                              {banner.buttonText}
                          </button>
                      </div>
                  </div>
              ))}
          </div>
          
          {/* SLIDER DOTS (Navigation Indicators) */}
          <div className="slider-dots">
              {banners.map((_, index) => (
                  <span
                      key={index}
                      onClick={() => goToSlide(index)}
                      style={{
                          display: 'block',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: currentBanner === index ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                          cursor: 'pointer',
                          transition: 'background 0.3s'
                      }}
                  ></span>
              ))}
          </div>
        </div>
      

<section className="categories-bar">
    {[
        // 1. STATIONARY PRODUCTS
        { 
            name: 'STATIONARY', 
            file: 'e service 4.jpg', 
            path: '/shop' 
        },
        // 2. BOOK
        { 
            name: 'BOOK', 
            file: '/e service 1.jpg', 
            path: '/books-page' 
        }, 
        // 3. XEROX
        { 
            name: 'XEROX', 
            file: '/esevice 3.jpg', 
            path: '/xerox-page' 
        },
        // 4. ELECTRONIC KIT
        // (Assuming the image in the screenshot is /category-4.png or similar, 
        // if not, replace /category-4.png with the correct filename)
        { 
            name: 'ELECTRONIC KIT', 
            file: '/category-4.png', 
            path: '/electronic-kit-page' 
        }, 
    ].map((cat, index) => (
        <div 
            key={index} 
            className="category-item" // Add a class for styling
            onClick={() => navigate(cat.path)} 
            // Inline style to ensure 4-column layout on the fly (best practice is external CSS)
            style={{ 
                textAlign: 'center', 
                cursor: 'pointer', 
                padding: '0 5px',
                flex: '0 0 25%', // Important for 4-column layout
                minWidth: '80px', 
            }}
        >
            <div className="category-img-wrapper">
                <img 
                    src={cat.file} 
                    alt={cat.name} 
                />
            </div>
            <p style={{ 
                margin: '5px 0 0', 
                fontWeight: '600', // Slightly bolder text
                fontSize: '10px',  // Smaller font size for mobile
                whiteSpace: 'nowrap' 
            }}>
                {cat.name}
            </p>
        </div>
    ))}
</section>

      </div>

      {/* ===================== PRODUCT SECTIONS (CAROUSELS) ===================== */}
      {isSearching ? (
        <section className="best-section" style={{width:'95%',margin:'12px auto'}}>
          <div className="section-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2>Search Results for “{searchQuery}”</h2>
          </div>

          <div className="fk-grid" style={{
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '14px',
              width: '95%',
              margin: '0 auto 20px',
              maxWidth: '1300px',
          }}>
            {loading ? <p>Loading...</p> : filteredProducts.length > 0 ? filteredProducts.map(renderProductCard) : <p>No products found.</p>}
          </div>
        </section>
      ) : (
        <>
          {/* Stationery Section */}
          <section className="best-section">
            <div className="section-header">
              <h2>Stationery Product</h2>
              <button className="view-all-btn" onClick={() => navigate('/shop')}>View All <span className="arrow">→</span></button>
            </div>

            <div className="fk-grid-outer">
                <div className="fk-grid">
                  {loading ? <p>Loading...</p> : stationaryProducts.length > 0 ? stationaryProducts.map(renderProductCard) : <p style={{minWidth: '200px'}}>No products found.</p>}
                </div>
            </div>
          </section>
          
          <hr style={{width: '90%', maxWidth: '1300px', margin: '30px auto', border: 'none', borderTop: '1px solid #eee'}}/>


          {/* Electronic Kits Section */}
          <section className="best-section">
            <div className="section-header">
              <h2> Electronic Product</h2>
              <button className="view-all-btn" onClick={() => navigate('/ElectronicKit')}>View All <span className="arrow">→</span></button>
            </div>

            <div className="fk-grid-outer">
              <div className="fk-grid">
                {loading ? <p>Loading...</p> : electronicProducts.length > 0 ? electronicProducts.map(renderProductCard) : <p style={{minWidth: '200px'}}>No products found.</p>}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default BestProduct;
