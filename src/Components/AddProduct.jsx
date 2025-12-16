import React, { useState, useEffect, useRef } from 'react';
import {
  ref as dbRef,
  onValue,
  set,
  get,
  query,
  orderByKey,
  limitToLast,
  remove,
  update,
} from 'firebase/database';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

/*
  This component assumes you have a 'firebase.js' file in the same directory (or a parent directory, e.g., ../firebase.js).
  That file must export your initialized 'database' and 'storage' instances.
  
  Example 'firebase.js':
  import { initializeApp } from 'firebase/app';
  import { getDatabase } from 'firebase/database';
  import { getStorage } from 'firebase/storage';
  
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  const app = initializeApp(firebaseConfig);
  export const database = getDatabase(app);
  export const storage = getStorage(app);
*/
// Import the database and storage from your firebase configuration file
// Adjust the path if '../firebase.js' is not correct (e.g., './firebase.js' if in the same folder)
import { database, storage } from './firebase.js';

// --- CSS STYLES ---
// All styles are inlined here as requested.
const cssStyles = `
/* --- Global Styles --- */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
  background-color: #f3f4f6; /* Default background */
}

/* Ensures box-sizing for all elements */
*, *::before, *::after {
  box-sizing: border-box;
}

/* --- Main Layout --- */
.product-admin-container {
  background-color: #f3f4f6;
  min-height: 100vh;
  padding: 1rem;
}
@media (min-width: 640px) {
  .product-admin-container {
    padding: 2rem;
  }
}

.main-content-wrapper {
  max-width: 80rem; /* Corresponds to max-w-7xl */
  margin-left: auto;
  margin-right: auto;
}

/* --- Card Container (Used for Add Form and List) --- */
.card-container {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  margin-bottom: 2rem;
}
@media (min-width: 640px) {
  .card-container {
    padding: 2rem;
  }
}

.card-title {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: #1f2937; /* text-gray-800 */
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
}
@media (min-width: 640px) {
  .card-title {
    text-align: left;
  }
}

/* --- Form Styles --- */
.form-space-y {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid-cols-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
@media (min-width: 768px) {
  .form-grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  color: #374151; /* text-gray-700 */
  font-size: 1rem;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6; /* focus:ring-blue-500 */
  box-shadow: 0 0 0 2px #bfdbfe; /* focus:ring-2 */
}

.form-textarea {
  min-height: 8rem; /* Approximates rows="4" */
  resize: vertical;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563; /* text-gray-600 */
  margin-bottom: 0.25rem;
}

.form-file-input {
  width: 100%;
  font-size: 0.875rem;
  color: #4b5563;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

/* Style the file input button */
.form-file-input::file-selector-button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 0;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #eef2ff; /* bg-blue-50 */
  color: #4338ca; /* text-blue-700 */
  cursor: pointer;
  transition: background-color 0.2s;
}

.form-file-input::file-selector-button:hover {
  background-color: #e0e7ff; /* hover:bg-blue-100 */
}

.form-actions {
  padding-top: 0.5rem;
}

/* --- Button Styles --- */
.btn {
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1.25rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2563eb; /* bg-blue-600 */
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
}
.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8; /* hover:bg-blue-700 */
}

.btn-secondary {
  background-color: #e5e7eb; /* bg-gray-200 */
  color: #374151; /* text-gray-700 */
}
.btn-secondary:hover:not(:disabled) {
  background-color: #d1d5db; /* hover:bg-gray-300 */
}

.btn-warning {
  background-color: #f59e0b; /* bg-yellow-400 */
  color: #78350f; /* text-yellow-900 */
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}
.btn-warning:hover:not(:disabled) {
  background-color: #d97706; /* hover:bg-yellow-500 */
}

.btn-danger {
  background-color: #dc2626; /* bg-red-500 */
  color: white;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}
.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c; /* hover:bg-red-600 */
}

/* Button loading spinner */
.btn-loader {
  animation: spin 1s linear infinite;
  margin-right: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* --- Product List --- */
.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* gap-6 */
}
@media (min-width: 640px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1280px) {
  .product-grid { grid-template-columns: repeat(4, 1fr); }
}

.loading-text,
.empty-text {
  text-align: center;
  color: #6b7280; /* text-gray-500 */
  padding: 2.5rem 0;
  font-size: 1.125rem;
}

/* --- Product Card --- */
.product-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}
.product-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* hover:shadow-xl */
}

.product-card-img {
  width: 100%;
  height: 12rem; /* h-48 */
  object-fit: cover;
}

.product-card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* truncate */
  margin-top: 0;
  margin-bottom: 0.25rem;
}

.product-card-brand {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.product-card-desc {
  font-size: 0.875rem;
  color: #4b5563;
  height: 3rem; /* Fixed height for 2 lines */
  line-height: 1.5rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
  /* For multi-line ellipsis (works in webkit) */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-card-price-section {
  margin-top: auto; /* Pushes to bottom */
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.product-card-final-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0;
}

.product-card-discount-section {
  text-align: right;
}

.product-card-original-price {
  color: #6b7280;
  text-decoration: line-through;
  font-size: 0.875rem;
  margin: 0;
}

.product-card-discount-badge {
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #fee2e2; /* bg-red-100 */
  color: #b91c1c; /* text-red-700 */
  padding: 0.125rem 0.5rem;
  border-radius: 9999px; /* rounded-full */
}

.product-card-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding-top: 0.75rem;
  margin-top: 0.5rem;
  border-top: 1px solid #f3f4f6; /* border-gray-100 */
}

/* --- Modal Styles --- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
  width: 100%;
  max-width: 32rem; /* max-w-lg */
  max-height: 90vh;
  overflow-y: auto;
}
@media (min-width: 640px) {
  .modal-content {
    padding: 2rem;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af; /* text-gray-400 */
  padding: 0;
}
.modal-close-btn:hover {
  color: #4b5563; /* hover:text-gray-600 */
}
.modal-close-btn svg {
  width: 1.5rem;
  height: 1.5rem;
}

.modal-current-image-container {
  font-size: 0.875rem;
  color: #4b5563;
}
.modal-current-image {
  width: 5rem;
  height: 5rem;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  display: inline-block;
  margin-left: 0.5rem;
  border: 1px solid #e5e7eb;
}

.modal-footer {
  padding-top: 0.75rem;
  display: flex;
  gap: 0.75rem;
}

/* Used for buttons in modal footer */
.flex-1 {
  flex: 1;
}

/* --- Delete Modal Specifics --- */
.modal-content-delete {
  max-width: 24rem; /* max-w-sm */
  padding: 2rem;
}

.modal-title-delete {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-body-delete {
  color: #4b5563;
  text-align: center;
  margin-bottom: 1.5rem;
}
.modal-body-delete strong {
  color: #111827; /* text-gray-900 */
}

.modal-footer-delete {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

/* --- Notification Toast --- */
.notification-toast {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 50;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  min-width: 250px;
  max-width: 90vw;
}
.notification-toast.success {
  background-color: #10b981; /* bg-green-500 */
}
.notification-toast.error {
  background-color: #ef4444; /* bg-red-500 */
}

.notification-close-btn {
  margin-left: 1rem;
  background: none;
  border: none;
  color: white;
  opacity: 0.7;
  cursor: pointer;
  padding: 0;
  line-height: 0;
}
.notification-close-btn:hover {
  opacity: 1;
}
`;

