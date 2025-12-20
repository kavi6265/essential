import { useEffect, useState } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { database } from "./firebase";
import "../css/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = ref(database, "products");

    onValue(productsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const productList = Object.entries(data).map(([id, product]) => ({
        id,
        ...product,
        // Ensure smallImages is at least an empty array to avoid map errors
        smallImages: product.smallImages || ["", "", "", ""],
      }));
      setProducts(productList);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await remove(ref(database, `products/${id}`));
        alert("✅ Product deleted successfully!");
      } catch (err) {
        alert("❌ Error deleting product: " + err.message);
      }
    }
  };

  return (
    <div className="products-container">
      <h2>All Products</h2>
      {loading ? (
        <p>Loading products…</p>
      ) : products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="product-list">
          {products.map(({ id, name, description, price, imageUrl, smallImages }) => (
            <div className="product-card" key={id}>
              {/* Main Product Image */}
              <div className="image-section">
                <img
                  src={imageUrl || "/default-product.png"}
                  alt={name || "No Name"}
                  className="product-img-main"
                />
                
                {/* FOUR SMALL IMAGES SECTION */}
                <div className="small-images-container">
                  {smallImages.map((url, index) => (
                    <div key={index} className="small-img-wrapper">
                      <img 
                        src={url || "/default-placeholder.png"} 
                        alt={`View ${index + 1}`} 
                        className="small-img"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="product-info">
                <h3>{name}</h3>
                <p className="product-desc">{description}</p>
                <p className="product-price">₹{price}</p>
                <button className="delete-btn" onClick={() => handleDelete(id)}>
                  <i className="bx bx-trash"></i> Delete Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;