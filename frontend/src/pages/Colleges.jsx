import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const Colleges = () => {
  const { t } = useLanguage()
  const [colleges, setColleges] = useState([])
  const [filteredColleges, setFilteredColleges] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    district: '',
    type: '',
    stream: '',
    facilities: []
  })
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [sortBy, setSortBy] = useState('name')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [compareList, setCompareList] = useState([])

  // Mock data for J&K colleges
  const mockColleges = [
    {
      id: 1,
      name: 'University of Kashmir',
      district: 'Srinagar',
      type: 'University',
      established: 1948,
      naacGrade: 'A',
      image: '/api/placeholder/400/250',
      logo: '/api/placeholder/100/100',
      streams: ['Science', 'Arts', 'Commerce', 'Engineering', 'Medicine'],
      courses: ['B.A.', 'B.Sc.', 'B.Com', 'B.Tech', 'MBBS', 'M.A.', 'M.Sc.', 'Ph.D'],
      facilities: ['Library', 'Hostels', 'Labs', 'Sports', 'Medical', 'WiFi'],
      fees: { undergraduate: '15000-50000', postgraduate: '25000-75000' },
      admissions: {
        lastCutoff: { science: '85%', arts: '75%', commerce: '80%' },
        totalSeats: 5000,
        process: 'Merit + Entrance'
      },
      contact: {
        phone: '+91-194-2272096',
        email: 'info@kashmiruniversity.ac.in',
        website: 'www.kashmiruniversity.ac.in',
        address: 'Hazratbal, Srinagar, J&K 190006'
      },
      coordinates: [34.1269, 74.8422],
      rating: 4.2,
      highlights: ['Oldest University in J&K', 'NAAC A Grade', 'Central University Status'],
      notable_alumni: ['Dr. Farooq Abdullah', 'Mehbooba Mufti']
    },
    {
      id: 2,
      name: 'University of Jammu',
      district: 'Jammu',
      type: 'University',
      established: 1969,
      naacGrade: 'A',
      image: '/api/placeholder/400/250',
      logo: '/api/placeholder/100/100',
      streams: ['Science', 'Arts', 'Commerce', 'Engineering', 'Law'],
      courses: ['B.A.', 'B.Sc.', 'B.Com', 'B.Tech', 'LLB', 'M.A.', 'M.Sc.', 'Ph.D'],
      facilities: ['Library', 'Hostels', 'Labs', 'Sports', 'Medical', 'WiFi', 'Auditorium'],
      fees: { undergraduate: '12000-45000', postgraduate: '20000-70000' },
      admissions: {
        lastCutoff: { science: '82%', arts: '72%', commerce: '78%' },
        totalSeats: 4500,
        process: 'Merit Based'
      },
      contact: {
        phone: '+91-191-2454000',
        email: 'info@jammuuniversity.ac.in',
        website: 'www.jammuuniversity.ac.in',
        address: 'Baba Saheb Ambedkar Road, Jammu, J&K 180006'
      },
      coordinates: [32.7266, 74.8570],
      rating: 4.0,
      highlights: ['Premier University of Jammu Region', 'NAAC A Grade', 'Research Excellence'],
      notable_alumni: ['Ghulam Nabi Azad', 'Kavinder Gupta']
    },
    {
      id: 3,
      name: 'NIT Srinagar',
      district: 'Srinagar',
      type: 'Engineering Institute',
      established: 1960,
      naacGrade: 'A+',
      image: '/api/placeholder/400/250',
      logo: '/api/placeholder/100/100',
      streams: ['Engineering', 'Technology'],
      courses: ['B.Tech', 'M.Tech', 'Ph.D'],
      facilities: ['Library', 'Hostels', 'Labs', 'Sports', 'Medical', 'WiFi', 'Research Centers'],
      fees: { undergraduate: '150000-200000', postgraduate: '100000-150000' },
      admissions: {
        lastCutoff: { engineering: 'JEE Main Rank 15000-25000' },
        totalSeats: 800,
        process: 'JEE Main + JoSAA'
      },
      contact: {
        phone: '+91-194-2496244',
        email: 'registrar@nitsri.net',
        website: 'www.nitsri.net',
        address: 'Hazratbal, Srinagar, J&K 190006'
      },
      coordinates: [34.1258, 74.8421],
      rating: 4.5,
      highlights: ['National Institute of Technology', 'Institute of National Importance', 'Top Engineering College'],
      notable_alumni: ['Tech Industry Leaders', 'IAS/IES Officers']
    },
    {
      id: 4,
      name: 'Government Medical College Srinagar',
      district: 'Srinagar',
      type: 'Medical College',
      established: 1959,
      naacGrade: 'A',
      image: '/api/placeholder/400/250',
      logo: '/api/placeholder/100/100',
      streams: ['Medicine', 'Dental', 'Nursing'],
      courses: ['MBBS', 'BDS', 'B.Sc Nursing', 'MD', 'MS', 'MDS'],
      facilities: ['Hospital', 'Labs', 'Library', 'Hostels', 'Research Centers'],
      fees: { undergraduate: '25000-100000', postgraduate: '50000-150000' },
      admissions: {
        lastCutoff: { medicine: 'NEET Rank 1000-5000 (UT Quota)' },
        totalSeats: 150,
        process: 'NEET + Counseling'
      },
      contact: {
        phone: '+91-194-2503204',
        email: 'gmcsrinagar@jk.gov.in',
        website: 'www.gmcsrinagar.edu.in',
        address: 'Karan Nagar, Srinagar, J&K 190010'
      },
      coordinates: [34.0911, 74.8065],
      rating: 4.3,
      highlights: ['Premier Medical College', 'Attached to SMHS Hospital', 'MCI Recognized'],
      notable_alumni: ['Leading Doctors', 'Medical Researchers']
    },
    {
      id: 5,
      name: 'Government College for Women MA Road',
      district: 'Srinagar',
      type: 'Government College',
      established: 1950,
      naacGrade: 'B+',
      image: '/api/placeholder/400/250',
      logo: '/api/placeholder/100/100',
      streams: ['Arts', 'Science', 'Commerce'],
      courses: ['B.A.', 'B.Sc.', 'B.Com', 'M.A.', 'M.Sc.', 'M.Com'],
      facilities: ['Library', 'Labs', 'Computer Center', 'Canteen'],
      fees: { undergraduate: '5000-15000', postgraduate: '8000-20000' },
      admissions: {
        lastCutoff: { science: '78%', arts: '65%', commerce: '70%' },
        totalSeats: 1200,
        process: 'Merit Based'
      },
      contact: {
        phone: '+91-194-2478901',
        email: 'gcwmaroad@gmail.com',
        website: 'www.gcwmaroad.edu.in',
        address: 'MA Road, Srinagar, J&K 190001'
      },
      coordinates: [34.0837, 74.7973],
      rating: 3.8,
      highlights: ['Leading Women\'s College', 'Affordable Education', 'Strong Alumni Network'],
      notable_alumni: ['Women Leaders', 'Government Officers']
    },
    {
      id: 6,
      name: 'Islamic University of Science & Technology',
      district: 'Pulwama',
      type: 'Private University',
      established: 2005,
      naacGrade: 'A',
      image: '/api/placeholder/400/250',
      logo: '/api/placeholder/100/100',
      streams: ['Engineering', 'Medicine', 'Management', 'Sciences'],
      courses: ['B.Tech', 'MBBS', 'MBA', 'B.Sc.', 'M.Tech', 'MD'],
      facilities: ['Library', 'Hostels', 'Labs', 'Sports', 'Medical', 'WiFi', 'Mosque'],
      fees: { undergraduate: '80000-400000', postgraduate: '100000-500000' },
      admissions: {
        lastCutoff: { engineering: 'JEE Main + IUST Entrance', medicine: 'NEET' },
        totalSeats: 2000,
        process: 'Entrance + Merit'
      },
      contact: {
        phone: '+91-194-2420052',
        email: 'info@islamicuniversity.edu.in',
        website: 'www.islamicuniversity.edu.in',
        address: 'Awantipora, Pulwama, J&K 192122'
      },
      coordinates: [33.9178, 74.9289],
      rating: 4.1,
      highlights: ['Modern Campus', 'Research Focused', 'Industry Partnerships'],
      notable_alumni: ['Tech Entrepreneurs', 'Medical Professionals']
    }
  ]

  const districts = ['All', 'Srinagar', 'Jammu', 'Pulwama', 'Anantnag', 'Baramulla', 'Budgam', 'Kupwara', 'Bandipora']
  const collegeTypes = ['All', 'University', 'Engineering Institute', 'Medical College', 'Government College', 'Private University']
  const streams = ['All', 'Science', 'Arts', 'Commerce', 'Engineering', 'Medicine', 'Law', 'Management']
  const facilitiesOptions = ['Library', 'Hostels', 'Labs', 'Sports', 'Medical', 'WiFi', 'Auditorium', 'Research Centers']

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setColleges(mockColleges)
      setFilteredColleges(mockColleges)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = colleges.filter(college => {
      const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           college.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesDistrict = !selectedFilters.district || selectedFilters.district === 'All' || 
                             college.district === selectedFilters.district

      const matchesType = !selectedFilters.type || selectedFilters.type === 'All' || 
                         college.type === selectedFilters.type

      const matchesStream = !selectedFilters.stream || selectedFilters.stream === 'All' || 
                           college.streams.includes(selectedFilters.stream)

      const matchesFacilities = selectedFilters.facilities.length === 0 || 
                               selectedFilters.facilities.every(facility => 
                                 college.facilities.includes(facility))

      return matchesSearch && matchesDistrict && matchesType && matchesStream && matchesFacilities
    })

    // Sort colleges
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'established') {
      filtered.sort((a, b) => b.established - a.established)
    }

    setFilteredColleges(filtered)
  }, [colleges, searchTerm, selectedFilters, sortBy])

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'facilities') {
      setSelectedFilters(prev => ({
        ...prev,
        facilities: prev.facilities.includes(value)
          ? prev.facilities.filter(f => f !== value)
          : [...prev.facilities, value]
      }))
    } else {
      setSelectedFilters(prev => ({ ...prev, [filterType]: value }))
    }
  }

  const addToCompare = (college) => {
    if (compareList.length < 3 && !compareList.find(c => c.id === college.id)) {
      setCompareList([...compareList, college])
    }
  }

  const removeFromCompare = (collegeId) => {
    setCompareList(compareList.filter(c => c.id !== collegeId))
  }

  const clearFilters = () => {
    setSelectedFilters({
      district: '',
      type: '',
      stream: '',
      facilities: []
    })
    setSearchTerm('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass p-6 rounded-xl">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="heading-2 text-gradient mb-4">J&K College Directory</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Explore {colleges.length}+ colleges and universities across Jammu & Kashmir
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong p-6 rounded-xl mb-8"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search colleges, courses, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <select
              value={selectedFilters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select District</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>

            <select
              value={selectedFilters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">College Type</option>
              {collegeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={selectedFilters.stream}
              onChange={(e) => handleFilterChange('stream', e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Stream</option>
              {streams.map(stream => (
                <option key={stream} value={stream}>{stream}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="established">Sort by Year</option>
            </select>
          </div>

          {/* Facilities Filter */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Required Facilities:</h4>
            <div className="flex flex-wrap gap-2">
              {facilitiesOptions.map(facility => (
                <button
                  key={facility}
                  onClick={() => handleFilterChange('facilities', facility)}
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                    selectedFilters.facilities.includes(facility)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/20'
                  }`}
                >
                  {facility}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredColleges.length} of {colleges.length} colleges
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
              
              <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong p-4 rounded-xl mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Compare Colleges ({compareList.length}/3):</span>
                <div className="flex gap-2">
                  {compareList.map(college => (
                    <div key={college.id} className="flex items-center bg-primary-100 dark:bg-primary-900/20 px-3 py-1 rounded-full text-sm">
                      <span>{college.name}</span>
                      <button
                        onClick={() => removeFromCompare(college.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedCollege('compare')}
                className="btn-primary text-sm"
                disabled={compareList.length < 2}
              >
                Compare Now
              </button>
            </div>
          </motion.div>
        )}

        {/* Colleges Grid/List */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          <AnimatePresence>
            {filteredColleges.map((college, index) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`card-hover ${viewMode === 'list' ? 'flex gap-6' : ''}`}
              >
                <div className={`${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                  <div className="relative">
                    <img
                      src={college.image}
                      alt={college.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-sm font-semibold">
                      ⭐ {college.rating}
                    </div>
                    <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs">
                      {college.naacGrade}
                    </div>
                  </div>
                </div>

                <div className={`${viewMode === 'list' ? 'flex-1' : 'mt-4'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {college.name}
                    </h3>
                    <button
                      onClick={() => addToCompare(college)}
                      disabled={compareList.length >= 3 || compareList.find(c => c.id === college.id)}
                      className="text-sm text-primary-600 hover:text-primary-800 disabled:text-gray-400"
                    >
                      + Compare
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 dark:text-gray-400 flex items-center">
                      📍 {college.district} • {college.type} • Est. {college.established}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {college.streams.slice(0, 3).map(stream => (
                        <span
                          key={stream}
                          className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 text-xs rounded-full"
                        >
                          {stream}
                        </span>
                      ))}
                      {college.streams.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{college.streams.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {college.facilities.slice(0, 4).map(facility => (
                        <span
                          key={facility}
                          className="px-2 py-1 bg-accent-100 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 text-xs rounded-full"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      💰 Fees: ₹{college.fees.undergraduate}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCollege(college)}
                      className="btn-primary text-sm flex-1"
                    >
                      View Details
                    </button>
                    <button className="btn-secondary text-sm">
                      📞 Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredColleges.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* College Detail Modal */}
      <AnimatePresence>
        {selectedCollege && selectedCollege !== 'compare' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedCollege(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedCollege.image}
                  alt={selectedCollege.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
                <button
                  onClick={() => setSelectedCollege(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gradient mb-2">
                      {selectedCollege.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedCollege.district} • Est. {selectedCollege.established} • NAAC {selectedCollege.naacGrade}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      ⭐ {selectedCollege.rating}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Academic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Streams Offered:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCollege.streams.map(stream => (
                            <span key={stream} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                              {stream}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Courses:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCollege.courses.map(course => (
                            <span key={course} className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 rounded-full text-sm">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Fees Structure:</h4>
                        <p className="text-sm">Undergraduate: ₹{selectedCollege.fees.undergraduate}</p>
                        <p className="text-sm">Postgraduate: ₹{selectedCollege.fees.postgraduate}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Facilities & Infrastructure</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCollege.facilities.map(facility => (
                        <div key={facility} className="flex items-center text-sm">
                          <span className="text-green-500 mr-2">✓</span>
                          {facility}
                        </div>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold mb-4 mt-6">Admissions</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Total Seats:</strong> {selectedCollege.admissions.totalSeats}</p>
                      <p><strong>Process:</strong> {selectedCollege.admissions.process}</p>
                      {selectedCollege.admissions.lastCutoff && (
                        <div>
                          <strong>Last Year Cutoffs:</strong>
                          <ul className="ml-4 mt-1">
                            {Object.entries(selectedCollege.admissions.lastCutoff).map(([stream, cutoff]) => (
                              <li key={stream}>{stream}: {cutoff}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Address:</strong> {selectedCollege.contact.address}</p>
                      <p><strong>Phone:</strong> {selectedCollege.contact.phone}</p>
                    </div>
                    <div>
                      <p><strong>Email:</strong> {selectedCollege.contact.email}</p>
                      <p><strong>Website:</strong> {selectedCollege.contact.website}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button className="btn-primary flex-1">Apply Now</button>
                  <button className="btn-secondary">Download Brochure</button>
                  <button className="btn-accent">Save for Later</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {selectedCollege === 'compare' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedCollege(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gradient">Compare Colleges</h2>
                  <button
                    onClick={() => setSelectedCollege(null)}
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-2 pr-4 font-semibold">Criteria</th>
                        {compareList.map(college => (
                          <th key={college.id} className="text-center py-2 px-4 font-semibold min-w-[200px]">
                            {college.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3 pr-4 font-medium">Location</td>
                        {compareList.map(college => (
                          <td key={college.id} className="py-3 px-4 text-center">{college.district}</td>
                        ))}
                      </tr>
                      <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3 pr-4 font-medium">Established</td>
                        {compareList.map(college => (
                          <td key={college.id} className="py-3 px-4 text-center">{college.established}</td>
                        ))}
                      </tr>
                      <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3 pr-4 font-medium">NAAC Grade</td>
                        {compareList.map(college => (
                          <td key={college.id} className="py-3 px-4 text-center">{college.naacGrade}</td>
                        ))}
                      </tr>
                      <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3 pr-4 font-medium">Rating</td>
                        {compareList.map(college => (
                          <td key={college.id} className="py-3 px-4 text-center">⭐ {college.rating}</td>
                        ))}
                      </tr>
                      <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3 pr-4 font-medium">UG Fees</td>
                        {compareList.map(college => (
                          <td key={college.id} className="py-3 px-4 text-center">₹{college.fees.undergraduate}</td>
                        ))}
                      </tr>
                      <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3 pr-4 font-medium">Total Seats</td>
                        {compareList.map(college => (
                          <td key={college.id} className="py-3 px-4 text-center">{college.admissions.totalSeats}</td>
                        ))}
                      </tr>
                      <tr className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3 pr-4 font-medium">Streams</td>
                        {compareList.map(college => (
                          <td key={college.id} className="py-3 px-4 text-center">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {college.streams.slice(0, 3).map(stream => (
                                <span key={stream} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs">
                                  {stream}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Colleges
