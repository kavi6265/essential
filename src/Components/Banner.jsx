import React, { useState, useEffect } from 'react';
import { storage, database } from './firebase'; 
import { ref as sRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref as dRef, onValue, push, set, remove } from "firebase/database";

const Banner = () => {
    const [banners, setBanners] = useState({});
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // 1. READ: Fetch banners on load
    useEffect(() => {
        const bannerRef = dRef(database, 'banners');
        onValue(bannerRef, (snapshot) => {
            setBanners(snapshot.val() || {});
        });
    }, []);

    // 2. CREATE: Upload new image only
    const handleUpload = async () => {
        if (!file) return alert("Please select an image first");
        setLoading(true);
        try {
            const fileName = `${Date.now()}_${file.name}`;
            const storagePath = sRef(storage, `banners/${fileName}`);
            
            // Upload to Storage
            const snapshot = await uploadBytes(storagePath, file);
            const url = await getDownloadURL(snapshot.ref);

            // Save only URL and fileName to Database
            const newBannerRef = push(dRef(database, 'banners'));
            await set(newBannerRef, { url, fileName });
            
            setFile(null);
        } catch (error) { 
            console.error("Upload failed:", error); 
        }
        setLoading(false);
    };

    // 3. DELETE: Remove from Storage AND Database
    const handleDelete = async (id, fileName) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await deleteObject(sRef(storage, `banners/${fileName}`));
            await remove(dRef(database, `banners/${id}`));
        } catch (error) { 
            console.error("Delete failed:", error); 
            // Cleanup DB if file is already gone from storage
            await remove(dRef(database, `banners/${id}`));
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Banner Management</h2>
            
            {/* Create Section */}
            <div style={{ maxWidth: '400px', margin: '0 auto 40px auto', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    style={{ marginBottom: '15px', width: '100%' }} 
                />
                <button 
                    onClick={handleUpload} 
                    disabled={loading || !file}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: file ? '#007bff' : '#1e71f5ff', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? "Uploading..." : "Add New Banner"}
                </button>
            </div>

            {/* List Section: Card View */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px', padding: '0 20px' }}>
                {Object.entries(banners).map(([id, data]) => (
                    <div key={id} style={{ background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                        <div style={{ padding: '10px' }}>
                            <img 
                                src={data.url} 
                                alt="banner" 
                                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} 
                            />
                        </div>
                        
                        <div style={{ padding: '15px', paddingTop: '0' }}>
                            <p style={{ color: '#888', fontSize: '12px', marginBottom: '15px' }}>Uploaded Banner</p>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', backgroundColor: '#f1f3f5', color: '#333', fontWeight: '600', cursor: 'not-allowed' }}
                                    disabled
                                >
                                    No Title
                                </button>
                                <button 
                                    onClick={() => handleDelete(id, data.fileName)} 
                                    style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', backgroundColor: '#ff4d4f', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Banner;