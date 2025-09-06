import React from 'react'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <footer className="w-full py-6 sm:py-8 md:py-12 mt-12 sm:mt-16 md:mt-20 bg-gray-900 text-white">
      <div className="container-responsive">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section - Responsive */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gradient">
              AI Career Compass J&K
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Empowering students of Jammu & Kashmir with personalized career guidance and educational opportunities.
            </p>
          </div>

          {/* Quick Links - Responsive */}
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-300">
              <li><a href="/colleges" className="text-xs sm:text-sm hover:text-accent-500 transition-colors">🏛️ Colleges</a></li>
              <li><a href="/careers" className="text-xs sm:text-sm hover:text-accent-500 transition-colors">💼 Careers</a></li>
              <li><a href="/quiz" className="text-xs sm:text-sm hover:text-accent-500 transition-colors">📝 Aptitude Test</a></li>
              <li><a href="/dashboard" className="text-xs sm:text-sm hover:text-accent-500 transition-colors">📊 Dashboard</a></li>
            </ul>
          </div>

          {/* Resources - Responsive */}
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Resources</h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-300">
              <li><a href="#" className="text-xs sm:text-sm hover:text-accent-500 transition-colors">📚 Study Materials</a></li>
              <li><a href="#" className="text-xs sm:text-sm hover:text-accent-500 transition-colors">🎓 Scholarship Info</a></li>
              <li><a href="#" className="text-xs sm:text-sm hover:text-accent-500 transition-colors">📅 Exam Schedules</a></li>
              <li><a href="#" className="text-xs sm:text-sm hover:text-accent-500 transition-colors">🎯 Career Counseling</a></li>
            </ul>
          </div>

          {/* Contact - Responsive */}
          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Contact</h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-300">
              <li className="text-xs sm:text-sm">
                <a href="mailto:wajiddaudtamboli123@gmail.com" className="hover:text-accent-500 transition-colors">
                  📧 wajiddaudtamboli123@gmail.com
                </a>
              </li>
              <li className="text-xs sm:text-sm">
                <a href="tel:+919667033839" className="hover:text-accent-500 transition-colors">
                  📞 +91 9667033839
                </a>
              </li>
              <li className="text-xs sm:text-sm">
                🏫 N.K. Orchid College, Solapur
              </li>
            </ul>
          </div>
        </div>

        {/* Developer Credit - Responsive */}
        <div className="border-t border-gray-700 pt-4 sm:pt-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="text-sm sm:text-base lg:text-lg font-semibold">
              Developer - <strong className="text-yellow-400">Wajid Daud Tamboli</strong>
            </div>
            <div className="text-xs sm:text-sm text-gray-400">
              © 2025 AI Career Compass J&K. All rights reserved.
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
