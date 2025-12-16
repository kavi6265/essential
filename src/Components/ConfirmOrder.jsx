import React, { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";
import "../css/ConfirmOrder.css";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";

function ConfirmOrder() {
  const [orderDetails, setOrderDetails] = useState({ files: [], totalCost: 0 });
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // ✅ Address States
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const auth = getAuth();
  const database = getDatabase();
  const storage = getStorage();

  useEffect(() => {
    const storedFiles = sessionStorage.getItem("serializableFiles");
    const storedTotalCost = sessionStorage.getItem("totalCost");
    
    if (storedFiles && storedTotalCost) {
      const parsedFiles = JSON.parse(storedFiles);
      const totalCost = parseFloat(storedTotalCost);
      const fileObjects = window.FileStorage || {};
      
      const reconstructedFiles = parsedFiles.map((fileData, index) => ({
        ...fileData,
        file: fileObjects[index]
      }));
      
      const missingFiles = reconstructedFiles.filter(file => !file.file);
      if (missingFiles.length > 0) {
        console.error(`Missing File objects for ${missingFiles.length} files`);
        setError(`${missingFiles.length} files are missing data. Please go back and try again.`);
      }

      setOrderDetails({ files: reconstructedFiles, totalCost });
    } else {
      navigate("/xerox");
    }

    if (auth.currentUser) fetchUsername(auth.currentUser.uid);
  }, [navigate, auth.currentUser]);

  const fetchUsername = async (userId) => {
    try {
      const userRef = dbRef(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUsername(userData.name || userData.displayName || "User");
      } else {
        setUsername(auth.currentUser?.displayName || "User");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      setUsername(auth.currentUser?.displayName || "User");
    }
  };

  const handleNotesChange = (e) => setNotes(e.target.value);
  const handleGoBack = () => navigate("/xerox");

  const fileToBlob = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const blob = new Blob([reader.result]);
        resolve(blob);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadFilesToFirebase = async (orderId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError("User not authenticated. Please login again.");
      return null;
    }

    const fileDetailsArray = [];
    try {
      if (!orderDetails.files || orderDetails.files.length === 0) {
        setError("No files found for upload");
        return null;
      }

      for (let index = 0; index < orderDetails.files.length; index++) {
        const fileData = orderDetails.files[index];
        if (!fileData.file) continue;
        const file = fileData.file;

        const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const fileStorageRef = storageRef(storage, `pdfs/${orderId}/${safeFileName}`);

        const fileBlob = await fileToBlob(file);
        const snapshot = await uploadBytes(fileStorageRef, fileBlob);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const fileDetails = {
          [`color${index}`]: fileData.printType === "color" ? "Color" : "Black",
          [`format${index}`]: fileData.format,
          [`finalamt${index}`]: fileData.finalAmount.toFixed(2),
          [`name${index}`]: file.name,
          [`pages${index}`]: fileData.totalPages.toString(),
          [`perpage${index}`]: fileData.perPagePrice.toFixed(2),
          [`perqtyamt${index}`]: fileData.amountPerQuantity.toFixed(2),
          [`qty${index}`]: fileData.quantity.toString(),
          [`ratio${index}`]: fileData.ratio,
          [`sheet${index}`]: fileData.paperType,
          [`uri${index}`]: downloadURL,
          [`userid${index}`]: userId
        };

        fileDetailsArray.push(fileDetails);
        setUploadProgress((prev) => Math.min(prev + (100 / orderDetails.files.length), 100));
      }

      return fileDetailsArray;
    } catch (error) {
      console.error("Error in uploadFilesToFirebase:", error);
      setError(`Failed to upload files: ${error.message}`);
      return null;
    }
  };

  const saveOrderToRealtimeDB = async (orderId, fileDetailsArray) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setError("User not authenticated. Please login again.");
      return false;
    }

    try {
      const baseOrderData = {
        orderid0: orderId,
        notes,
        uploadTime: Date.now(),
        username,
        orderd: true,
        paid: false,
        delivered: false,
        deliveryamt0: "Free",
        grandTotal0: orderDetails.totalCost.toFixed(2),
        address,
        city,
        pincode,
        phoneNumber
      };

      // ✅ Save address separately under uploadscreenshots node
      const addressRef = dbRef(database, `uploadscreenshots/${orderId}`);
      await set(addressRef, {
        address,
        city,
        pincode,
        phoneNumber
      });

      // ✅ Save all file details under pdfs
      for (let i = 0; i < fileDetailsArray.length; i++) {
        const fileDetail = fileDetailsArray[i];
        const safeFileName = fileDetail[`name${i}`].replace(/[.#$\[\]]/g, "_");
        const hasSpiral = orderDetails.files[i].bindingType;

        const completeOrderData = {
          ...baseOrderData,
          color0: fileDetail[`color${i}`],
          format0: fileDetail[`format${i}`],
          finalamt0: fileDetail[`finalamt${i}`],
          name0: fileDetail[`name${i}`],
          pages0: fileDetail[`pages${i}`],
          perpage0: fileDetail[`perpage${i}`],
          perqtyamt0: fileDetail[`perqtyamt${i}`],
          qty0: fileDetail[`qty${i}`],
          ratio0: fileDetail[`ratio${i}`],
          sheet0: fileDetail[`sheet${i}`],
          uri0: fileDetail[`uri${i}`],
          userid0: fileDetail[`userid${i}`],
          bindingType: hasSpiral
        };

        const orderRef = dbRef(database, `pdfs/${userId}/${orderId}/${safeFileName}`);
        await set(orderRef, completeOrderData);
      }

      return true;
    } catch (error) {
      console.error("Error saving order:", error);
      setError("Failed to save order. Please try again.");
      return false;
    }
  };

  const handleConfirmOrder = async () => {
    setError("");

    if (!auth.currentUser) {
      setError("Please login to complete your order.");
      return;
    }

    if (!orderDetails.files || orderDetails.files.length === 0) {
      setError("No files selected for printing.");
      return;
    }

    if (orderDetails.totalCost < 100) {
      setError("Minimum order amount should be more than ₹100");
      return;
    }

    // ✅ Address validation (use correct state variables)
    if (!address || !city || !pincode || !phoneNumber) {
      setError("Please fill in all required address fields.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const orderId = "d" + Date.now().toString().substring(0, 9);

    try {
      const uploadedFileDetails = await uploadFilesToFirebase(orderId);
      if (!uploadedFileDetails) throw new Error("File upload failed");

      const saveResult = await saveOrderToRealtimeDB(orderId, uploadedFileDetails);
      if (!saveResult) throw new Error("Failed to save order details");

      const orderInfo = {
        orderId,
        totalCost: orderDetails.totalCost,
        notes,
        address: { address, city, pincode, phoneNumber }
      };

      navigate("/success", { state: { orderInfo } });
    } catch (error) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="confirm-order-container">
      <div className="header">
        <h1 className="title1">Confirm Order</h1>
      </div>

      <div className="order-summary-section">
        <h2>Order Summary</h2>

        <div className="files-list">
          {orderDetails.files.map((fileData, index) => (
            <div key={index} className="file-item">
              <div className="file-name">
                {fileData.file ? fileData.file.name : "Unnamed File"}
                {!fileData.file && <span className="file-error"> (File data missing)</span>}
              </div>
              <div className="file-details-grid">
                <div className="detail-item"><span className="detail-label">Pages:</span><span className="detail-value">{fileData.totalPages}</span></div>
                <div className="detail-item"><span className="detail-label">Paper:</span><span className="detail-value">{fileData.paperType}</span></div>
                <div className="detail-item"><span className="detail-label">Print:</span><span className="detail-value">{fileData.printType === "color" ? "Color" : "B&W"}</span></div>
                <div className="detail-item"><span className="detail-label">Format:</span><span className="detail-value">{fileData.format}</span></div>
                <div className="detail-item"><span className="detail-label">Ratio:</span><span className="detail-value">{fileData.ratio}</span></div>
                <div className="detail-item"><span className="detail-label">Quantity:</span><span className="detail-value">{fileData.quantity}</span></div>
                <div className="detail-item"><span className="detail-label">Binding:</span><span className="detail-value">{fileData.bindingType && fileData.bindingType !== 'none'
                      ? fileData.bindingType.charAt(0).toUpperCase() + fileData.bindingType.slice(1)
                      : "No"}</span></div>
                <div className="detail-item"><span className="detail-label">Per Page:</span><span className="detail-value">₹{fileData.perPagePrice.toFixed(2)}</span></div>
                <div className="detail-item"><span className="detail-label">Amount per qty:</span><span className="detail-value">₹{fileData.amountPerQuantity.toFixed(2)}</span></div>
                <div className="detail-item final-amount"><span className="detail-label">Final Amount:</span><span className="detail-value">₹{fileData.finalAmount.toFixed(2)}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Address Section */}
        <div className="address-section">
          <h2>Delivery Address</h2>
          <div className="address-fields">
            <input type="text" placeholder="Address Line 1 (House No, Street)" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <input type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
            <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          </div>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <label htmlFor="notes">Additional Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Add any special instructions here..."
            rows={3}
          />
        </div>
      </div>

      <div className="price-summary">
        <div className="price-row"><span className="price-label">Subtotal:</span><span className="price-value">₹{orderDetails.totalCost.toFixed(2)}</span></div>
        <div className="price-row"><span className="price-label">Delivery Fee:</span><span className="price-value">Free</span></div>
        <div className="price-row total"><span className="price-label">Total:</span><span className="price-value">₹{orderDetails.totalCost.toFixed(2)}</span></div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div></div>
          <span>Uploading files: {Math.round(uploadProgress)}%</span>
        </div>
      )}

      <button className="confirm-order-button" onClick={handleConfirmOrder} disabled={isUploading || orderDetails.files.length === 0}>
        {isUploading ? "Uploading Files..." : "Confirm Order"}
      </button>

      {orderDetails.totalCost < 100 && <div className="minimum-order-warning">Minimum order amount should be more than ₹100</div>}
    </div>
  );
}

export default ConfirmOrder;
