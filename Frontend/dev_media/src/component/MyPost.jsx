import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDeletePost = async (postId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:8000/home/myposts/deletepost/${postId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setPosts(posts.filter(post => post.id !== postId)); 
    } catch (err) {
      setError("Failed to delete post");
    }
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/home/myposts/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* My Posts Header and Add Post Button */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          My Posts
        </h1>
        <a
  href="/addpost"
  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-gray-700 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
>
  <div className="w-6 h-6 bg-gray-700 bg-opacity-20 rounded-full flex items-center justify-center mr-3">
    <svg
      className="w-4 h-4 text-gray-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4v16m8-8H4"
      />
    </svg>
  </div>
  <span>Add Post</span>
</a>

      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-lg">No posts found. Start sharing your thoughts!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {post.author.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{post.author.username || "Unknown Author"}</h2>
                </div>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>

              {post.image && (
                <div className="mb-4 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                {/* Date */}
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </p>

                {/* Delete Button */}
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors duration-300 flex items-center gap-2 border border-red-200 hover:border-red-300"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;