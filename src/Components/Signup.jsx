import { Link, useNavigate, useLocation } from "react-router-dom";
import "../css/Signup.css";
import React, { useState, useEffect, useRef } from "react";
import { auth, database } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set, onValue } from "firebase/database";

/* =========================
   ✅ Navbar Component
   ========================= */
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

/* =========================
   ✅ Signup Component
   ========================= */
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phno, setPhno] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  const admins = ["saleem1712005@gmail.com", "jayaraman00143@gmail.com", "abcd1234@gmail.com"];
  const [tempAdmins, setTempAdmins] = useState([]);
  const address = "Paavai Engineering College, Pachal, Tamilnadu, 637018";

  useEffect(() => {
    const tempAdminsRef = ref(database, "tempadmin");
    onValue(
      tempAdminsRef,
      (snapshot) => {
        const tempAdminsList = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const tempAdminEmail = childSnapshot.child("email").val();
            if (tempAdminEmail) tempAdminsList.push(tempAdminEmail);
          });
        }
        setTempAdmins(tempAdminsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching temp admins:", error);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (admins.includes(user.email)) navigate("/admin");
        else if (tempAdmins.includes(user.email)) navigate("/tempadmin");
        else navigate("/xerox");
      }
    });
    return () => unsubscribe();
  }, [navigate, tempAdmins]);

  const showTermsAndConditions = () => navigate("/terms");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setMessage("❌ Please accept the terms and conditions to proceed.");
      setTimeout(() => setMessage(""), 4000);
      return;
    }
    if (phno.length !== 10) {
      setMessage("❌ Phone number must be exactly 10 digits.");
      setTimeout(() => setMessage(""), 4000);
      return;
    }
    if (password.length < 6) {
      setMessage("❌ Password must be at least 6 characters.");
      setTimeout(() => setMessage(""), 4000);
      return;
    }
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    try {
      setMessage("✅ Creating account... Please wait.");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      const isAdmin = admins.includes(email);
      const isTempAdmin = tempAdmins.includes(email);
      let storagePath;
      if (isAdmin) storagePath = `admins/${user.uid}`;
      else if (isTempAdmin) storagePath = `tempadmin1/${user.uid}`;
      else storagePath = `users/${user.uid}`;

      const userDetails = {
        name,
        email,
        phno,
        userid: user.uid,
        address: isAdmin || isTempAdmin ? "" : address,
      };
      await set(ref(database, storagePath), userDetails);

      setMessage("✅ Account Created Successfully! Redirecting...");
      if (isAdmin) navigate("/admin");
      else if (isTempAdmin) navigate("/tempadmin");
      else navigate("/xerox");
    } catch (error) {
      if (error.code === "auth/email-already-in-use")
        setMessage("❌ Email is already registered. Please login.");
      else setMessage("❌ Error: " + error.message);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  if (loading) return <div className="loadingsignupt">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="signupboxsignupt">
        <form className="signupbox1signupt" onSubmit={handleSignup}>
          <h1 className="signuph1signupt">Signup</h1>
          <input
            className="signupinputsignupt"
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="signupinputsignupt"
            type="tel"
            placeholder="Enter Your Phone Number"
            value={phno}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) setPhno(value);
            }}
            maxLength="10"
            required
          />
          <input
            className="signupinputsignupt"
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="signupinputsignupt"
            type={showPassword ? "text" : "password"}
            placeholder="Create Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="signupinputsignupt"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="show-password-containersignupt">
            <input
              type="checkbox"
              id="show-password"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="checkboxinputsignupt"
            />
            <label htmlFor="show-password" className="checkboxlabelsignupt">
              Show Password
            </label>
          </div>

          <div className="terms-containersignupt">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
              className="checkboxinputsignupt"
            />
            <label htmlFor="terms-checkbox" onClick={showTermsAndConditions} className="termslabelsignupt">
              I accept the Terms and Conditions
            </label>
          </div>

          <button type="submit" className="signupbuttonsignupt">Sign Up</button>

          {message && (
            <div className={`signupmessagesignupt ${message.startsWith("❌") ? "errorsignupt" : ""}`}>
              {message}
            </div>
          )}

          <p className="login-linksignupt">
            Already have an account?{" "}
            <Link to="/login" className="loginlinktextsignupt">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Signup;
