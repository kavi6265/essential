import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { auth, database } from "./firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, onValue, get, set, remove } from "firebase/database";
import "../css/Login.css";

/* ---------------- NAVBAR COMPONENT ---------------- */
export function Navbar({ user, auth }) {
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
/* ---------------- LOGIN COMPONENT ---------------- */
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const admins = [
    "saleem1712005@gmail.com",
    "jayaraman00143@gmail.com",
    "abcd1234@gmail.com",
  ];
  const [tempAdmins, setTempAdmins] = useState([]);

  useEffect(() => {
    const tempAdminsRef = ref(database, "tempadmin");
    onValue(tempAdminsRef, (snapshot) => {
      const list = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          const email = child.child("email").val();
          if (email) list.push(email);
        });
      }
      setTempAdmins(list);
      setLoading(false);
    });
  }, []);

  const migrateUserToTempAdmin = async (userId, userEmail) => {
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnap = await get(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.val();
        const tempRef = ref(database, `tempadmin1/${userId}`);
        await set(tempRef, userData);
        await remove(userRef);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter all details");
      setMessageType("error");
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      let userType = "user";

      if (admins.includes(email.toLowerCase())) userType = "admin";
      else if (tempAdmins.includes(email.toLowerCase())) {
        userType = "tempadmin";
        await migrateUserToTempAdmin(user.uid, email);
      }

      setMessage("Login Successful! Redirecting...");
      setMessageType("success");

      setTimeout(() => {
        if (typeof onLogin === "function") onLogin();
        navigate(
          userType === "admin"
            ? "/admin"
            : userType === "tempadmin"
            ? "/tempadmin"
            : "/best-product"
        );
      }, 1000);
    } catch {
      setMessage("Invalid credentials. Try again.");
      setMessageType("error");
    }
  };

  const handleForgotPassword = () => {
    setResetEmail(email);
    setShowResetModal(true);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setMessage("Please enter your registered email.");
      setMessageType("error");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setShowResetModal(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch {
      setMessage("Failed to send reset email.");
      setMessageType("error");
    }
  };

  if (loading) return <div className="loadingloginl">Loading...</div>;

  return (
    <>
      {/* ✅ Include Navbar */}
      <Navbar user={null} profileImageUrl={null} />

      {/* ✅ Login Form */}
      <div className="loginboxloginl">
        <form className="loginbox1loginl" onSubmit={handleLogin}>
          <h2 className="loginh1loginl">Login</h2>
          <input
            className="logininputloginl"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-containerloginl">
            <input
              className="logininputloginl"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="showloginl">
            <label className="show-passwordloginl">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show Password
            </label>
            <p className="forgotpasswordlinkloginl" onClick={handleForgotPassword}>
              Forgot Password?
            </p>
          </div>

          <button type="submit" className="loginbuttonloginl">
            Login
          </button>

          {message && <div className={`loginmessageloginl ${messageType}`}>{message}</div>}

          <p className="signup-linkloginl">
            Don't have an account?
            <span
              className="signup-textloginl"
              onClick={() => navigate("/signup")}
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "16px",
              }}
            >
              Create Account
            </span>
          </p>
        </form>
      </div>

      {/* Reset & Success Modals */}
      {showResetModal && (
        <div className="reset-modaloginl">
          <div className="reset-modal-contentloginl">
            <h4>Reset Password</h4>
            <input
              type="email"
              placeholder="Enter your email for reset"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="reset-email-inputloginl"
            />
            <div className="reset-buttonsloginl">
              <button className="reset-buttonloginl" onClick={handleResetPassword}>
                Reset
              </button>
              <button
                className="cancel-buttonloginl"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="success-modaloginl">
          <div className="success-modal-contentloginl">
            <div className="checkmark-circleoginl">
              <div className="backgroundoginl"></div>
              <div className="checkmark-drawoginl"></div>
            </div>
            <h3>Password Reset Link Sent!</h3>
            <p>Please check your inbox or Spam mail to reset your password.</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