// --- Helper component to inject styles ---
const EmbeddedStyles = () => {
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = cssStyles;
    document.head.appendChild(styleTag);
    
    // Cleanup function to remove styles when component unmounts
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component doesn't render anything visible
};

// --- Helper function to reset the form state ---
const getInitialFormState = () => ({
  productName: '',
  description: '',
  price: '',
  brand: '',
  discount: '',
  imageFile: null,
  imageUrl: '', // Keep track of the current image URL for updates
});

// --- SVG Icons ---
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="btn-loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
    <path fill="currentColor" style={{ opacity: 0.75 }} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);


function AddProduct() {
  // --- States for the View List ---
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // --- State for Notifications ---
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success', // 'success' or 'error'
  });

  // --- States for the Form (Add/Edit) ---
  const [formState, setFormState] = useState(getInitialFormState());
  const [editingItemKey, setEditingItemKey] = useState(null); // If this is set, we are in "edit" mode
  const [loadingForm, setLoadingForm] = useState(false);
  const formRef = useRef(null); // Ref for the form element

  // --- State for Delete Confirmation Modal ---
  const [deleteModal, setDeleteModal] = useState({ show: false, item: null });

  // --- Notification Helper ---
  /**
   * Shows a notification message for 3 seconds.
   * @param {string} message The message to display.
   * @param {string} type 'success' (green) or 'error' (red).
   */
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((n) => ({ ...n, show: false }));
    }, 3000); // Hide after 3 seconds
  };

  // --- 1. READ: Fetch all items from Firebase (Real-time) ---
  useEffect(() => {
    setLoadingList(true);
    try {
      // Use the 'products' path from your original code
      const productsRef = dbRef(database, 'products');

      const unsubscribe = onValue(
        productsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const loadedProducts = Object.keys(data).map((key) => ({
              id: key, // The Firebase key is our ID
              ...data[key],
            }));
            setProducts(loadedProducts);
          } else {
            setProducts([]);
          }
          setLoadingList(false);
        },
        (error) => {
          console.error('Firebase read error:', error);
          showNotification('Failed to load product items.', 'error');
          setLoadingList(false);
        }
      );

      return () => unsubscribe(); // Cleanup listener on unmount
    } catch (error) {
        console.error("Failed to initialize Firebase listener. Is firebase.js configured correctly?", error);
        showNotification('Firebase is not configured. Please check console.', 'error');
        setLoadingList(false);
    }
  }, []);

  // --- Form input change handler ---
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormState((prev) => ({ ...prev, imageFile: files[0] || null }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- 2. CREATE / UPDATE: Handle form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { productName, description, price, brand, imageFile, discount } = formState;

    if (!productName || !description || !price || !brand || (!imageFile && !editingItemKey)) {
      showNotification('Please fill all fields. Image is required for new items.', 'error');
      return;
    }

    setLoadingForm(true);

    try {
       // Check if Firebase is available
       if (!database || !storage) {
           throw new Error("Firebase is not initialized. Check firebase.js");
       }
       
      if (editingItemKey) {
        // --- UPDATE logic ---
        let newImageUrl = formState.imageUrl; // Keep old image by default

        if (imageFile) {
          // Use the 'images/' path from your original code
          const newImageRef = storageRef(storage, `images/${editingItemKey}_${imageFile.name}`);
          await uploadBytes(newImageRef, imageFile);
          newImageUrl = await getDownloadURL(newImageRef);

          if (formState.imageUrl) {
            try {
              // Try to delete the old image.
              const oldImageRef = storageRef(storage, formState.imageUrl);
              await deleteObject(oldImageRef);
            } catch (deleteError) {
              console.warn("Could not delete old image, it might not exist or path is wrong:", deleteError);
            }
          }
        }

        // Use the 'products/' path
        await update(dbRef(database, `products/${editingItemKey}`), {
          name: productName,
          description: description,
          price: parseFloat(price),
          brand: brand,
          discount: parseFloat(discount) || 0,
          imageUrl: newImageUrl,
        });
        showNotification('Item updated successfully!', 'success');

      } else {
        // --- CREATE logic ---
        // Use the 'products/' path
        const productsRef = dbRef(database, 'products');
        const lastProductQuery = query(productsRef, orderByKey(), limitToLast(1));
        const snapshot = await get(lastProductQuery);

        // Use the start key '2131230958' from your original code
        let nextKey = 2131230958; 
        if (snapshot.exists()) {
          const lastKey = Object.keys(snapshot.val())[0];
          nextKey = parseInt(lastKey, 10) + 1;
        }

        // Use the 'images/' path
        const imageRef = storageRef(storage, `images/${nextKey}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);

        // Use the 'products/' path
        await set(dbRef(database, `products/${nextKey}`), {
          name: productName,
          description: description,
          price: parseFloat(price),
          brand: brand,
          discount: parseFloat(discount) || 0,
          imageUrl: imageUrl,
        });
        showNotification('Item added successfully!', 'success');
      }

      cancelEdit(); // Reset form

    } catch (err) {
      console.error('Error submitting form:', err);
      showNotification(err.message || 'Failed to save item.', 'error');
    } finally {
      setLoadingForm(false);
    }
  };
  
  // --- 3. DELETE: Functions to show/hide modal and confirm deletion ---
  
  const showDeleteModal = (item) => {
    setDeleteModal({ show: true, item: item });
  };
  
  const hideDeleteModal = () => {
    setDeleteModal({ show: false, item: null });
  };

  const confirmDelete = async () => {
    const item = deleteModal.item;
    if (!item) return;

    try {
      // Check if Firebase is available
       if (!database || !storage) {
           throw new Error("Firebase is not initialized. Check firebase.js");
       }
       
      if (item.imageUrl) {
        try {
          // This logic robustly extracts the path from the URL
          const imagePath = decodeURIComponent(item.imageUrl.split('/o/')[1].split('?')[0]);
          // Check if the path includes our 'images' folder
          if (imagePath.startsWith('images/')) {
             const imageRef = storageRef(storage, imagePath);
             await deleteObject(imageRef);
             console.log("Image deleted successfully");
          } else {
             console.warn("Image path not in expected 'images/' folder. Skipping delete.");
          }
        } catch (imgErr) {
          console.warn(`Could not delete image from storage: ${imgErr.message}. This might be ok if the path was not found or URL format was unexpected.`);
        }
      }

      // Delete the database entry from 'products/' path
      await remove(dbRef(database, `products/${item.id}`));
      showNotification('Item deleted from database.', 'success');

    } catch (err) {
      console.error('Error deleting item:', err);
      showNotification(err.message || 'Failed to delete item.', 'error');
    } finally {
      hideDeleteModal(); // Close the modal
    }
  };

  // --- Helper to set form into "Edit" mode ---
  const startEdit = (item) => {
    setEditingItemKey(item.id);
    setFormState({
      productName: item.name,
      description: item.description,
      price: item.price,
      brand: item.brand,
      discount: item.discount || '',
      imageFile: null,
      imageUrl: item.imageUrl, // Store old image URL
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Helper to cancel "Edit" mode and clear form ---
  const cancelEdit = () => {
    setEditingItemKey(null);
    setFormState(getInitialFormState());
    if (formRef.current) {
      formRef.current.reset(); // Visually clear file input
    }
  };

  // --- Render logic for the item list ---
  const renderList = () => {
    if (loadingList) {
      return <div className="loading-text">Loading items...</div>;
    }
    if (products.length === 0) {
      return <div className="empty-text">No product items found.</div>;
    }

    return (
      <div className="product-grid">
        {products.map((item) => {
          const finalPrice = (item.price || 0) * (1 - (item.discount || 0) / 100);
          return (
            <div className="product-card" key={item.id}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="product-card-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x300/e9ecef/6c757d?text=Image+Error';
                }}
              />
              <div className="product-card-body">
                <h5 className="product-card-title">{item.name}</h5>
                <h6 className="product-card-brand">{item.brand}</h6>
                <p className="product-card-desc">
                  {item.description}
                </p>

                <div className="product-card-price-section">
                  <p className="product-card-final-price">${finalPrice.toFixed(2)}</p>
                  {(item.discount || 0) > 0 && (
                    <div className="product-card-discount-section">
                      <p className="product-card-original-price">${(item.price || 0).toFixed(2)}</p>
                      <span className="product-card-discount-badge">
                        {item.discount}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="product-card-actions">
                  <button
                    onClick={() => startEdit(item)}
                    className="btn btn-warning"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => showDeleteModal(item)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // --- Main Component Render ---
  return (
    <div className="product-admin-container">
      {/* Inject styles into the document head */}
      <EmbeddedStyles /> 
      
      {/* --- Notification Popup --- */}
      {notification.show && (
        <div 
          className={`notification-toast ${notification.type === 'success' ? 'success' : 'error'}`}
          role="alert"
        >
          {notification.message}
          <button
            type="button"
            className="notification-close-btn"
            onClick={() => setNotification({ ...notification, show: false })}
            aria-label="Close"
          >
           <CloseIcon />
          </button>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {deleteModal.show && (
        <div className="modal-backdrop" onClick={hideDeleteModal}>
          <div className="modal-content modal-content-delete" onClick={(e) => e.stopPropagation()}>
             <h3 className="modal-title-delete">Confirm Deletion</h3>
             <p className="modal-body-delete">
                Are you sure you want to delete "<strong>{deleteModal.item?.name || 'this item'}</strong>"?
                This action cannot be undone.
             </p>
             <div className="modal-footer-delete">
                <button type="button" className="btn btn-secondary" onClick={hideDeleteModal}>
                    Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                    Delete
                </button>
             </div>
          </div>
        </div>
      )}

      <div className="main-content-wrapper">
        {/* --- Card 1: Add/Edit Form --- */}
        <div className="card-container">
          <h2 className="card-title">
            {editingItemKey ? 'Edit Product Item' : 'Add Product Item'}
          </h2>
          <form id="product-form" ref={formRef} onSubmit={handleSubmit} className="form-space-y">
            
            <div className="form-grid-cols-2">
              <input
                className="form-input"
                type="text"
                placeholder="Product Name"
                name="productName"
                value={formState.productName}
                onChange={handleFormChange}
                required
              />
              <input
                className="form-input"
                type="text"
                placeholder="Brand"
                name="brand"
                value={formState.brand}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-grid-cols-2">
              <input
                className="form-input"
                type="number"
                placeholder="Price"
                name="price"
                value={formState.price}
                onChange={handleFormChange}
                required
                min="0"
                step="0.01"
              />
              <input
                className="form-input"
                type="number"
                placeholder="Discount (%)"
                name="discount"
                value={formState.discount}
                onChange={handleFormChange}
                min="0"
                max="100"
              />
            </div>

            <textarea
              className="form-textarea"
              placeholder="Description"
              name="description"
              value={formState.description}
              onChange={handleFormChange}
              required
            ></textarea>

            <div>
              <label htmlFor="formFile" className="form-label">
                {editingItemKey ? 'Upload new image (optional)' : 'Product Image'}
              </label>
              <input
                className="form-file-input"
                type="file"
                name="imageFile"
                id="formFile"
                accept="image/*"
                onChange={handleFormChange}
                required={!editingItemKey} // Only required when creating new
              />
            </div>
            
            {editingItemKey && formState.imageUrl && (
              <div className="modal-current-image-container">
                Current image:
                <img
                  src={formState.imageUrl}
                  alt="Current"
                  className="modal-current-image"
                />
              </div>
            )}

            <div className="form-actions" style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={loadingForm}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {loadingForm ? (
                  <>
                    <LoaderIcon />
                    Saving...
                  </>
                ) : (editingItemKey ? 'Update Item' : 'Add Item')}
              </button>
              {editingItemKey && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={loadingForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- Card 2: View Products --- */}
        <div className="card-container">
          <h2 className="card-title">
            Created Product Items
          </h2>
          {renderList()}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;

