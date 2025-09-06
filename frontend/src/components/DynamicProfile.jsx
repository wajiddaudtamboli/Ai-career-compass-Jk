import React from 'react';
import { motion } from 'framer-motion';
import { useMockUser as useUser } from './ClerkProviderWrapper';

const DynamicProfile = () => {
  const { user } = useUser();

  // Show message if user is not signed in
  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <span className="text-white text-3xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">Profile Access Required</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to view and manage your profile.
          </p>
        </motion.div>
      </div>
    );
  }

  // Profile display using Clerk user data
  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
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
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                  <p className="text-lg">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</label>
                  <p className="text-lg">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}
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
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        👤
                      </div>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Profile managed by authentication
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DynamicProfile;
