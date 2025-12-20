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
.card-title { margin: 0 0 20px 0; color: #1f2937; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; }

.form-space-y { display: flex; flex-direction: column; gap: 15px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.form-input, .form-textarea { width: 100%; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
.form-textarea { height: 100px; resize: vertical; }

.image-section-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; background: #f9fafb; padding: 15px; border-radius: 8px; }
.small-images-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.preview-thumb { width: 100%; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd; margin-top: 5px; }

.discount-card { background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0; }
.price-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px; }
.total-row { border-top: 1px solid #bbf7d0; margin-top: 8px; padding-top: 8px; font-weight: bold; color: #166534; font-size: 16px; }

.btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; }
.btn-save { background: #2563eb; color: white; width: 100%; }
.btn-save:hover { background: #1d4ed8; }
.btn-cancel { background: #9ca3af; color: white; }

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.product-card { background: white; border-radius: 10px; overflow: hidden; border: 1px solid #eee; position: relative; display: flex; flex-direction: column; }
.main-card-img { width: 100%; height: 180px; object-fit: cover; }
.gallery-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; background: #f3f4f6; padding: 4px; }
.gallery-img { width: 100%; height: 40px; object-fit: cover; }
.card-info { padding: 15px; flex-grow: 1; }

/* NEW PRICE STYLES */
.price-tag-container { display: flex; flex-direction: column; gap: 2px; margin: 10px 0; }
.final-price { color: #2563eb; font-size: 1.3rem; font-weight: 800; }
.original-price-row { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
.old-price { text-decoration: line-through; color: #9ca3af; }
.discount-badge { color: #166534; font-weight: bold; background: #dcfce7; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; }
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

function AddProduct() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(getInitialState());
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    return onValue(dbRef(database, 'products'), (snap) => {
      const data = snap.val() || {};
      setProducts(Object.entries(data).map(([id, val]) => ({ id, ...val })));
    });
  }, []);

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    if (name === 'mainFile') setForm(p => ({ ...p, mainFile: files[0] }));
    else if (name.startsWith('small-')) {
      const idx = parseInt(name.split('-')[1]);
      const newFiles = [...form.smallFiles];
      newFiles[idx] = files[0];
      setForm(p => ({ ...p, smallFiles: newFiles }));
    } else setForm(p => ({ ...p, [name]: value }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = editId || Date.now().toString();
      
      let mainUrl = form.mainUrl;
      if (form.mainFile) {
        const ref = storageRef(storage, `products/${id}/main`);
        await uploadBytes(ref, form.mainFile);
        mainUrl = await getDownloadURL(ref);
      }

      const smallUrls = [...form.smallUrls];
      for (let i = 0; i < 4; i++) {
        if (form.smallFiles[i]) {
          const ref = storageRef(storage, `products/${id}/small_${i}`);
          await uploadBytes(ref, form.smallFiles[i]);
          smallUrls[i] = await getDownloadURL(ref);
        }
      }

      await set(dbRef(database, `products/${id}`), {
        name: form.name,
        brand: form.brand,
        price: parseFloat(form.price),
        discount: parseFloat(form.discount) || 0,
        description: form.description,
        imageUrl: mainUrl,
        smallImages: smallUrls
      });

      reset();
      alert("Product saved successfully!");
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  const reset = () => {
    setEditId(null);
    setForm(getInitialState());
    if (formRef.current) formRef.current.reset();
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      brand: p.brand,
      price: p.price,
      discount: p.discount,
      description: p.description,
      mainUrl: p.imageUrl,
      smallUrls: p.smallImages || ['', '', '', ''],
      smallFiles: [null, null, null, null],
      mainFile: null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Improved calculation function
  const calcFinalValue = (p, d) => {
    const price = parseFloat(p) || 0;
    const disc = parseFloat(d) || 0;
    return price - (price * disc) / 100;
  };

  return (
    <div className="product-admin-container">
      <style>{cssStyles}</style>
      <div className="main-content-wrapper">
        
        {/* EDIT/ADD SECTION */}
        <div className="card-container">
          <h2 className="card-title">{editId ? 'Edit Product Details' : 'Register New Product'}</h2>
          <form ref={formRef} onSubmit={saveProduct} className="form-space-y">
            <div className="form-grid">
              <input className="form-input" name="name" value={form.name} onChange={handleInput} placeholder="Product Name" required />
              <input className="form-input" name="brand" value={form.brand} onChange={handleInput} placeholder="Brand" required />
            </div>

            <div className="form-grid">
              <input className="form-input" type="number" name="price" value={form.price} onChange={handleInput} placeholder="Base Price (₹)" required />
              <input className="form-input" type="number" name="discount" value={form.discount} onChange={handleInput} placeholder="Discount %" />
            </div>

            {form.price > 0 && (
              <div className="discount-card">
                <div className="price-row"><span>List Price:</span> <span>₹{parseFloat(form.price).toLocaleString()}</span></div>
                <div className="price-row"><span>Discount:</span> <span>-{form.discount || 0}%</span></div>
                <div className="total-row"><span>Calculated Final Price:</span> <span>₹{calcFinalValue(form.price, form.discount).toLocaleString()}</span></div>
              </div>
            )}

            <textarea className="form-textarea" name="description" value={form.description} onChange={handleInput} placeholder="Product Description..." required />

            <div className="image-section-grid">
              <div>
                <label style={{fontSize: '12px', fontWeight: 'bold'}}>Main Image</label>
                <input type="file" name="mainFile" onChange={handleInput} />
                {(form.mainFile || form.mainUrl) && (
                  <img 
                    src={form.mainFile ? URL.createObjectURL(form.mainFile) : form.mainUrl} 
                    className="preview-thumb" 
                    alt="main" 
                  />
                )}
              </div>
              <div>
                <label style={{fontSize: '12px', fontWeight: 'bold'}}>Sub-Gallery (4 Images)</label>
                <div className="small-images-grid">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i}>
                      <input type="file" name={`small-${i}`} style={{fontSize: '9px', width: '100%'}} onChange={handleInput} />
                      {(form.smallFiles[i] || form.smallUrls[i]) && (
                        <img 
                          src={form.smallFiles[i] ? URL.createObjectURL(form.smallFiles[i]) : form.smallUrls[i]} 
                          className="preview-thumb" 
                          alt="sub" 
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{display: 'flex', gap: '10px'}}>
              <button type="submit" className="btn btn-save" disabled={loading}>
                {loading ? 'Saving Changes...' : editId ? 'Update Product' : 'Save Product'}
              </button>
              {editId && <button type="button" className="btn btn-cancel" onClick={reset}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* INVENTORY LIST */}
        <h3 style={{color: '#4b5563', marginBottom: '15px'}}>Current Inventory</h3>
        <div className="product-grid">
          {products.map(p => {
            const finalPrice = calcFinalValue(p.price, p.discount);
            const hasDiscount = p.discount > 0;

            return (
              <div className="product-card" key={p.id}>
                <img src={p.imageUrl || 'https://via.placeholder.com/300'} className="main-card-img" alt="product" />
                <div className="gallery-strip">
                  {(p.smallImages || ['', '', '', '']).map((img, i) => (
                    <img key={i} src={img || 'https://via.placeholder.com/80'} className="gallery-img" alt="gallery" />
                  ))}
                </div>
                <div className="card-info">
                  <div style={{fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase'}}>{p.brand}</div>
                  <div style={{fontWeight: 'bold', margin: '5px 0', fontSize: '14px', height: '40px', overflow: 'hidden'}}>{p.name}</div>
                  
                  {/* Updated Price Display Logic */}
                  <div className="price-tag-container">
                    <div className="final-price">₹{finalPrice.toLocaleString()}</div>
                    {hasDiscount && (
                      <div className="original-price-row">
                        <span className="old-price">₹{parseFloat(p.price).toLocaleString()}</span>
                        <span className="discount-badge">{p.discount}% OFF</span>
                      </div>
                    )}
                  </div>

                  <div style={{display: 'flex', gap: '5px', marginTop: '10px'}}>
                    <button className="btn" style={{background: '#f59e0b', color: 'white', flex: 1, padding: '8px'}} onClick={() => startEdit(p)}>Edit</button>
                    <button className="btn" style={{background: '#ef4444', color: 'white', flex: 1, padding: '8px'}} onClick={() => { if(window.confirm('Delete this product?')) remove(dbRef(database, `products/${p.id}`)); }}>Delete</button>
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

export default AddProduct;