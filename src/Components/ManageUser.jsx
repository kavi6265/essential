import React, { useState, useEffect } from "react";
import { database } from "./firebase"; // Make sure this path is correct
import { ref, onValue, remove } from "firebase/database";
import "../css/ManageUser.css"; // We will create this CSS file next

/**
 * A reusable component to display a table of users.
 * @param {Object} props
 * @param {string} props.title - The title for this user section (e.g., "Regular Users")
 * @param {Array} props.users - The array of user objects to display
 * @param {string} props.dbPath - The database path for these users (e.g., "users", "admins")
 */
function UserTable({ title, users, dbPath }) {
  
  const handleDelete = async (uid, name) => {
    // Confirm before deleting
    if (!window.confirm(`Are you sure you want to delete the database entry for ${name} (UID: ${uid})?
\nNOTE: This only removes them from the Realtime Database. 
It does NOT delete their Firebase Authentication account.`)) {
      return;
    }

    try {
      const userRef = ref(database, `${dbPath}/${uid}`);
      await remove(userRef);
      alert("User profile deleted from database.");
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to delete user profile.");
    }
  };

  return (
    <div className="user-table-container">
      <h2>{title} ({users.length})</h2>
      {users.length === 0 ? (
        <p>No users found in this category.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>User ID</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userid}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phno}</td>
                <td>{user.userid}</td>
                <td>{user.address || "N/A"}</td>
                <td className="actions-cell">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.userid, user.name)}
                  >
                    Delete
                  </button>
                  {/* You could add an Edit button here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/**
 * Main Admin Panel component to manage all users.
 */
function ManageUser() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [tempAdmins, setTempAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    let loadedCount = 0;
    const totalToLoad = 3;

    // Helper to turn off loading state once all 3 listeners are active
    const checkAllDataLoaded = () => {
      loadedCount++;
      if (loadedCount === totalToLoad) {
        setLoading(false);
      }
    };

    // Helper function to create a listener
    const createListener = (path, setState) => {
      const dbRef = ref(database, path);
      return onValue(
        dbRef,
        (snapshot) => {
          const dataList = [];
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              dataList.push(childSnapshot.val());
            });
          }
          setState(dataList);
          checkAllDataLoaded();
        },
        (err) => {
          console.error(`Error fetching ${path}:`, err);
          setError(`Failed to load ${path}.`);
          checkAllDataLoaded();
        }
      );
    };

    // Create listeners for all 3 user types
    const unsubscribeUsers = createListener("users", setUsers);
    const unsubscribeAdmins = createListener("admins", setAdmins);
    const unsubscribeTempAdmins = createListener("tempadmin1", setTempAdmins);

    // Cleanup function: This is crucial to prevent memory leaks
    return () => {
      unsubscribeUsers();
      unsubscribeAdmins();
      unsubscribeTempAdmins();
    };
  }, []);

  if (loading) {
    return <div className="loading-div">Loading user data...</div>;
  }

  if (error) {
    return <div className="error-div">{error}</div>;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Panel - User Management</h1>
      
      <UserTable title="Administrators" users={admins} dbPath="admins" />
      <UserTable title="Temporary Admins" users={tempAdmins} dbPath="tempadmin1" />
      <UserTable title="Regular Users" users={users} dbPath="users" />

    </div>
  );
}

export default ManageUser;