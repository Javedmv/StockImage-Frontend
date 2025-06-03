import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../constant";

const Profile = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Replace with actual user state or props
  const user = {
    username: "javed",
    email: "javedmv777@gmail.com",
  };

  const handlePasswordUpdate = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/update-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        alert(response.data.message || "Password updated successfully.");
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setOldPassword("");
      setNewPassword("");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">My Profile</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={user.username}
            readOnly
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handlePasswordUpdate}
          className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold py-2 rounded-xl transition duration-200"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
