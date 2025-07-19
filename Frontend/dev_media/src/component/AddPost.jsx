import React, { useState } from "react";
import axios from "axios";

const AddPost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/home/posts/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setMessage("Post added successfully!");
        setError("");
        setContent("");
        setImage(null);
      } else {
        throw new Error("Failed to add the post.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add the post.");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-gray-50 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Add New Post
        </h1>
        {message && (
          <div className="text-green-600 text-center mb-4">{message}</div>
        )}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              placeholder="Write your post content here..."
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Image (optional):
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Add Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
