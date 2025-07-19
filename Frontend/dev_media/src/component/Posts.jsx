import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const loggedInUsername = localStorage.getItem("username"); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) throw new Error("No access token found. Please log in.");

        const response = await axios.get("http://127.0.0.1:8000/home/posts/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please log in.");
      } finally {
        setLoading(false);
      }
    };
    console.log(loggedInUsername)

    fetchPosts();
  }, []);

  const toggleLike = async (postId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        alert("Please log in to like posts.");
        return;
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/home/post/${postId}/like/`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_liked: !post.is_liked,
                like_count: post.is_liked ? post.like_count - 1 : post.like_count + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 mt-16">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500 font-medium mt-16">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Posts
        </h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-gray-100">
          <p className="text-gray-500 text-lg">No posts available.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.author.username || "Author"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {post.author.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div>
                <button
                  onClick={() =>
                    post.author.username === loggedInUsername
                      ? navigate("/profile") // Redirect to own profile page
                      : navigate(`/userprofile/${post.author.username}`) // Redirect to other's profile
                  }
                  className="text-gray-900 hover:text-gray-500 font-semibold"
                >
                  {post.author.username || "Unknown Author"}
                </button>
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
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleString()}
                </p>

                <button onClick={() => toggleLike(post.id)}>
                  <FaHeart
                    className={`text-2xl transition-all duration-300 cursor-pointer ${
                      post.is_liked ? "text-red-500" : "text-black"
                    }`}
                  />
                </button>

                <span className="text-gray-600 text-sm">{post.like_count} Likes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
