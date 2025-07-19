import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MyPosts from "./MyPost";

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          throw new Error("No access token found. Please log in.");
        }

        const response = await axios.get("http://127.0.0.1:8000/profiles/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setProfiles(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch profiles. Please log in.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchProfiles();
  }, []);

  const handleEditProfile = (profileId) => {
    navigate("/edit/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-yellow-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-xl shadow-md p-6 mb-8">
            {/* Profile Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Picture */}
              <div className="w-32 h-32 flex-shrink-0">
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt={`${profile.username}'s profile`}
                    className="w-full h-full rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 text-white text-4xl font-bold rounded-full">
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
                  <button
                    onClick={() => handleEditProfile(profile.id)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-600 mt-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    <span>{profile.email || "No email provided"}</span>
                  </div>                  
                  {profile.bio && (
                    <div className="col-span-2 flex items-start space-x-2">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            <div className="mt-8">
              <MyPosts />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
