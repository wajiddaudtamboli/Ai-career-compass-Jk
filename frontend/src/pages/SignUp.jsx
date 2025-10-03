import React from 'react'
import { SignUp } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto h-20 w-20 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mb-6"
          >
            <img 
              src="https://www.idreameducation.org/wp-content/uploads/2023/09/jk-board-logo.png"
              alt="J&K Board Logo"
              className="h-12 w-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="text-2xl text-white hidden">🎓</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join AI Career Compass J&K
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create your account to start your personalized career journey
          </p>
        </div>

        <div className="flex justify-center">
          <SignUp 
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: 
                  'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white',
                card: 'bg-white dark:bg-gray-800 shadow-xl',
                headerTitle: 'text-gray-900 dark:text-white',
                headerSubtitle: 'text-gray-600 dark:text-gray-400',
                socialButtonsBlockButton: 
                  'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
                formFieldLabel: 'text-gray-700 dark:text-gray-300',
                formFieldInput: 
                  'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500',
                footerActionLink: 'text-primary-600 hover:text-primary-500'
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default SignUpPage