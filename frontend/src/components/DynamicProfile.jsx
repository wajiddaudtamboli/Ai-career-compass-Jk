import React from 'react';
import { motion } from 'framer-motion';

const DynamicProfile = () => {
  // Mock user data for demo purposes
  const user = {
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@example.com',
    createdAt: new Date().toISOString(),
    imageUrl: null
  };

  // Profile display
  return (
    <div className="min-h-screen pt-8 px-4 pb-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient">
            👤 Profile Information
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-strong p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold mb-6">📋 Profile Overview</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-600">Basic Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
                  <p className="text-lg font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-lg">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</label>
                  <p className="text-lg">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary-600">Account Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Status</label>
                  <p className="text-lg font-medium text-green-600">Active</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Profile Image</label>
                  <div className="flex items-center space-x-3 mt-2">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl">
                        {user.firstName?.charAt(0) || '👤'}
                      </div>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Guest profile
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 This is a demo profile. Sign up to save your preferences and track your career journey!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DynamicProfile;
