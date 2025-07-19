import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    profile_picture: null,
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch the current user profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/profiles/update/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setFormData({
          username: response.data.username,
          email: response.data.email,
          bio: response.data.bio,
          profile_picture: null, // Leave null for now; upload separately
        });
        setLoading(false);
      } catch (error) {
        setErrorMessage("Failed to load profile data.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("bio", formData.bio);
    if (formData.profile_picture) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/profiles/update/",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Profile</h1>
        {successMessage && (
          <div className="text-green-600 text-center mb-4">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-red-600 text-center mb-4">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username:
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio:
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              placeholder="Write your bio here..."
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="profile_picture"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profile Picture (optional):
            </label>
            <input
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
