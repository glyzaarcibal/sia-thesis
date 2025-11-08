import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you would typically dispatch an action to update the user profile
    // dispatch(updateUserProfile(formData));

    Swal.fire({
      title: "Success!",
      text: "Profile updated successfully",
      icon: "success",
      confirmButtonColor: "#0cdfc6",
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="w-full bg-gradient-to-r from-cyan-500 to-teal-400 h-48"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 sm:p-8 relative">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <img
                  src="/api/placeholder/150/150"
                  alt="Profile"
                  className="rounded-full h-32 w-32 object-cover border-4 border-white shadow-md"
                />
                {!isEditing && (
                  <button
                    className="absolute bottom-0 right-0 bg-gray-100 p-2 rounded-full text-gray-500 hover:text-gray-700"
                    onClick={() => {}}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-500">@{user.name}</p>
                {!isEditing && (
                  <div className="mt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="border-t border-gray-200 p-6 sm:p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-teal-400 focus:border-teal-400 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-teal-400 focus:border-teal-400 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-teal-400 focus:border-teal-400 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Profile Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Personal details and account information.
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Username
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user.email || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Full name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user.firstName} {user.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Account type
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {user.isAdmin ? "Administrator" : "User"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Account Security
                  </h3>
                  <div className="mt-4 flex">
                    <button
                      className="text-sm text-teal-600 hover:text-teal-500 font-medium"
                      onClick={() => {}}
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Activity Section */}
          <div className="border-t border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-4">
              <div className="flex items-center py-3">
                <div className="bg-teal-100 rounded-full p-2 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-teal-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Last login at 10:30 AM today
                  </p>
                  <p className="text-sm text-gray-500">IP: 192.168.1.1</p>
                </div>
              </div>

              <div className="flex items-center py-3 border-t border-gray-100">
                <div className="bg-teal-100 rounded-full p-2 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-teal-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Profile updated
                  </p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
