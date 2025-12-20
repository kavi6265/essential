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
} from 'firebase/database';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { database, storage } from './firebase.js';

// --- CSS STYLES ---
const cssStyles = `
.product-admin-container { background-color: #f3f4f6; min-height: 100vh; padding: 1.5rem; font-family: 'Segoe UI', sans-serif; }
.main-content-wrapper { max-width: 1200px; margin: 0 auto; }

.card-container { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 2rem; }
.card-title { margin: 0 0 20px 0; color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; font-size: 1.5rem; }

.form-space-y { display: flex; flex-direction: column; gap: 15px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.form-input, .form-textarea { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
.form-textarea { height: 100px; resize: vertical; }

.image-section-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px dashed #d1d5db; }
.small-images-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.preview-thumb { width: 100%; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd; margin-top: 5px; background: #eee; }
.label-sm { font-size: 12px; font-weight: bold; color: #6b7280; display: block; margin-bottom: 5px; }

.discount-card { background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; }
.price-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px; }
.total-row { border-top: 1px solid #bbf7d0; margin-top: 8px; padding-top: 8px; font-weight: bold; color: #166534; font-size: 16px; }

.btn-group { display: flex; gap: 10px; margin-top: 10px; }
.btn { padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; flex: 1; text-align: center; }
.btn-save { background: #2563eb; color: white; }
.btn-cancel { background: #9ca3af; color: white; }
.btn-delete { background: #ef4444; color: white; padding: 5px 10px; font-size: 12px; }

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.product-card { background: white; border-radius: 10px; overflow: hidden; border: 1px solid #eee; transition: transform 0.2s; display: flex; flex-direction: column; }
.product-card:hover { transform: translateY(-5px); }
.main-card-img { width: 100%; height: 180px; object-fit: cover; }
.gallery-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; background: #f3f4f6; padding: 4px; }
.gallery-img { width: 100%; height: 40px; object-fit: cover; background: #ddd; }
.card-info { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; }

.price-container { display: flex; align-items: baseline; gap: 8px; margin-top: auto; flex-wrap: wrap; }
.price-main { color: #2563eb; font-size: 1.4rem; font-weight: 800; }
.price-original { text-decoration: line-through; color: #9ca3af; font-size: 0.9rem; }
.discount-badge { background: #dcfce7; color: #166534; font-size: 0.75rem; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
`;

const getInitialState = () => ({
  name: '',
  description: '',
  price: '',
  brand: '',
  discount: '',
  mainFile: null,
  mainUrl: '',
  smallFiles: [null, null, null, null],
  smallUrls: ['', '', '', ''],
});

