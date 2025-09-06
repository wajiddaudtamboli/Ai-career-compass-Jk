import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { apiService } from '../services/api'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapPinIcon, 
  CurrencyRupeeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const CareersPage = () => {
  const { translations, language } = useLanguage()
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedEducation, setSelectedEducation] = useState('')
  const [aiRecommendations, setAiRecommendations] = useState('')

  const categories = [
    'Technology',
    'Healthcare', 
    'Tourism & Hospitality',
    'Agriculture',
    'Government',
    'Education',
    'Media',
    'Creative'
  ]

  const locations = [
    'Srinagar',
    'Jammu', 
    'Leh',
    'Gulmarg',
    'Pahalgam',
    'Throughout J&K'
  ]

  const educationLevels = [
    'Any Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'MBBS + MD/MS',
    'Bachelor\'s Degree + B.Ed',
    'PhD'
  ]

  useEffect(() => {
    fetchCareers()
    getAIRecommendations()
  }, [])

  useEffect(() => {
    const filtered = { 
      category: selectedCategory,
      location: selectedLocation,
      education_level: selectedEducation
    }
    Object.keys(filtered).forEach(key => {
      if (!filtered[key]) delete filtered[key]
    })
    
    fetchCareers(filtered)
  }, [selectedCategory, selectedLocation, selectedEducation])

  const fetchCareers = async (filters = {}) => {
    try {
      setLoading(true)
      const response = await apiService.getCareers(filters)
      setCareers(response.data || [])
    } catch (error) {
      console.error('Error fetching careers:', error)
      setCareers([])
    } finally {
      setLoading(false)
    }
  }

  const getAIRecommendations = async () => {
    try {
      const response = await apiService.chat(
        'What are the top 3 emerging career opportunities in Jammu & Kashmir for young professionals?',
        'career trends J&K'
      )
      setAiRecommendations(response.data.response)
    } catch (error) {
      console.error('Error getting AI recommendations:', error)
    }
  }

  const filteredCareers = careers.filter(career =>
    career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive'
    const formatNumber = (num) => {
      if (num >= 100000) return `${(num / 100000).toFixed(1)}L`
      return `${(num / 1000)}K`
    }
    return `₹${formatNumber(min)} - ${formatNumber(max)}`
  }

  return (
    <div className="min-h-screen pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            {language === 'hi' ? 'करियर अवसर' : 'Career Opportunities'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {language === 'hi' 
              ? 'जम्मू और कश्मीर में उपलब्ध विभिन्न करियर विकल्पों की खोज करें' 
              : 'Explore diverse career opportunities available in Jammu & Kashmir'
            }
          </p>
        </motion.div>

        {/* AI Recommendations */}
        {aiRecommendations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 glass p-6 rounded-xl border border-primary-200/20 dark:border-primary-700/20"
          >
            <div className="flex items-center space-x-2 mb-4">
              <SparklesIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {language === 'hi' ? 'AI सुझाव' : 'AI Recommendations'}
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {aiRecommendations}
            </p>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'करियर खोजें...' : 'Search careers...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass rounded-xl border border-gray-200/50 dark:border-gray-700/50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'hi' ? 'श्रेणी' : 'Category'}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass rounded-lg border border-gray-200/50 dark:border-gray-700/50 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">{language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'hi' ? 'स्थान' : 'Location'}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="glass rounded-lg border border-gray-200/50 dark:border-gray-700/50 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">{language === 'hi' ? 'सभी स्थान' : 'All Locations'}</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'hi' ? 'शिक्षा स्तर' : 'Education Level'}
              </label>
              <select
                value={selectedEducation}
                onChange={(e) => setSelectedEducation(e.target.value)}
                className="glass rounded-lg border border-gray-200/50 dark:border-gray-700/50 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">{language === 'hi' ? 'सभी स्तर' : 'All Levels'}</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'hi' 
              ? `${filteredCareers.length} करियर विकल्प मिले`
              : `Found ${filteredCareers.length} career opportunities`
            }
          </p>
        </motion.div>

        {/* Career Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="glass p-6 rounded-xl animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredCareers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {language === 'hi' ? 'कोई करियर नहीं मिला' : 'No careers found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'hi' 
                ? 'अलग फिल्टर का उपयोग करके देखें'
                : 'Try adjusting your search filters'
              }
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group cursor-pointer"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 mb-4">
                    {career.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {career.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {career.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {career.location && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {career.location}
                      </div>
                    )}
                    
                    {career.education_level && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <AcademicCapIcon className="h-4 w-4 mr-2" />
                        {career.education_level}
                      </div>
                    )}

                    {(career.salary_range_min || career.salary_range_max) && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <CurrencyRupeeIcon className="h-4 w-4 mr-2" />
                        {formatSalary(career.salary_range_min, career.salary_range_max)}
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {career.skills_required && career.skills_required.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {career.skills_required.slice(0, 3).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {career.skills_required.length > 3 && (
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                            +{career.skills_required.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Learn More */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                      {language === 'hi' ? 'और जानें' : 'Learn More'}
                    </span>
                    <ChevronRightIcon className="h-4 w-4 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CareersPage
