import React, { useState, useEffect } from 'react';
import { auth, database } from './firebase';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Added useLocation, Link
import { ref, onValue } from 'firebase/database';
import "../css/Profile.css";

// =========================================================================
// 🟢 INTEGRATED NAVBAR COMPONENT 🟢
// This is the entire header logic defined within the same file.
// =========================================================================

function Navbar({ user, auth }) {
  const location = useLocation();
  const navigate = useNavigate();
  // REMOVED: searchQuery state
  // REMOVED: useEffect hook for search query
  // REMOVED: handleSearch function

  // Function to determine if a path is active
  const isActive = (path) => (location.pathname === path ? "active" : "");

  /* ================= ICONS ================= */

  // REMOVED: SearchIcon definition
  
  const HeaderHomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );

  const HeaderCartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  );
  
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
            <div className="fk-logo" onClick={() => navigate("/")}>
              <img src="/jasalogo512px.png" alt="Logo" />
            </div>
          </div>
          
          {/* REMOVED: CENTER Search Bar JSX */}

          {/* RIGHT: Home/Cart/Profile/Login Buttons */}
          <div className="fk-right-buttons">
            
            {/* Home button */}
            <Link to="/" className={`fk-header-btn home-btn secondary-btn ${isActive("/")}`}>
                <HeaderHomeIcon />
                <span>Home</span>
            </Link>
            
            {/* Cart button */}
            <Link to="/cart" className={`fk-header-btn cart-btn secondary-btn ${isActive("/cart")}`}>
                <HeaderCartIcon />
                <span>Cart</span>
            </Link>

            {user ? (
              // Profile button (Active style applied)
              <Link to="/profile" className={`fk-header-btn profile-btn secondary-btn ${isActive("/profile")}`}>
                <HeaderUserIcon />
                <span>Profile</span>
              </Link>
            ) : (
              // Login button
              <Link to="/login" className="fk-header-btn login-btn primary-btn">
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

          {/* REMOVED: Mobile Search Bar JSX */}
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
        /* Note: This CSS is injected directly for the Navbar component */
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
          /* Changed to space-between as search is removed */
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

        /* 1. REMOVED: Search Box styles and made the container hidden */
        .fk-search-new-style {
          display: none; 
          /* Flex properties removed */
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
        
        /* 🔵 Primary Button Style (Login) */
        .primary-btn {
            background-color: #007bff; 
            border: 1px solid #007bff;
            color: #ffffff; 
        }

        .primary-btn svg {
            stroke: #ffffff; 
        }
        
        /* ⚪ Secondary Button Style (Home, Cart, Profile - Default/Inactive) */
        .secondary-btn {
            background-color: #ffffff; 
            border: 1px solid #007bff; 
            color: #007bff; 
        }
        
        .secondary-btn svg {
            stroke: #007bff; 
        }
        
        /* 🎨 Active State for Secondary Buttons (Solid Blue Background) */
        .secondary-btn.active {
            background-color: #007bff; 
            border-color: #007bff; 
            color: #ffffff; 
        }
        
        .secondary-btn.active svg {
            stroke: #ffffff; 
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
            /* Use space-between for logo and potential icons/buttons if added later */
            justify-content: space-between; 
            gap: 10px;
            padding: 10px;
          }
          
          .fk-mobile-header .fk-logo {
            flex-shrink: 0; 
          }

          /* Hide search bar in mobile view too, though it was already hidden on desktop */
          .fk-mobile-header .fk-search-new-style {
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
// 🟢 END OF INTEGRATED NAVBAR COMPONENT 🟢
// =========================================================================


// =========================================================================
// PROFILE COMPONENT STARTS HERE
// =========================================================================

function Profile() {
  const navigate = useNavigate();
  // Ensure 'user' is the current authenticated user object
  const user = auth.currentUser; 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);
    
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      } else {
        setUserData({
          name: user.displayName || 'User',
          email: user.email,
          phno: user.phno,
          profileImageUrl: user.photoURL || ''
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    auth.signOut()
      .then(() => {
        localStorage.removeItem('cart');
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (loading) {
    return (
      <>
        {/* Render Navbar while loading */}
        <Navbar user={user} auth={auth} /> 
        <div className="profile-loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 🟢 RENDER THE NAVBAR COMPONENT 🟢 */}
      <Navbar user={user} auth={auth} />
      
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-cover"></div>
            <div className="profile-avatar">
              <img 
                src={userData?.profileImageUrl || "person3.jpg"} 
                alt="Profile" 
              />
            </div>
            <div className="profile-info">
              <h1>{userData?.name || 'User'}</h1>
              <p>{userData?.email}</p>
            </div>
          </div>

          <div className="profile-card">
            <h2>Personal Information</h2>
            <div className="profile-details">
              <div className="detail-row">
                <div className="detail-label">Name</div>
                <div className="detail-value">{userData?.name || 'User'}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Email</div>
                <div className="detail-value">{userData?.email}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">Phone</div>
                <div className="detail-value">{userData?.phno || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={() => navigate("/edit-profile")} className="action-button edit">
              <span className="action-icon">✏️</span>
              <span>Edit Profile</span>
            </button>
            
            <button onClick={() => navigate("/xeroxordersuser")} className="action-button xerox">
              <span className="action-icon">📄</span>
              <span>Xerox Orders</span>
            </button>

            <button onClick={() => navigate("/ProductOrderUser")} className="action-button stationary">
              <span className="action-icon">📚</span>
              <span>Stationary Orders</span>
            </button>
            
            <button onClick={handleLogoutClick} className="action-button logout">
              <span className="action-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Custom Logout Confirmation Dialog */}
        {showLogoutConfirm && (
          <div className="logout-confirm-overlay">
            <div className="logout-confirm-dialog">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>
              <div className="logout-confirm-buttons">
                <button 
                  className="logout-cancel-btn" 
                  onClick={handleCancelLogout}
                >
                  Cancel
                </button>
                <button 
                  className="logout-confirm-btn" 
                  onClick={handleConfirmLogout}
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;