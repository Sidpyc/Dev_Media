import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Posts from "./Posts"; // Reusing the Posts component

const UserProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) throw new Error("No access token found. Please log in.");

      // Fetch the user profile
      const profileResponse = await axios.get(`http://127.0.0.1:8000/newusers/${username}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile(profileResponse.data);

      // Fetch followers count for the profile being viewed
      const followersResponse = await axios.get(`http://127.0.0.1:8000/followers/${username}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFollowersCount(followersResponse.data.count);

      // Fetch following count for the profile being viewed
      const followingResponse = await axios.get(`http://127.0.0.1:8000/following/${username}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFollowingCount(followingResponse.data.count);

      // Check if the logged-in user is following the profile
      const storedFollowState = localStorage.getItem(`followState_${username}`);
      
      // Use stored state if available, otherwise use the server response
      setIsFollowing(storedFollowState === 'true' || followingResponse.data.following.includes(username));

    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch user profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateLocalFollowState = (state) => {
    setIsFollowing(state);
    localStorage.setItem(`followState_${username}`, state ? 'true' : 'false');
  };

  const handleFollow = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) throw new Error("No access token found. Please log in.");

      await axios.post(
        `http://127.0.0.1:8000/follow/${username}/`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Optimistically update followers count
      setFollowersCount(prevCount => prevCount + 1);
      updateLocalFollowState(true);

      // Fetch updated followers count from the backend
      await fetchUserProfile();

    } catch (err) {
      console.error("Error following the user:", err);
      // Revert optimistic update if API call fails
      setFollowersCount(prevCount => prevCount - 1);
      updateLocalFollowState(false);
    }
  };

  const handleUnfollow = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) throw new Error("No access token found. Please log in.");

      await axios.post(
        `http://127.0.0.1:8000/unfollow/${username}/`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Optimistically update followers count
      setFollowersCount(prevCount => prevCount - 1);
      updateLocalFollowState(false);

      // Fetch updated followers count from the backend
      await fetchUserProfile();

    } catch (err) {
      console.error("Error unfollowing the user:", err);
      // Revert optimistic update if API call fails
      setFollowersCount(prevCount => prevCount + 1);
      updateLocalFollowState(true);
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
      <div className="bg-white rounded-2xl shadow-md p-6 text-center">
        <div className="flex justify-center">
          {profile?.profile_picture ? (
            <img
              src={profile.profile_picture}
              alt={`${profile.username}'s profile`}
              className="w-24 h-24 rounded-full border border-gray-300 object-cover"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-300 text-white font-bold text-2xl">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">{profile?.username}</h2>
        <p className="text-gray-600 mt-2">{profile?.bio || "No bio available."}</p>

        <div className="mt-4">
          {isFollowing ? (
            <button
              onClick={handleUnfollow}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            >
              Follow
            </button>
          )}
        </div>

        <div className="mt-4">
          <p className="text-gray-600">Following: {followingCount}</p>
          <p className="text-gray-600">Followers: {followersCount}</p>
        </div>
      </div>

      <h3 className="mt-8 text-xl font-semibold text-gray-800">Posts by {profile?.username}</h3>
      <Posts apiUrl={`http://127.0.0.1:8000/home/profile/${username}/posts/`} />
    </div>
  );
};

export default UserProfile;