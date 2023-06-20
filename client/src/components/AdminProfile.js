import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylesheets/Admin.css";

function AdminProfile(props) {
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState({});

  const logout = () => {
    axios
      .post("http://localhost:8000/logout", {}, { withCredentials: true })
      .then((response) => {
        // Handle the response from the server
        if (response.status === 200) {
          props.refreshData();
          props.onUp(7);
        } else {
          console.error("Logout failed:", response);
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };
  useEffect(() => {
    const getAdminData = async () => {
      const response = await axios.get("http://localhost:8000/adminProfile", {
        withCredentials: true,
      });
      setAdmin(response.data.admin);
      setUsers(response.data.users);
    };

    getAdminData();
  }, []);

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`http://localhost:8000/user/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== userId));
    }
  };
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/adminProfile", {
          withCredentials: true,
        });
        if (response.data) {
          setAdmin(response.data.admin);
        }
      } catch (error) {
        setAdmin(false);
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  if (!admin) {
    return <p>Only Admins allowed</p>;
  }
  return (
    <div>
      <h1>Admin Profile</h1>
      <button onClick={logout}>Logout</button>
      <p>Member since: {new Date(admin.createdAt).toLocaleDateString()}</p>
      <p>Reputation: {admin.reputation}</p>
      <h2>Users:</h2>
      {users.length === 0 ? (
        <p>No users to display</p>
      ) : (
        users.map((user) => (
          <div key={user._id}>
            {user.username}
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminProfile;