function ElectronicProduct() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(getInitialState());
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  // 1. Load Products
  useEffect(() => {
    const productsRef = dbRef(database, 'ELECTRONIC');
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setProducts(list);
      } else {
        setProducts([]);
      }
    });
  }, []);

  // 2. Handle Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleMainFile = (e) => {
    if (e.target.files[0]) {
      setForm(prev => ({ ...prev, mainFile: e.target.files[0] }));
    }
  };

  const handleSmallFile = (index, file) => {
    const newFiles = [...form.smallFiles];
    newFiles[index] = file;
    setForm(prev => ({ ...prev, smallFiles: newFiles }));
  };

  // 3. Upload Logic
  const uploadImage = async (file, path) => {
    if (!file) return null;
    const storageReference = storageRef(storage, path);
    await uploadBytes(storageReference, file);
    return await getDownloadURL(storageReference);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let productId = editId;
      
      if (!productId) {
        const lastQuery = query(dbRef(database, 'ELECTRONIC'), orderByKey(), limitToLast(1));
        const snapshot = await get(lastQuery);
        let lastId = 3131230958;
        if (snapshot.exists()) {
          lastId = parseInt(Object.keys(snapshot.val())[0]);
        }
        productId = lastId + 1;
      }

      let finalMainUrl = form.mainUrl;
      if (form.mainFile) {
        finalMainUrl = await uploadImage(form.mainFile, `products/${productId}/main`);
      }

      const finalSmallUrls = [...form.smallUrls];
      for (let i = 0; i < 4; i++) {
        if (form.smallFiles[i]) {
          finalSmallUrls[i] = await uploadImage(form.smallFiles[i], `products/${productId}/small_${i}`);
        }
      }

      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        brand: form.brand,
        discount: parseFloat(form.discount || 0),
        imageUrl: finalMainUrl,
        smallImages: finalSmallUrls.filter(url => url !== '')
      };

      await set(dbRef(database, `ELECTRONIC/${productId}`), productData);
      
      alert(editId ? "Product Updated!" : "Product Added!");
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(getInitialState());
    setEditId(null);
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await remove(dbRef(database, `ELECTRONIC/${id}`));
    }
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      brand: p.brand,
      discount: p.discount || '',
      mainUrl: p.imageUrl,
      smallUrls: p.smallImages || ['', '', '', ''],
      mainFile: null,
      smallFiles: [null, null, null, null]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const calculateFinalPrice = () => {
    const p = parseFloat(form.price) || 0;
    const d = parseFloat(form.discount) || 0;
    return (p - (p * d) / 100).toFixed(0);
  };

  return (
    <div className="product-admin-container">
      <style>{cssStyles}</style>
      <div className="main-content-wrapper">
        
        {/* FORM CARD */}
        <div className="card-container">
          <h2 className="card-title">{editId ? 'Edit Product' : 'Add New Electronic Item'}</h2>
          <form onSubmit={handleSubmit} className="form-space-y">
            
            <div className="form-grid">
              <input type="text" name="name" placeholder="Product Name" value={form.name} onChange={handleInputChange} className="form-input" required />
              <input type="text" name="brand" placeholder="Brand Name" value={form.brand} onChange={handleInputChange} className="form-input" required />
            </div>

            <textarea name="description" placeholder="Product Description" value={form.description} onChange={handleInputChange} className="form-textarea" required />

            <div className="form-grid">
              <input type="number" name="price" placeholder="Base Price (₹)" value={form.price} onChange={handleInputChange} className="form-input" required />
              <input type="number" name="discount" placeholder="Discount (%)" value={form.discount} onChange={handleInputChange} className="form-input" />
            </div>

            {/* IMAGE SECTION */}
            <div className="image-section-grid">
              <div>
                <label className="label-sm">Main Display Image</label>
                <input type="file" onChange={handleMainFile} accept="image/*" />
                <img src={form.mainFile ? URL.createObjectURL(form.mainFile) : (form.mainUrl || 'https://via.placeholder.com/150')} className="preview-thumb" alt="Main" />
              </div>
              <div>
                <label className="label-sm">Gallery Images (Up to 4)</label>
                <div className="small-images-grid">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i}>
                      <input type="file" onChange={(e) => handleSmallFile(i, e.target.files[0])} style={{fontSize: '10px', width: '100%'}} />
                      <img src={form.smallFiles[i] ? URL.createObjectURL(form.smallFiles[i]) : (form.smallUrls[i] || 'https://via.placeholder.com/60')} className="preview-thumb" alt={`Thumb ${i}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PRICE PREVIEW */}
            <div className="discount-card">
              <div className="price-row"><span>Original Price:</span><span>₹{form.price || 0}</span></div>
              <div className="price-row"><span>Discount:</span><span>-{form.discount || 0}%</span></div>
              <div className="total-row"><span>Final Selling Price:</span><span>₹{calculateFinalPrice()}</span></div>
            </div>

            <div className="btn-group">
              <button type="submit" className="btn btn-save" disabled={loading}>
                {loading ? 'Processing...' : (editId ? 'Update Product' : 'Save Product')}
              </button>
              {editId && <button type="button" onClick={resetForm} className="btn btn-cancel">Cancel</button>}
            </div>
          </form>
        </div>

        {/* LIST GRID */}
        <h2 className="card-title">Live Inventory</h2>
        <div className="product-grid">
          {products.map(p => {
            const hasDiscount = p.discount > 0;
            const finalPrice = (p.price * (1 - (p.discount || 0) / 100)).toFixed(0);

            return (
              <div className="product-card" key={p.id}>
                <img src={p.imageUrl} className="main-card-img" alt={p.name} />
                <div className="gallery-strip">
                  {(p.smallImages || ['', '', '', '']).map((img, i) => (
                    <img key={i} src={img || 'https://via.placeholder.com/40'} className="gallery-img" alt="gallery" />
                  ))}
                </div>
                <div className="card-info">
                  <div style={{fontWeight: 'bold', fontSize: '12px', color: '#6b7280'}}>{p.brand}</div>
                  <div style={{color: '#1f2937', marginBottom: '10px', fontWeight: '500'}}>{p.name}</div>
                  
                  <div className="price-container">
                    <span className="price-main">₹{finalPrice}</span>
                    {hasDiscount && (
                      <>
                        <span className="price-original">₹{p.price}</span>
                        <span className="discount-badge">{p.discount}% OFF</span>
                      </>
                    )}
                  </div>

                  <div className="btn-group" style={{marginTop: '15px'}}>
                    <button onClick={() => startEdit(p)} className="btn" style={{background: '#f3f4f6', color: '#374151'}}>Edit</button>
                    <button onClick={() => deleteProduct(p.id)} className="btn btn-delete">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ElectronicProduct;