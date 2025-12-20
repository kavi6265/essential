import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database, auth } from "./firebase";
import { ref, push, set, get } from "firebase/database";
import { Navbar } from "./BestProduct"; 

const ElectronicKit = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [electronicProducts, setElectronicProducts] = useState([]);

  // --- Auth & Cart Sync ---
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
      const snapshot = await get(ref(database, `userscart/${uid}`));
      const items = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => items.push({ id: child.key, ...child.val() }));
      }
      setCartItems(items);
    } catch (error) { console.error(error); }
  };

  // --- Fetch Electronic Data & Generate Categories ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsRef = ref(database, "ELECTRONIC");
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const fetchedProducts = [];
          const brands = new Set();
          snapshot.forEach((child) => {
            const product = child.val();
            fetchedProducts.push({ id: child.key, ...product });
            if (product.brand) brands.add(product.brand);
          });
          setElectronicProducts(fetchedProducts);
          setCategories(["All", ...Array.from(brands)]);
        }
      } catch (err) {
        showToastNotification("Failed to load products.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const showToastNotification = (message, type) => {
    setToastMessage(message); setToastType(type); setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const isProductInCart = (pName) => cartItems.some((item) => item.productname === pName);

  const addToCart = async (e, product) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    if (isProductInCart(product.name)) {
      showToastNotification("Already in cart!", "info"); return;
    }

    const priceNum = parseFloat(product.price) || 0;
    const finalPrice = priceNum * (1 - (product.discount || 0) / 100);

    const productData = {
      productname: product.name,
      productimageurl: product.imageUrl,
      productamt: finalPrice.toFixed(0),
      qty: 1,
    };

    try {
      await set(push(ref(database, `userscart/${user.uid}`)), productData);
      setCartItems([...cartItems, productData]);
      showToastNotification("Added to cart!", "success");
    } catch (error) { showToastNotification("Error adding to cart", "error"); }
  };

  // --- Filtering Logic ---
  const filteredProducts = electronicProducts.filter((p) => {
    return activeCategory === "All" || p.brand === activeCategory;
  });

  return (
    <div className="shop-container">
      <Navbar user={user} />
      
      <style>{`
        .shop-container { background: #f8f9fa; min-height: 100vh; padding-bottom: 50px; }
        
        .hero-section {
          background: #2b7fff; color: #fff; padding: 40px 20px; text-align: left;
          border-radius: 0 0 15px 15px; margin-bottom: 20px;
        }
        .hero-section h2 { font-size: 24px; font-weight: 700; margin: 0; }
        .hero-section p { font-size: 14px; opacity: 0.9; margin-top: 5px; }

        /* --- CATEGORY SECTION STYLES --- */
        .categories-wrapper {
          padding: 10px 20px;
          display: flex;
          overflow-x: auto;
          gap: 12px;
          justify-content: center;
          scrollbar-width: none; /* Firefox */
        }
        .categories-wrapper::-webkit-scrollbar { display: none; /* Chrome/Safari */ }

        .category-pill {
          background: #fff;
          border: 1px solid #e0e0e0;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          white-space: nowrap;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
        }
        .category-pill.active {
          background: #2b7fff;
          color: #fff;
          border-color: #2b7fff;
          box-shadow: 0 4px 8px rgba(43, 127, 255, 0.3);
        }

        .products-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px; padding: 20px; max-width: 1200px; margin: 0 auto;
        }

        .product-card {
          background: #fff; border-radius: 12px; padding: 15px;
          display: flex; flex-direction: column; position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: 0.3s;
          cursor: pointer;
        }

        .product-image-container {
          width: 100%; height: 140px; position: relative;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 10px;
        }
        
        .product-image-container img:not(.logo-img) { 
          max-height: 75%; max-width: 70%; object-fit: contain; 
        }

        .product-discount-badge {
          position: absolute; top: -5px; left: -5px; background: #e31e24;
          color: #fff; padding: 4px 10px; border-radius: 6px;
          font-size: 12px; font-weight: 700; z-index: 10;
        }

        .logo-checkout-btn {
          position: absolute; top: -5px; right: -5px; cursor: pointer; z-index: 10;
        }
        .logo-checkout-btn .logo-img { width: 38px; height: 38px; object-fit: contain; }

        .product-info { padding: 5px 0 0 0; display: flex; flex-direction: column; flex-grow: 1; }
        .product-name { font-size: 17px; font-weight: 600; color: #333; margin: 0 0 10px 0; height: 42px; overflow: hidden; }

        .price-row {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 15px; width: 100%;
        }
        .current-price { font-size: 20px; font-weight: 700; color: #2b7fff; }
        .old-price { font-size: 14px; color: #aaa; text-decoration: line-through; margin-left: 8px; }

        .add-cart-btn {
          width: 100%; background: #2b7fff; color: white; border: none;
          padding: 10px; border-radius: 8px; font-weight: 700; font-size: 15px;
          cursor: pointer; transition: 0.2s; margin-top: auto;
        }

        @media (max-width: 600px) {
          .products-grid { grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; }
          .product-card { padding: 10px; border-radius: 10px; }
          .product-image-container { height: 110px; }
          .product-name { font-size: 14px; height: 35px; }
          .current-price { font-size: 17px; }
          .logo-checkout-btn .logo-img { width: 32px; height: 32px; }
        }
      `}</style>

      {showToast && <div className={`toast-notification ${toastType}`}>{toastMessage}</div>}

      <section className="hero-section">
        <h2>Electronic Components</h2>
        <p>Find everything you need for your engineering projects</p>
      </section>

      {/* --- RENDER CATEGORY PILLS --- */}
      <div className="categories-wrapper">
        {categories.map((cat) => (
          <div 
            key={cat} 
            className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      <section className="products-section">
        {loading ? (
          <div style={{textAlign:'center', padding:'50px'}}>Loading...</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const inCart = isProductInCart(product.name);
              const priceNum = parseFloat(product.price);
              const finalPrice = priceNum * (1 - (product.discount || 0) / 100);

              return (
                <div className="product-card" key={product.id} onClick={() => navigate("/product", { state: { product } })}>
                  <div className="product-image-container">
                    {product.discount > 0 && <span className="product-discount-badge">{product.discount}% OFF</span>}
                    
                    <div className="logo-checkout-btn" onClick={(e) => {
                      e.stopPropagation();
                      navigate("/checkout", { state: { product } });
                    }}>
                      <img src="/jasalogo512px.png" alt="Buy Now" className="logo-img" />
                    </div>

                    <img src={product.imageUrl} alt={product.name} />
                  </div>

                  <div className="product-info">
                    <h5 className="product-name">{product.name}</h5>
                    
                    <div className="price-row">
                      <span className="current-price">₹{finalPrice.toFixed(0)}</span>
                      {product.discount > 0 && <span className="old-price">₹{product.price}</span>}
                    </div>

                    <button 
                      className="add-cart-btn" 
                      onClick={(e) => addToCart(e, product)}
                      style={{ background: inCart ? '#555' : '#2b7fff' }}
                      disabled={inCart}
                    >
                      {inCart ? "In Cart" : "Add to cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ElectronicKit;