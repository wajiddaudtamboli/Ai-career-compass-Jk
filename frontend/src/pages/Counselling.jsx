import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

const Counselling = () => {
  const { isDarkMode } = useTheme()
  const [activeStream, setActiveStream] = useState('science')
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [consultationType, setConsultationType] = useState('')

  // Stream data with YouTube videos and career information
  const streamData = {
    science: {
      title: 'Science Stream',
      icon: '🔬',
      description: 'Explore careers in research, medicine, engineering, and technology',
      careers: [
        'Medical Doctor', 'Engineer', 'Research Scientist', 'Pharmacist', 
        'Data Scientist', 'Biotechnologist', 'Environmental Scientist'
      ],
      videos: [
        {
          title: 'Career Options After 12th Science - Complete Guide',
          url: 'https://www.youtube.com/embed/2UUGrEa7vDc',
          description: 'Comprehensive overview of all science stream career options including medical, engineering, research, and emerging fields'
        },
        {
          title: 'Medical vs Engineering - Career Comparison 2024',
          url: 'https://www.youtube.com/embed/Xy6woc1TKHA',
          description: 'Detailed comparison covering salary, job prospects, entrance exams, and career growth in medical and engineering fields'
        },
        {
          title: 'Science Stream Subject Selection Guide',
          url: 'https://www.youtube.com/embed/De0Jr59IHQY',
          description: 'How to choose between PCM and PCB, subject combinations, and their impact on career choices'
        },
        {
          title: 'NEET vs JEE Preparation Strategy',
          url: 'https://www.youtube.com/embed/mHfIfA4msiE',
          description: 'Complete preparation guide for medical and engineering entrance exams with study tips and strategies'
        },
        {
          title: 'Emerging Careers in Science & Technology',
          url: 'https://www.youtube.com/embed/Qf5lPOnhDXI',
          description: 'Latest career opportunities in biotechnology, data science, AI, space technology, and environmental science'
        },
        {
          title: 'Science Research Careers in India',
          url: 'https://www.youtube.com/embed/DSgGkAhLIqQ',
          description: 'Research opportunities, PhD programs, CSIR-NET, and career paths in scientific research'
        }
      ],
      subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
      exams: ['JEE Main/Advanced', 'NEET UG', 'GATE', 'JAM', 'NET/SET']
    },
    commerce: {
      title: 'Commerce Stream',
      icon: '💼',
      description: 'Build careers in business, finance, and entrepreneurship',
      careers: [
        'Chartered Accountant', 'Investment Banker', 'Business Analyst', 
        'Marketing Manager', 'Entrepreneur', 'Financial Advisor', 'HR Manager'
      ],
      videos: [
        {
          title: 'Career Options After 12th Commerce - Complete Guide',
          url: 'https://www.youtube.com/embed/qYs-mfaCOL4',
          description: 'Complete guide to commerce careers including CA, CS, banking, finance, and business management opportunities'
        },
        {
          title: 'CA vs MBA vs CS - Which Career is Best?',
          url: 'https://www.youtube.com/embed/anC6fpmJtR4',
          description: 'Detailed comparison of Chartered Accountancy, MBA, and Company Secretary courses with salary and growth prospects'
        },
        {
          title: 'Banking & Finance Careers in India',
          url: 'https://www.youtube.com/embed/NJ1R2aaHUMY',
          description: 'Career opportunities in banking sector, government bank jobs, private banking, and financial services'
        },
        {
          title: 'Digital Marketing & E-commerce Careers',
          url: 'https://www.youtube.com/embed/0LzSmT3I0ag',
          description: 'Modern commerce careers in digital marketing, social media marketing, e-commerce, and online business'
        },
        {
          title: 'Commerce Subject Selection Guide',
          url: 'https://www.youtube.com/embed/rqGXLPLUnCc',
          description: 'How to choose subjects in commerce stream and their impact on future career options'
        },
        {
          title: 'Entrepreneurship After Commerce',
          url: 'https://www.youtube.com/embed/sIblKiT6q38',
          description: 'Starting your own business, startup opportunities, and entrepreneurial skills for commerce students'
        }
      ],
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'],
      exams: ['CA Foundation', 'CS Foundation', 'CLAT', 'BBA Entrance', 'Hotel Management']
    },
    arts: {
      title: 'Arts/Humanities Stream',
      icon: '🎨',
      description: 'Creative and analytical careers in humanities and social sciences',
      careers: [
        'Civil Services Officer', 'Journalist', 'Lawyer', 'Psychologist', 
        'Social Worker', 'Teacher', 'Content Writer', 'Historian'
      ],
      videos: [
        {
          title: 'CUET 2024: Best Subject Combination for Arts Students',
          url: 'https://www.youtube.com/embed/PyXVv6lb1H4',
          description: 'Complete guide to CUET subject combinations for arts students with entrance exam strategies'
        },
        {
          title: 'CUET 2025: Best Subject Combination for Humanities Students',
          url: 'https://www.youtube.com/embed/zra_2Rb-61Q',
          description: 'Updated CUET 2025 strategies for humanities students with subject selection guidance'
        },
        {
          title: 'The PERFECT Subject COMBINATION in CUET 2025 for ARTS',
          url: 'https://www.youtube.com/embed/fB2qYsj9eaU',
          description: 'Strategic approach to choosing the perfect subject combination for CUET 2025 arts entrance'
        },
        {
          title: 'Confused About Humanities Optional Subjects',
          url: 'https://www.youtube.com/embed/4YpVET_V7Fs',
          description: 'Guidance on selecting optional subjects in humanities stream for better career prospects'
        },
        {
          title: 'CUET 2025: Best Subject Combinations & Top 7 Universities',
          url: 'https://www.youtube.com/embed/UFPSV-hv-MM',
          description: 'Complete guide to top universities accepting CUET scores and best subject combinations'
        },
        {
          title: 'Top 5 Subject Combinations for Class 11 to Boost Your Career',
          url: 'https://www.youtube.com/embed/91jfjlbrTSo',
          description: 'Strategic subject selection in Class 11 to maximize career opportunities and university admissions'
        }
      ],
      subjects: ['History', 'Political Science', 'Psychology', 'Sociology', 'Literature'],
      exams: ['UPSC CSE', 'CLAT', 'CUET', 'DUET', 'JMI Entrance']
    },
    vocational: {
      title: 'Vocational/Technical',
      icon: '🛠️',
      description: 'Skill-based careers with immediate employment opportunities',
      careers: [
        'Software Developer', 'Graphic Designer', 'Digital Marketer', 
        'Chef', 'Fashion Designer', 'Interior Designer', 'Photographer'
      ],
      videos: [
        {
          title: 'Vocational Courses After 12th - High Demand Skills',
          url: 'https://www.youtube.com/embed/-tkebrPxtLw',
          description: 'Popular vocational courses including IT, digital marketing, hospitality, fashion design, and technical skills'
        },
        {
          title: 'Skill Development vs Traditional Degree',
          url: 'https://www.youtube.com/embed/9YLVkeQbnFQ?si=IY9QcpF5L6p6etjw',
          description: 'Comparing skill-based courses with traditional degrees - employment prospects and earning potential'
        },
        {
          title: 'Digital Skills for Future Jobs 2024',
          url: 'https://www.youtube.com/embed/nXpBHLB6sb8',
          description: 'Essential digital skills including coding, data analysis, digital marketing, and AI tools for modern careers'
        },
        {
          title: 'ITI Courses & Technical Careers',
          url: 'https://www.youtube.com/embed/gv1NPwXnGME',
          description: 'Industrial Training Institute courses, apprenticeships, and technical career opportunities'
        },
        {
          title: 'Creative & Design Careers Guide',
          url: 'https://www.youtube.com/embed/vkSOIkNWCww',
          description: 'Careers in graphic design, web design, fashion design, interior design, and creative arts'
        },
        {
          title: 'Entrepreneurship & Startup Skills',
          url: 'https://www.youtube.com/embed/QpeonTasIxc',
          description: 'Building entrepreneurial skills, startup opportunities, and self-employment options for young professionals'
        }
      ],
      subjects: ['Computer Applications', 'Graphic Design', 'Digital Marketing', 'Hospitality'],
      exams: ['Various Industry Certifications', 'Skill Tests', 'Portfolio Assessments']
    }
  }

  const consultationOptions = [
    {
      type: 'video',
      title: 'Video Consultation',
      icon: '📹',
      description: 'Face-to-face guidance via video call',
      duration: '45 minutes',
      price: 'Free for J&K Students'
    },
    {
      type: 'audio',
      title: 'Audio Consultation',
      icon: '📞',
      description: 'Voice call consultation',
      duration: '30 minutes',
      price: 'Free for J&K Students'
    },
    {
      type: 'chat',
      title: 'Chat Consultation',
      icon: '💬',
      description: 'Text-based career guidance',
      duration: 'Flexible',
      price: 'Free for J&K Students'
    }
  ]

  const contactDetails = {
    phone: '+91 9667033839',
    email: 'wajiddaudtamboli123@gmail.com',
    whatsapp: '+91 9667033839',
    address: 'N.K. Orchid College of Engineering and Technology, Solapur',
    hours: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM'
  }

  const bookConsultation = (type) => {
    setConsultationType(type)
    setIsContactModalOpen(true)
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 px-4 pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-premium mb-6">
            Career Counselling & Guidance
          </h1>
          <p className="text-lg md:text-xl text-subtitle-yellow max-w-3xl mx-auto">
            Get personalized career guidance from our expert counsellors. Choose your stream 
            and explore career opportunities with video resources and professional consultation.
          </p>
        </motion.div>

        {/* Consultation Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {consultationOptions.map((option, index) => (
            <div key={index} className="glass p-6 rounded-xl text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">{option.icon}</div>
              <h3 className="text-xl font-bold text-adaptive mb-3">{option.title}</h3>
              <p className="text-adaptive-muted mb-4">{option.description}</p>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-adaptive-secondary">Duration: {option.duration}</p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">{option.price}</p>
              </div>
              <button 
                onClick={() => bookConsultation(option.type)}
                className="btn-primary w-full"
              >
                Book {option.title}
              </button>
            </div>
          ))}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-xl mb-12"
        >
          <h2 className="text-2xl font-bold text-adaptive mb-6 text-center">Contact Our Counselling Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-semibold text-adaptive mb-2">Phone</h3>
              <a href={`tel:${contactDetails.phone}`} className="text-primary-600 hover:text-primary-700">
                {contactDetails.phone}
              </a>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📧</div>
              <h3 className="font-semibold text-adaptive mb-2">Email</h3>
              <a href={`mailto:${contactDetails.email}`} className="text-primary-600 hover:text-primary-700 break-all">
                {contactDetails.email}
              </a>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-adaptive mb-2">WhatsApp</h3>
              <a href={`https://wa.me/${contactDetails.whatsapp.replace('+', '')}`} className="text-primary-600 hover:text-primary-700">
                {contactDetails.whatsapp}
              </a>
            </div>
            <div className="text-center md:col-span-2 lg:col-span-1">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold text-adaptive mb-2">Address</h3>
              <p className="text-adaptive-muted text-sm">{contactDetails.address}</p>
            </div>
            <div className="text-center md:col-span-2 lg:col-span-2">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-semibold text-adaptive mb-2">Hours</h3>
              <p className="text-adaptive-muted text-sm">{contactDetails.hours}</p>
            </div>
          </div>
        </motion.div>

        {/* Stream Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-adaptive text-center mb-8">
            Choose Your Stream for Specialized Guidance
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {Object.entries(streamData).map(([key, stream]) => (
              <button
                key={key}
                onClick={() => setActiveStream(key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeStream === key
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'glass text-adaptive hover:scale-105'
                }`}
              >
                <span className="mr-2">{stream.icon}</span>
                {stream.title}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stream Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStream}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Stream Overview */}
            <div className="glass p-8 rounded-xl">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{streamData[activeStream].icon}</div>
                <h2 className="text-3xl font-bold text-adaptive mb-4">{streamData[activeStream].title}</h2>
                <p className="text-lg text-adaptive-secondary max-w-3xl mx-auto">
                  {streamData[activeStream].description}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Career Options */}
                <div>
                  <h3 className="text-xl font-bold text-adaptive mb-4">💼 Career Options</h3>
                  <ul className="space-y-2">
                    {streamData[activeStream].careers.map((career, index) => (
                      <li key={index} className="flex items-center text-adaptive-muted">
                        <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Subjects */}
                <div>
                  <h3 className="text-xl font-bold text-adaptive mb-4">📚 Key Subjects</h3>
                  <ul className="space-y-2">
                    {streamData[activeStream].subjects.map((subject, index) => (
                      <li key={index} className="flex items-center text-adaptive-muted">
                        <span className="w-2 h-2 bg-secondary-600 rounded-full mr-3"></span>
                        {subject}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important Exams */}
                <div>
                  <h3 className="text-xl font-bold text-adaptive mb-4">🎯 Important Exams</h3>
                  <ul className="space-y-2">
                    {streamData[activeStream].exams.map((exam, index) => (
                      <li key={index} className="flex items-center text-adaptive-muted">
                        <span className="w-2 h-2 bg-accent-600 rounded-full mr-3"></span>
                        {exam}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* YouTube Videos */}
            <div className="glass p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-adaptive mb-2 text-center">
                📺 Educational Videos for {streamData[activeStream].title}
              </h2>
              <p className="text-adaptive-muted text-center mb-8">
                Watch these comprehensive videos to understand career opportunities, exam preparation, and subject selection
              </p>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {streamData[activeStream].videos.map((video, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
                  >
                    <div className="aspect-video relative group">
                      <iframe
                        src={video.url}
                        title={video.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-adaptive mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-adaptive-muted line-clamp-3">{video.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-primary-600 font-medium">🎥 Career Guide</span>
                        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                          Watch Full Video →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Additional Info */}
              <div className="mt-8 text-center">
                <div className="glass-light p-4 rounded-lg">
                  <p className="text-sm text-adaptive-muted mb-2">
                    💡 <strong>Pro Tip:</strong> Watch multiple videos to get different perspectives on your chosen stream
                  </p>
                  <p className="text-xs text-adaptive-muted">
                    These videos are curated to provide authentic career guidance from education experts and industry professionals
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="glass p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-adaptive mb-4">
              Ready to Start Your Career Journey?
            </h2>
            <p className="text-adaptive-muted mb-6">
              Book a free consultation with our expert counsellors and get personalized guidance for your future.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => bookConsultation('video')}
                className="btn-primary"
              >
                Book Video Consultation
              </button>
              <button 
                onClick={() => bookConsultation('audio')}
                className="btn-secondary"
              >
                Book Audio Consultation
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsContactModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-6 rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-adaptive mb-4">
                Book {consultationType.charAt(0).toUpperCase() + consultationType.slice(1)} Consultation
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-adaptive mb-2">Name</label>
                  <input type="text" className="input-field w-full" placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-adaptive mb-2">Phone</label>
                  <input type="tel" className="input-field w-full" placeholder="Your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-adaptive mb-2">Stream</label>
                  <select className="input-field w-full">
                    <option value="">Select your stream</option>
                    <option value="science">Science</option>
                    <option value="commerce">Commerce</option>
                    <option value="arts">Arts/Humanities</option>
                    <option value="vocational">Vocational/Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-adaptive mb-2">Preferred Time</label>
                  <input type="datetime-local" className="input-field w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-adaptive mb-2">Questions/Topics</label>
                  <textarea 
                    className="input-field w-full h-20" 
                    placeholder="What would you like to discuss?"
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setIsContactModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button className="btn-primary flex-1">
                  Book Consultation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Counselling
