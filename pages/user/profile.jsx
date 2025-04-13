import { useState } from "react";
import { useAuth } from "../../src/context/AuthContext";
import UserProfile from "../../components/settings/user/UserProfile";
import { Spin } from "antd";

const Profile = () => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spin size="large" className="mave-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            Profile Settings
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
        <UserProfile />
      </div>
    </div>
  );
};

export default Profile;
