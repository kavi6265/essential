// Cart.js
import React, { useState, useEffect } from "react";
import { database, auth } from "./firebase";
import { ref, remove, update, get, onValue } from "firebase/database";
import { useNavigate, useLocation, Link } from "react-router-dom"; // *** ADDED: useLocation, Link ***
import "../css/Cart.css";

// ==========================================================
//                     1. NAVBAR COMPONENT 
// ==========================================================
function Navbar({ user, auth }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- REMOVED SEARCH LOGIC ---
  // const [searchQuery, setSearchQuery] = useState("");
  // useEffect(() => { ... });
  // const handleSearch = () => { ... };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  /* ================= ICONS ================= */

  // Removed Search Icon
  
  // Home Icon (Used in Header and Mobile Nav)
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
          
          {/* REMOVED: CENTER Search Bar DIV */}

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
              <Link to="/login" className="fk-header-btn login-btn primary-btn">
                <HeaderUserIcon />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* MOBILE HEADER (Cleaned up) */}
        <div className="fk-mobile-header">
          <div className="fk-logo" onClick={() => navigate("/")}>
            <img src="/jasalogo512px.png" alt="Logo" />
          </div>
          {/* REMOVED: Mobile Search Bar DIV */}
        </div>
      </header>

      {/* ================= MOBILE BOTTOM NAV (Classes applied for consistency) ================= */}
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
          // Use Link for Profile if you want standard navigation behavior
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
          /* Uses space-between to push logo left and buttons right */
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

        /* Hide the search bar container */
        .fk-search-new-style {
          display: none;
        }

        /* Right-side Buttons */
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
        /* Using the bright blue color from your requested active state */
        .primary-btn {
            background-color: #007bff; /* Standard Bright Blue */
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
        /* Applies the solid blue style to secondary buttons when active */
        .secondary-btn.active {
            background-color: #007bff; /* Solid Blue */
            border-color: #007bff; 
            color: #ffffff; /* White text */
        }
        
        .secondary-btn.active svg {
            stroke: #ffffff; /* White icon */
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
          
          .fk-mobile-header {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 10px;
            padding: 10px;
          }
          
          .fk-mobile-header .fk-logo {
            flex-shrink: 0; 
          }

          .fk-mobile-header .fk-search-new-style {
            display: none;
          }
          
          /* Mobile Bottom Nav Styles (Kept for mobile nav) */
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
// ==========================================================
//                     2. CART COMPONENT 
// ==========================================================

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  // ... (rest of the state and hooks)
  const [totalAmount, setTotalAmount] = useState(0);
  const [imageMap, setImageMap] = useState({});
  const [productsMap, setProductsMap] = useState({});
  const navigate = useNavigate();

  // ... (all useEffect hooks remain here)

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setCartItems([]);
        setLoading(false);
        navigate("/login");
      } else {
        setLoading(true);
        // when user logs in we rely on listeners below to populate maps and cart
      }
    });
    return () => unsub();
  }, [navigate]);

  // Real-time listener for products node (keeps productsMap up-to-date)
  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsubProducts = onValue(productsRef, (snapshot) => {
      const map = {};
      snapshot.forEach((child) => {
        const p = child.val() || {};
        // Normalize fields that might contain image info
        map[child.key] = {
          id: child.key,
          img: p.imageUrl || p.image || p.img || p.imagePath || null,
          filename: p.filename || null,
          name: p.name || p.title || null,
          price: p.price ?? null,
          raw: p // store raw object if needed
        };
      });
      setProductsMap(map);
    }, (err) => {
      console.error("products onValue error:", err);
    });

    return () => {
      unsubProducts();
    };
  }, []);

  // Real-time listener for imageNames node (your mapping)
  useEffect(() => {
    const imagesRef = ref(database, "imageNames");
    const unsubImages = onValue(imagesRef, (snapshot) => {
      if (snapshot.exists()) {
        setImageMap(snapshot.val());
      } else {
        setImageMap({});
      }
    }, (err) => {
      console.error("imageNames onValue error:", err);
    });

    return () => unsubImages();
  }, []);

  // Real-time listener for the user's cart (updates when items added/removed)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const userCartRef = ref(database, `userscart/${user.uid}`);
    const unsubCart = onValue(userCartRef, (snapshot) => {
      const items = [];
      snapshot.forEach((child) => {
        items.push({
          id: child.key,
          ...child.val()
        });
      });
      setCartItems(items);
      calculateTotal(items);
      setLoading(false);
    }, (err) => {
      console.error("userscart onValue error:", err);
      setLoading(false);
    });

    return () => unsubCart();
  }, [user]);

  // Helpers
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const qty = Number(item.qty) || 1;
      const amt = parseFloat(item.productamt) || 0;
      return sum + amt * qty;
    }, 0);
    setTotalAmount(total);
  };

  const handleRemoveItem = (itemId) => {
    if (!user) return;
    const itemRef = ref(database, `userscart/${user.uid}/${itemId}`);
    remove(itemRef).catch((err) => console.error("remove error:", err));
  };

  const handleQuantityChange = (itemId, newQty) => {
    if (!user || newQty < 1) return;
    const itemRef = ref(database, `userscart/${user.uid}/${itemId}`);
    update(itemRef, { qty: newQty }).catch((err) => console.error("update qty error:", err));
  };

  // Resolve image using (1) product record, (2) direct URL, (3) imageNames mapping, (4) fallback
  // This function is now only used for old (stationery) products
  const getImageResource = (imageId, productId) => {
    // 1) If productId exists, try productsMap first
    if (productId && productsMap[productId]) {
      const p = productsMap[productId];
      const pimg = p.img ?? p.filename ?? null;

      if (pimg) {
        if (typeof pimg === "string") {
          if (pimg.startsWith("http")) return pimg; // full Firebase URL
          // if product stores an image-id (digits) that maps via imageMap
          if (/^\d+$/.test(pimg) && imageMap[pimg]) return `/${imageMap[pimg]}`;
          // if looks like a filename (ends with extension) return from public root
          if (/\.(png|jpe?g|gif|svg)$/i.test(pimg)) return `/${pimg}`;
          // fallback: return as root path (some product entries might store filenames without extension checking)
          return `/${pimg}`;
        }
      }
    }

    // 2) If imageId is a full URL
    if (imageId && typeof imageId === "string" && imageId.startsWith("http")) {
      return imageId;
    }

    // 3) If imageId matches imageMap (imageNames node)
    if (imageId != null) {
      const idString = imageId.toString();
      const filename = imageMap[idString];
      if (filename) return `/${filename}`; // public root
      // if imageId itself looks like a filename (rare) return directly
      if (/\.(png|jpe?g|gif|svg)$/i.test(idString)) return `/${idString}`;
    }

    // 4) fallback
    return "/unknowenprofile.png";
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <>
        {/* *** RENDER NAVBAR HERE TOO *** */}
        <Navbar user={user} auth={auth} /> 
        <div className="loading-container">
          <div className="loader" />
          <h2>Loading your cart...</h2>
        </div>
      </>
    );
  }

  return (
    // *** RENDER NAVBAR HERE ***
    <>
      <Navbar user={user} auth={auth} /> 
      <div className="cart-pagecart">
        <section className="page-headercart">
          <h2 className="page-header-titlecart">#cart</h2>
          <p className="page-header-desccart">View your selected items</p>
        </section>
        {/* ... (rest of Cart component JSX) ... */}
        <section className="cart-containercart">
          {cartItems.length === 0 ? (
            <div className="empty-cartcart">
              <i className="bx bx-cart-alt empty-cart-iconcart" />
              <h2 className="empty-cart-titlecart">Your cart is empty</h2>
              <button onClick={() => navigate("/shop")} className="shop-btncart">
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-table-containercart">
                <table className="cart-tablecart">
                  <thead className="cart-table-headcart">
                    <tr className="cart-table-rowcart">
                      <th>Remove</th>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cartItems.map((item) => {
                      // ==========================================================
                      //  THIS IS THE FIX:
                      //  1. Check for 'productimageurl' (used by ElectronicKit)
                      //  2. If it's missing, fall back to the old logic (for Stationery)
                      // ==========================================================
                      const src = item.productimageurl
                        ? item.productimageurl
                        : getImageResource(item.productimage, item.productId);

                      return (
                        <tr key={item.id}>
                          <td>
                            <button onClick={() => handleRemoveItem(item.id)} className="remove-btncart">
                              <i className="bx bx-x-circle" />
                            </button>
                          </td>
                          <td>
                            <img
                              src={src}
                              alt={item.productname}
                              className="product-thumbnail-imgcart"
                              onError={(e) => {
                                console.warn("Image load failed, fallback:", e.target.src);
                                e.target.src = "/unknowenprofile.png";
                              }}
                            />
                          </td>
                          <td>{item.productname}</td>
                          <td>₹{item.productamt}</td>
                          <td>
                            <div className="quantity-controlcart">
                              <button onClick={() => handleQuantityChange(item.id, (Number(item.qty) || 1) - 1)}>-</button>
                              <span>{item.qty}</span>
                              <button onClick={() => handleQuantityChange(item.id, (Number(item.qty) || 1) + 1)}>+</button>
                            </div>
                          </td>
                          <td>₹{((parseFloat(item.productamt) || 0) * (Number(item.qty) || 1)).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="cart-summarycart">
                <div className="summary-contentcart">
                  <h3 className="summary-titlecart">Cart Totals</h3>
                  <div className="summary-linecart">
                    <span className="summary-line-labelcart">Cart Subtotal</span>
                    <span className="summary-line-valuecart">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="summary-linecart">
                    <span className="summary-line-labelcart">Shipping</span>
                    <span className="summary-line-valuecart">Free</span>
                  </div>
                  <div className="summary-linecart totalcart">
                    <span className="summary-line-labelcart">Total</span>
                    <span className="summary-line-valuecart">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} className="checkout-btncart">
                    Proceed to checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
        <footer className="modern-footer">
          <div className="footer-content">
            <div className="footer-column brand-column">
              <h3>Jasa Essential</h3>
              <p>Your trusted partner for quality stationery products for students and professionals. We offer a wide range of supplies at competitive prices.</p>
              <div className="social-icons">
                <a href="https://www.instagram.com/jasa_essential?igsh=MWVpaXJiZGhzeDZ4Ng=="><i className="bx bxl-instagram"></i></a>
              </div>
            </div>

            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Shop</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Customer Service</h4>
              <ul>
                <li><a href="#">My Account</a></li>
                <li><a href="#">Order History</a></li>
                <li><a href="#">Shipping Policy</a></li>
                <li><a href="#">Returns & Exchanges</a></li>
                <li><a href="#">Terms & Conditions</a></li>
              </ul>
            </div>

            <div className="footer-column contact-info">
              <h4>Contact Us</h4>
              <p><i className="bx bx-map"></i> 2/3 line medu pension line 2 nd street  line medu , salem 636006</p>
              <p><i className="bx bx-phone"></i> (+91) 7418676705</p>

              <p><i className="bx bx-envelope"></i> jasaessential@gmail.com</p>
            </div>
          </div>

          <div className="footer-bottom" style={{ display: "block" }}>
            <p>&copy; 2025 Jasa Essential. All Rights Reserved.</p>
            <div className="footer-content">
              <p className="copyright1" style={{ flexDirection: "row" }}>Developed by <a href="https://rapcodetechsolutions.netlify.app/" className="develop-aa"><img src="/Rapcode.png" style={{ width: "20px", height: "20px", display: "flex", margin: "auto", flexDirection: "row", marginLeft: "10px" }} alt="RapCode Logo"></img>RapCode Tech Solutions</a></p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Cart;