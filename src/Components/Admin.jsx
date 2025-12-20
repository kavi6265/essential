import { useState, useEffect } from "react";
import { auth, database } from "./firebase";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import "../css/Admin.css";

function Admin({ user }) { // Added user prop to match your navbar logic
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // RESTORED: State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // RESTORED: useEffect to read search query from URL on load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = ref(database, `admins/${currentUser.uid}`);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setProfileImageUrl(userData.profileImageUrl || null);
          setUserName(userData.name || "");
        }
      });
    }
  }, []);

  // RESTORED: function to handle search and navigation
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/best-product?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      navigate("/login");
    }).catch(console.error);
  };

  const toggleLogoutDropdown = () => setShowLogoutDropdown(!showLogoutDropdown);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const handleProfileClick = () => {
    navigate("/admin/Profileadmin");
    closeMenu();
    setShowLogoutDropdown(false);
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  /* ================= ICONS ================= */
  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007bff" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
        {/* DESKTOP HEADER */}
        <div className="fk-desktop-row">
          <div className="fk-left-section">
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
<div className="fk-right-buttons">
  {/* Home & Cart Buttons */}
  <Link to="/" className={`fk-header-btn home-btn secondary-btn ${isActive("/")}`}>
    <HeaderHomeIcon /><span>Home</span>
  </Link>

  

  {/* INTEGRATED ADMIN LINKS */}
  <Link to="/admin/orders" className={`fk-header-btn admin-link secondary-btn ${isActive("/admin/orders")}`}>
    <span>Orders</span>
  </Link>
  
  <Link to="/admin/tempadmincontrol" className={`fk-header-btn admin-link secondary-btn ${isActive("/admin/tempadmincontrol")}`}>
    <span>Admin Control</span>
  </Link>
  
  <Link to="/admin/addproduct" className={`fk-header-btn admin-link secondary-btn ${isActive("/admin/addproduct")}`}>
    <span>Add Product</span>
  </Link>
  <Link to="/admin/electronicproduct" className={`fk-header-btn admin-link secondary-btn ${isActive("/admin/electronicproduct")}`}>
    <span>Electronic Product</span>
  </Link>
  <Link to="/admin/viewproduct" className={`fk-header-btn admin-link secondary-btn ${isActive("/admin/viewproduct")}`}>
    <span>Book</span>
  </Link>
  
  <Link to="/admin/manageuser" className={`fk-header-btn admin-link secondary-btn ${isActive("/admin/manageuser")}`}>
    <span>Manage User</span>
  </Link>
  <Link to="/admin/banner" className={`fk-header-btn admin-link secondary-btn ${isActive("/admin/banner")}`}>
    <span>Banner</span>
  </Link>

  {/* Profile Dropdown */}
  <div className="profile-link-container" style={{ position: 'relative' }}>
    <div className={`fk-header-btn profile-btn secondary-btn ${isActive("/admin/Profileadmin")}`} onClick={toggleLogoutDropdown}>
      <img src={profileImageUrl || "/person3.jpg"} alt="Admin" style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px', cursor: 'pointer' }} />
      <span>{userName || "Admin"}</span>
    </div>

    {showLogoutDropdown && (
      <div className="logout-dropdown" style={{ display: 'block', top: '50px' }}>
        <div className="user-info">
          <span className="user-name">{userName || "Admin"}</span>
          <span className="user-role">Administrator</span>
        </div>
        <div className="dropdown-divider"></div>
        <button onClick={handleProfileClick} className="logout-dropdown-btn">Profile Settings</button>
        <button onClick={handleLogout} className="logout-dropdown-btn">
          <i className="bx bx-log-out"></i> Logout
        </button>
      </div>
    )}
  </div>
</div>
        </div>

        {/* MOBILE HEADER */}
       
      </header>

      {/* ADMIN NAVIGATION (The Sidebar/Menu from original Admin code) */}
     
      <section id="admin-content">
        <Outlet />
      </section>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fk-bottom-nav">
       
      </nav>

      <style>{`
        /* ... All the CSS from your provided Navbar function goes here ... */
        .fk-header { background: #fff; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 1000; }
        .fk-logo img { height: 45px; cursor: pointer; }
        .fk-desktop-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; max-width: 1400px; margin: 0 auto; }
        .fk-search-new-style { flex-grow: 1; max-width: 500px; margin: 0 20px; position: relative; display: flex; align-items: center; border: 1.5px solid #ccc; border-radius: 999px; height: 40px; overflow: hidden; }
        .fk-search-new-style input { flex: 1; border: none; outline: none; padding: 0 10px 0 20px; font-size: 14px; height: 100%; }
        .fk-search-new-style span { cursor: pointer; padding: 0 15px; display: flex; align-items: center; }
        .fk-right-buttons { display: flex; gap: 5px; }
        .fk-header-btn { display: flex; align-items: center; padding: 0 18px; height: 40px; border-radius: 999px; text-decoration: none; font-size: 14px; font-weight: 600; cursor: pointer }
        .secondary-btn { border: 1px solid #007bff; color: #007bff; background: #fff; }
        .secondary-btn.active { background: #007bff; color: #fff; }
        
        .logout-dropdown {
            position: absolute;
            right: 0;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-radius: 8px;
            padding: 10px;
            min-width: 200px;
            z-index: 2000;
            cursor: pointer;
        }

        @media (max-width: 900px) {
          .fk-desktop-row { display: none; }
          .fk-mobile-header { display: flex; align-items: center; gap: 10px; padding: 10px; }
          .fk-bottom-nav { display: flex; position: fixed; bottom: 0; width: 100%; height: 60px; background: #281c72ff; justify-content: space-around; align-items: center; }
          .fk-bottom-nav a { color: #fff; text-decoration: none; display: flex; flex-direction: column; align-items: center; font-size: 11px; }
          .fk-bottom-nav .active { color: #1a73e8; }
        }
      `}</style>
    </>
  );
}

export default Admin;