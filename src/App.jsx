import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { auth, database } from "./Components/firebase";
import { getDatabase, ref, onValue } from "firebase/database";

import Home from "./Components/Home";
import Shop from "./Components/Shop";
import Xerox from "./Components/Xerox";
import ElectronicKit from "./Components/ElectronicKit";
import BestProduct from "./Components/BestProduct";
import About from "./Components/About";
import ProductsAllordersadmin from "./Components/ProductsAllordersadmin";
import ProfileTempadmin from "./Components/ProfileTempadmin";
import Contact from "./Components/Contact";
import OrderedProductpreviewadmin from "./Components/OrderedProductpreviewadmin";
import Cart from "./Components/Cart";
import Login from "./Components/Login";
import XeroxOrderpreviewtempadmin from "./Components/XeroxOrderpreviewtempadmin";
import EditProfile from "./Components/EditProfile";
import Signup from "./Components/Signup";
import XeroxAllordersAdmin from "./Components/XeroxAllordersAdmin";
import OrdersControlatempadmin from "./Components/OrdersControlatempadmin";
import Success from "./Components/Succes";
import ProductView from "./Components/ProductView";
import XeroxOrdertempadmin from "./Components/XeroxOrdertempadmin";
import OrdersControldmin from "./Components/OrdersControldmin";
import Admin from "./Components/Admin";
import Orders from "./Components/Orders";
import Tempadmincontrol from "./Components/Tempadmincontrol";
import Checkout from "./Components/Checkout";
import Profile from "./Components/Profile";
import ProductOrderUser from "./Components/ProductOrderUser";
import OrderDetail from "./Components/OrdersDetails";
import Profileadmin from "./Components/Profileadmin";
import Tempadmin from "./Components/Tempadmin";
import ConfirmOrder from "./Components/ConfirmOrder";
import OrderedProductpreview from "./Components/OrderedProductpreview";
import Payment from "./Components/Payment";
import "./css/index.css";
import XeroxOrderUser from "./Components/XeroxOrdersuser";
import Xeroxorderpreview from "./Components/Xeroxoderpreview";
import XeroxAllordersmAdmin from "./Components/XeroxAllordersmAdmin";
import AddProduct from "./Components/AddProduct";
import Products from "./Components/Products";
import ManageUser from "./Components/ManageUser";
import ElectronicProduct from "./Components/ElectronicProduct";
import ViewProduct from "./Components/ViewProduct";
import Banner from "./Components/Banner";

