import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Ensure 'firebase.js' is in the correct path (e.g., './firebase' or '../firebase')
// This file must export 'database' and 'auth'
import { database, auth } from "./firebase";
import { ref, push, set, get } from "firebase/database";
// Assuming the shop.css file is in '../css/shop.css' relative to this component
import "../css/shop.css";

const ElectronicKit = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [electronicProducts, setElectronicProducts] = useState([]);

  // --- Style Overrides ---
  // We'll add a style tag for small adjustments needed for the electronics card
  const styleOverrides = `
    .product-price-container {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    
    .product-original-price {
      font-size: 0.8rem;
      color: #777;
      text-decoration: line-through;
    }

    .product-discount-badge {
      font-size: 0.75rem;
      font-weight: 600;
      background-color: #fee2e2;
      color: #b91c1c;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      margin-left: auto;
    }
  `;

  // --- 1. Authentication and Cart Fetching ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCart(currentUser.uid);
      } else {
        setCartItems([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchCart = async (uid) => {
    // No need to set loading here, products loading is the main indicator
    try {
      const userCartRef = ref(database, `userscart/${uid}`);
      const snapshot = await get(userCartRef);
      const items = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) =>
          items.push({ id: child.key, ...child.val() })
        );
      }
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      showToastNotification("Could not fetch cart.", "error");
    }
  };

  // --- 2. Fetch Electronic Products ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = ref(database, "ELECTRONIC");
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const fetchedProducts = [];
          const brands = new Set(); // To dynamically create categories

          snapshot.forEach((child) => {
            const product = child.val();
            // Add the database key as 'id'
            fetchedProducts.push({
              id: child.key,
              ...product,
            });
            // Add brand to our set for categories
            if (product.brand) {
              brands.add(product.brand);
            }
          });

          setElectronicProducts(fetchedProducts);
          // Create categories from product brands
          setCategories(["All", ...Array.from(brands)]);
        } else {
          console.log("No electronic products found.");
          setElectronicProducts([]);
        }
      } catch (err) {
        console.error("Error fetching electronic products:", err);
        showToastNotification("Failed to load products.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- 3. Helper Functions ---
  const showToastNotification = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isProductInCart = (product) =>
    cartItems.some((item) => item.productname === product.name);

  // --- 4. Add to Cart Logic ---
  const addToCart = async (e, product) => {
    e.stopPropagation();
    if (!user) {
      showToastNotification("Please login to add items to cart", "warning");
      navigate("/login"); // Assuming you have a /login route
      return;
    }
    if (isProductInCart(product)) {
      showToastNotification("This product is already in your cart!", "info");
      return;
    }

    // Calculate final price based on discount
    const finalPrice = product.price * (1 - (product.discount || 0) / 100);

    const productData = {
      productname: product.name,
      // Store the full image URL
      productimageurl: product.imageUrl,
      // Store the final calculated price
      productamt: finalPrice.toFixed(2),
      originalamt: product.price.toFixed(2),
      discount: product.discount || 0,
      qty: 1,
      discription: `Brand: ${product.brand || 'N/A'}, Product: ${product.name}`,
      rating: product.rating || 0, // Use 0 if no rating exists
    };

    setLoading(true); // Show loader while adding
    try {
      const userCartRef = ref(database, `userscart/${user.uid}`);
      const newProductRef = push(userCartRef);
      await set(newProductRef, productData);
      setCartItems([...cartItems, { id: newProductRef.key, ...productData }]);
      showToastNotification("Product added to cart successfully!", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToastNotification("Failed to add product to cart.", "error");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // --- 5. Render Logic ---

  // Filter products based on search and category
  const filteredProducts = electronicProducts.filter((product) => {
    const matchesSearch =
      (product.name &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.brand &&
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      activeCategory === "All" || product.brand === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product) => {
    // You can create an /electronic-product-detail page later
    // navigate("/electronic-product-detail", { state: { product } });
    console.log("Navigating to product detail for:", product);
  };
  const handleCategoryClick = (category) => setActiveCategory(category);
  const clearSearch = () => setSearchQuery("");
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="shop-container">
      <style>{styleOverrides}</style>
      {showToast && (
        <div className={`toast-notification ${toastType}`}>{toastMessage}</div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>Find Your Perfect Gadget</h2>
          <p>Discover the latest in tech and electronics</p>
          <div
            className={`search-containershop ${searchFocused ? "focused" : ""}`}
          >
            <input
              type="text"
              placeholder="Search for electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={clearSearch}>
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section (Dynamic) */}
      <section className="categories-section">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Products Grid */}
      <section className="products-section">
        {loading ? (
          <div className="loading-text">Loading Products...</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const inCart = isProductInCart(product);
                const finalPrice =
                  product.price * (1 - (product.discount || 0) / 100);
                return (
                  <div
                    className="product-card"
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="product-image-container">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/400x300/e9ecef/6c757d?text=No+Image";
                        }}
                      />
                      {product.discount > 0 && (
                          <span className="product-discount-badge">
                            {product.discount}% OFF
                          </span>
                        )}
                      <div className="product-actions">
                        <button
                          className={`cart-btn ${inCart ? "in-cart" : ""}`}
                          onClick={(e) => addToCart(e, product)}
                          disabled={inCart}
                        >
                          <i
                            className={`bx ${inCart ? "bx-check" : "bx-cart"}`}
                          ></i>
                        </button>
                        {/* We remove the 'view' button as card click is the view action
                        <button
                          className="view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                        >
                          <i className="bx bx-show"></i>
                        </button>
                        */}
                      </div>
                    </div>

                    <div className="product-info">
                      <span className="product-brand">
                        {product.brand || "Generic"}
                      </span>
                      <h5 className="product-name">{product.name}</h5>
                      <div className="product-footer">
                        <div className="product-price-container">
                          <span className="product-price">
                            ${finalPrice.toFixed(2)}
                          </span>
                          {product.discount > 0 && (
                            <span className="product-original-price">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-text">
                No products found matching your criteria.
              </div>
            )}
          </div>
        )}
      </section>

      <button className="scroll-to-top" onClick={scrollToTop}>
        ↑
      </button>

      {/* Footer (Copied from Shop.js) */}
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-column brand-column">
            <h3>Jasa Essential</h3>
            <p>
              Your trusted partner for quality stationery products for students
              and professionals. We offer a wide range of supplies at
              competitive prices.
            </p>
            <div className="social-icons">
              <a href="https://www.instagram.com/jasa_essential?igsh=MWVpaXJiZGhzeDZ4Ng==">
                <i className="bx bxl-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Shop</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Customer Service</h4>
            <ul>
              <li>
                <a href="#">My Account</a>
              </li>
              <li>
                <a href="#">Order History</a>
              </li>
              <li>
                <a href="#">Shipping Policy</a>
              </li>
              <li>
                <a href="#">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          <div className="footer-column contact-info">
            <h4>Contact Us</h4>
            <p>
              <i className="bx bx-map"></i>2/3 line medu pension line 2 nd
              street line medu , salem 636006
            </p>
            <p>
              <i className="bx bx-phone"></i> (+91) 7418676705
            </p>
            <p>
              <i className="bx bx-envelope"></i> jasaessential@gmail.com
            </p>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: "block" }}>
          <p>&copy; 2025 Jasa Essential. All Rights Reserved.</p>
          <div className="footer-content">
            <p
              className="copyright1"
              style={{ flexDirection: "row" }}
            >
              Developed by{" "}
              <a
                href="https://rapcodetechsolutions.netlify.app/"
                className="develop-aa"
              >
                <img
                  src="/Rapcode.png"
                  style={{
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    margin: "auto",
                    flexDirection: "row",
                    marginLeft: "10px",
                  }}
                  alt="RapCode Logo"
                />
                RapCode Tech Solutions
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ElectronicKit;