function App() {
  const [user, setUser] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [tempAdmins, setTempAdmins] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const admins = [
    "saleem1712005@gmail.com",
    "jayaraman00143@gmail.com",
    "abcd1234@gmail.com",
  ];

  const fetchUserProfile = (userId) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);

    onValue(
      userRef,
      (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.profileImageUrl) {
          setProfileImageUrl(userData.profileImageUrl);
        } else {
          setProfileImageUrl(null);
        }
      },
      (error) => {
        console.error("Error fetching user profile:", error);
        setProfileImageUrl(null);
      }
    );
  };

  const fetchTempAdmins = () => {
    const tempAdminsRef = ref(database, "tempadmin");
    onValue(
      tempAdminsRef,
      (snapshot) => {
        const tempAdminsList = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const tempAdminEmail = childSnapshot.child("email").val();
            if (tempAdminEmail) {
              tempAdminsList.push(tempAdminEmail.toLowerCase());
            }
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
  };

  useEffect(() => {
    fetchTempAdmins();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("userEmail", currentUser.email);
        localStorage.setItem("userId", currentUser.uid);

        fetchUserProfile(currentUser.uid);

        const tempAdminsRef = ref(database, "tempadmin");
        onValue(tempAdminsRef, (snapshot) => {
          const tempAdminsList = [];
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const tempAdminEmail = childSnapshot.child("email").val();
              if (tempAdminEmail) {
                tempAdminsList.push(tempAdminEmail.toLowerCase());
              }
            });
          }

          setTempAdmins(tempAdminsList);

          const lowerEmail = currentUser.email.toLowerCase();
          const role = admins.includes(lowerEmail)
            ? "admin"
            : tempAdminsList.includes(lowerEmail)
            ? "tempadmin"
            : "user";

          setUserRole(role);
          localStorage.setItem("userRole", role);

          if (
            location.pathname === "/login" ||
            location.pathname === "/signup"
          ) {
            const routeToNavigate =
              role === "admin"
                ? "/admin"
                : role === "tempadmin"
                ? "/tempadmin"
                : "/xerox";
            navigate(routeToNavigate);
          }
        });
      } else {
        setUser(null);
        setProfileImageUrl(null);
        setUserRole("user");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");

        const protectedRoutes = [
          "/cart",
          "/profile",
          "/edit-profile",
          "/payment",
          "/xeroxordersuser",
          "/confirm-order",
          "/ProductOrderUser",
          "/checkout",
          "/success",
        ];

        if (
          protectedRoutes.includes(location.pathname) ||
          location.pathname.includes("/OrderedProductpreview/") ||
          location.pathname.includes("/order-detail/")
        ) {
          navigate("/login", { state: { from: location.pathname } });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            userRole === "admin" ? (
              <Navigate to="/admin" />
            ) : userRole === "tempadmin" ? (
              <Navigate to="/tempadmin" />
            ) : (
              <BestProduct />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<ProductView />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/checkout"
          element={
            user ? (
              <Checkout />
            ) : (
              <Navigate to="/login" state={{ from: "/checkout" }} />
            )
          }
        />
        <Route
          path="/order-detail/:id"
          element={
            user ? (
              <OrderDetail />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/home"
          element={
            userRole === "admin" ? (
              <Navigate to="/admin" />
            ) : userRole === "tempadmin" ? (
              <Navigate to="/tempadmin" />
            ) : (
              <Home />
            )
          }
        />
        <Route path="/shop" element={<Shop />} />
        <Route
          path="/success"
          element={user ? <Success /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-profile"
          element={
            user ? (
              <EditProfile />
            ) : (
              <Navigate to="/login" state={{ from: "/edit-profile" }} />
            )
          }
        />
        <Route path="/xerox" element={<Xerox />} />
        <Route
          path="/payment"
          element={
            user ? (
              <Payment />
            ) : (
              <Navigate to="/login" state={{ from: "/payment" }} />
            )
          }
        />
        <Route
          path="/xeroxordersuser"
          element={
            user ? (
              <XeroxOrderUser />
            ) : (
              <Navigate to="/login" state={{ from: "/xeroxordersuser" }} />
            )
          }
        />
        <Route path="/ElectronicKit" element={<ElectronicKit />} />
        <Route path="/best-product" element={<BestProduct />} />
        <Route
          path="/OrderedProductpreview/:userId/:orderId"
          element={user ? <OrderedProductpreview /> : <Navigate to="/login" />}
        />
        <Route
          path="/confirm-order"
          element={
            user ? (
              <ConfirmOrder />
            ) : (
              <Navigate to="/login" state={{ from: "/confirm-order" }} />
            )
          }
        />
        <Route
          path="/ProductOrderUser"
          element={
            user ? (
              <ProductOrderUser />
            ) : (
              <Navigate to="/login" state={{ from: "/ProductOrderUser" }} />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/Xeroxorderpreview"
          element={user ? <Xeroxorderpreview /> : <Navigate to="/login" />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/cart"
          element={
            user ? (
              <Cart />
            ) : (
              <Navigate to="/login" state={{ from: "/cart" }} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile />
            ) : (
              <Navigate to="/login" state={{ from: "/profile" }} />
            )
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={userRole === "admin" ? <Admin /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/admin/orders" replace />} />
          <Route path="orders" element={<Orders />} />
          <Route
            path="OrderedProductpreviewadmin/:userId/:orderId"
            element={<OrderedProductpreviewadmin />}
          />
          <Route path="xeroxallordersadmin" element={<XeroxAllordersAdmin />} />
          <Route
            path="ProductsAllordersadmin"
            element={<ProductsAllordersadmin />}
          />
          <Route
            path="XeroxAllordersmAdmin"
            element={<XeroxAllordersmAdmin />}
          />
          <Route path="xeroxorderpreview" element={<Xeroxorderpreview />} />
          <Route path="Profileadmin" element={<Profileadmin />} />
          <Route path="tempadmincontrol" element={<Tempadmincontrol />} />
          <Route path="OrdersControldmin" element={<OrdersControldmin />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="products" element={<Products />} />
          <Route path="manageuser" element={<ManageUser />} />
          <Route path="electronicproduct" element={<ElectronicProduct />} />
          <Route path="viewproduct" element={<ViewProduct />} />
           <Route path="banner" element={<Banner />} />
        </Route>

        {/* Temp Admin Routes */}
        <Route
          path="/tempadmin"
          element={
            userRole === "tempadmin" ? <Tempadmin /> : <Navigate to="/login" />
          }
        >
          <Route
            index
            element={<Navigate to="/tempadmin/XeroxOrdertempadmin" replace />}
          />
          <Route path="XeroxOrdertempadmin" element={<XeroxOrdertempadmin />} />
          <Route path="xeroxorderpreview" element={<Xeroxorderpreview />} />
          <Route
            path="OrdersControlatempadmin/xeroxorderpreview"
            element={<Xeroxorderpreview />}
          />
          <Route
            path="XeroxOrderpreviewtempadmin/:userId/:orderId/:gt"
            element={<XeroxOrderpreviewtempadmin />}
          />
          <Route
            path="OrdersControlatempadmin"
            element={<OrdersControlatempadmin />}
          />
          <Route path="xeroxallordersadmin" element={<XeroxAllordersAdmin />} />
          <Route path="profile" element={<ProfileTempadmin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
