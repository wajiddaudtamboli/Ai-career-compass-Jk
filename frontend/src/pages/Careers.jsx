import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const Careers = () => {
  const { t } = useLanguage()
  const [selectedStream, setSelectedStream] = useState('science')
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [viewMode, setViewMode] = useState('pathways') // pathways, opportunities, timeline

  const careerStreams = {
    science: {
      name: 'Science Stream',
      icon: '🔬',
      color: 'from-blue-500 to-purple-600',
      description: 'Explore careers in Science, Technology, Engineering, and Medicine',
      careers: [
        {
          id: 'medicine',
          name: 'Medicine & Healthcare',
          icon: '⚕️',
          description: 'Become a doctor, surgeon, or healthcare professional',
          duration: '5.5-11 years',
          difficulty: 'Very High',
          averageSalary: '₹8-50 LPA',
          pathways: [
            { step: 1, title: '12th Science (PCB)', duration: '2 years', requirements: 'Physics, Chemistry, Biology' },
            { step: 2, title: 'NEET Preparation', duration: '1-2 years', requirements: 'Qualify NEET exam' },
            { step: 3, title: 'MBBS Degree', duration: '5.5 years', requirements: 'Medical college admission' },
            { step: 4, title: 'Internship', duration: '1 year', requirements: 'Mandatory training' },
            { step: 5, title: 'Specialization (Optional)', duration: '3 years', requirements: 'NEET PG' }
          ],
          opportunities: [
            { role: 'General Physician', salary: '₹6-15 LPA', location: 'Hospitals, Clinics', demand: 'High' },
            { role: 'Specialist Doctor', salary: '₹15-50 LPA', location: 'Specialized hospitals', demand: 'Very High' },
            { role: 'Surgeon', salary: '₹20-1Cr+ LPA', location: 'Major hospitals', demand: 'High' },
            { role: 'Medical Officer', salary: '₹8-20 LPA', location: 'Government sector', demand: 'High' }
          ],
          jkOpportunities: [
            'AIIMS Jammu - Recent establishment',
            'Government Medical Colleges in Srinagar, Jammu',
            'District hospitals expansion',
            'Telemedicine initiatives in remote areas',
            'Medical tourism development'
          ],
          skills: ['Scientific aptitude', 'Empathy', 'Problem-solving', 'Communication', 'Continuous learning'],
          challenges: ['High competition', 'Long study duration', 'Emotional stress', 'Continuous updates required']
        },
        {
          id: 'engineering',
          name: 'Engineering & Technology',
          icon: '⚙️',
          description: 'Build the future with engineering and technology',
          duration: '4-6 years',
          difficulty: 'High',
          averageSalary: '₹3-30 LPA',
          pathways: [
            { step: 1, title: '12th Science (PCM)', duration: '2 years', requirements: 'Physics, Chemistry, Mathematics' },
            { step: 2, title: 'JEE Preparation', duration: '1-2 years', requirements: 'JEE Main/Advanced' },
            { step: 3, title: 'B.Tech Degree', duration: '4 years', requirements: 'Engineering college admission' },
            { step: 4, title: 'Specialization/M.Tech', duration: '2 years', requirements: 'Optional advanced degree' },
            { step: 5, title: 'Industry Experience', duration: 'Ongoing', requirements: 'Practical exposure' }
          ],
          opportunities: [
            { role: 'Software Engineer', salary: '₹4-25 LPA', location: 'IT companies', demand: 'Very High' },
            { role: 'Civil Engineer', salary: '₹3-15 LPA', location: 'Construction, Govt', demand: 'High' },
            { role: 'Mechanical Engineer', salary: '₹3-18 LPA', location: 'Manufacturing', demand: 'High' },
            { role: 'Electrical Engineer', salary: '₹3-20 LPA', location: 'Power sector', demand: 'High' }
          ],
          jkOpportunities: [
            'NIT Srinagar - Premier engineering institute',
            'Infrastructure development projects',
            'Renewable energy sector growth',
            'Smart city initiatives in Jammu & Srinagar',
            'IT parks and software development'
          ],
          skills: ['Analytical thinking', 'Problem-solving', 'Technical expertise', 'Innovation', 'Project management'],
          challenges: ['Rapid technology changes', 'Continuous upskilling needed', 'High competition', 'Practical vs theoretical gap']
        },
        {
          id: 'research',
          name: 'Research & Innovation',
          icon: '🔬',
          description: 'Contribute to scientific advancement and discovery',
          duration: '6-10 years',
          difficulty: 'Very High',
          averageSalary: '₹4-25 LPA',
          pathways: [
            { step: 1, title: '12th Science', duration: '2 years', requirements: 'Strong science foundation' },
            { step: 2, title: 'B.Sc./B.Tech', duration: '3-4 years', requirements: 'Undergraduate degree' },
            { step: 3, title: 'M.Sc./M.Tech', duration: '2 years', requirements: 'Research-oriented masters' },
            { step: 4, title: 'Ph.D.', duration: '3-5 years', requirements: 'Doctoral research' },
            { step: 5, title: 'Post-Doc/Industry', duration: 'Ongoing', requirements: 'Advanced research' }
          ],
          opportunities: [
            { role: 'Research Scientist', salary: '₹6-20 LPA', location: 'Research institutes', demand: 'Medium' },
            { role: 'R&D Engineer', salary: '₹5-18 LPA', location: 'Tech companies', demand: 'High' },
            { role: 'Academic Researcher', salary: '₹4-15 LPA', location: 'Universities', demand: 'Medium' },
            { role: 'Patent Analyst', salary: '₹8-25 LPA', location: 'IP firms', demand: 'Growing' }
          ],
          jkOpportunities: [
            'University of Kashmir research programs',
            'DRDO labs in Jammu region',
            'Agricultural research institutes',
            'Environmental research initiatives',
            'Traditional medicine research'
          ],
          skills: ['Critical thinking', 'Research methodology', 'Data analysis', 'Scientific writing', 'Persistence'],
          challenges: ['Long academic path', 'Uncertain career prospects', 'Limited immediate financial returns', 'High dedication required']
        }
      ]
    },
    commerce: {
      name: 'Commerce Stream',
      icon: '💼',
      color: 'from-green-500 to-teal-600',
      description: 'Excel in business, finance, and entrepreneurship',
      careers: [
        {
          id: 'business',
          name: 'Business & Management',
          icon: '📊',
          description: 'Lead organizations and drive business growth',
          duration: '3-5 years',
          difficulty: 'Medium',
          averageSalary: '₹3-50 LPA',
          pathways: [
            { step: 1, title: '12th Commerce', duration: '2 years', requirements: 'Commerce subjects' },
            { step: 2, title: 'BBA/B.Com', duration: '3 years', requirements: 'Business foundation' },
            { step: 3, title: 'MBA', duration: '2 years', requirements: 'CAT/MAT/GMAT' },
            { step: 4, title: 'Industry Experience', duration: '2-5 years', requirements: 'Practical exposure' },
            { step: 5, title: 'Leadership Roles', duration: 'Ongoing', requirements: 'Proven track record' }
          ],
          opportunities: [
            { role: 'Business Analyst', salary: '₹4-15 LPA', location: 'Corporates', demand: 'High' },
            { role: 'Marketing Manager', salary: '₹6-25 LPA', location: 'All industries', demand: 'High' },
            { role: 'Operations Manager', salary: '₹8-30 LPA', location: 'Manufacturing/Service', demand: 'High' },
            { role: 'CEO/Entrepreneur', salary: '₹15-∞ LPA', location: 'Own business', demand: 'Self-driven' }
          ],
          jkOpportunities: [
            'Tourism industry management',
            'Handicrafts business development',
            'Agricultural product marketing',
            'Government administrative services',
            'Startup ecosystem development'
          ],
          skills: ['Leadership', 'Communication', 'Strategic thinking', 'Team management', 'Decision making'],
          challenges: ['High competition', 'Need for continuous networking', 'Pressure to deliver results', 'Economic uncertainties']
        },
        {
          id: 'finance',
          name: 'Finance & Banking',
          icon: '💰',
          description: 'Manage money, investments, and financial planning',
          duration: '3-4 years',
          difficulty: 'Medium-High',
          averageSalary: '₹3-40 LPA',
          pathways: [
            { step: 1, title: '12th Commerce', duration: '2 years', requirements: 'Mathematics recommended' },
            { step: 2, title: 'B.Com/BBA Finance', duration: '3 years', requirements: 'Finance specialization' },
            { step: 3, title: 'Professional Courses', duration: '2-3 years', requirements: 'CA/CFA/FRM' },
            { step: 4, title: 'Industry Certification', duration: '1 year', requirements: 'Practical training' },
            { step: 5, title: 'Senior Roles', duration: 'Ongoing', requirements: 'Experience & expertise' }
          ],
          opportunities: [
            { role: 'Financial Analyst', salary: '₹4-12 LPA', location: 'Banks, Corporates', demand: 'High' },
            { role: 'Investment Banker', salary: '₹8-40 LPA', location: 'Investment firms', demand: 'High' },
            { role: 'Chartered Accountant', salary: '₹6-25 LPA', location: 'Practice/Industry', demand: 'Very High' },
            { role: 'Financial Advisor', salary: '₹5-20 LPA', location: 'Banks, Consultancies', demand: 'Growing' }
          ],
          jkOpportunities: [
            'J&K Bank career opportunities',
            'Microfinance institutions',
            'Government financial schemes',
            'Tax consultancy services',
            'Insurance sector growth'
          ],
          skills: ['Numerical aptitude', 'Analytical skills', 'Risk assessment', 'Attention to detail', 'Regulatory knowledge'],
          challenges: ['Complex regulations', 'High responsibility', 'Market volatility impact', 'Continuous learning required']
        }
      ]
    },
    arts: {
      name: 'Arts & Humanities',
      icon: '🎨',
      color: 'from-orange-500 to-red-600',
      description: 'Express creativity and understand human society',
      careers: [
        {
          id: 'creative',
          name: 'Creative Arts & Design',
          icon: '🎭',
          description: 'Create visual and performing arts',
          duration: '3-4 years',
          difficulty: 'Medium',
          averageSalary: '₹2-15 LPA',
          pathways: [
            { step: 1, title: '12th Any Stream', duration: '2 years', requirements: 'Creative portfolio' },
            { step: 2, title: 'BFA/Design Degree', duration: '3-4 years', requirements: 'Art school admission' },
            { step: 3, title: 'Specialization', duration: '1-2 years', requirements: 'Focus area selection' },
            { step: 4, title: 'Portfolio Development', duration: 'Ongoing', requirements: 'Professional work' },
            { step: 5, title: 'Industry Recognition', duration: 'Ongoing', requirements: 'Exhibitions/Awards' }
          ],
          opportunities: [
            { role: 'Graphic Designer', salary: '₹2-8 LPA', location: 'Design studios', demand: 'High' },
            { role: 'UI/UX Designer', salary: '₹4-15 LPA', location: 'Tech companies', demand: 'Very High' },
            { role: 'Artist/Illustrator', salary: '₹3-12 LPA', location: 'Freelance/Studios', demand: 'Medium' },
            { role: 'Art Director', salary: '₹8-25 LPA', location: 'Advertising', demand: 'Medium' }
          ],
          jkOpportunities: [
            'Traditional handicrafts modernization',
            'Tourism promotional materials',
            'Bollywood film industry connections',
            'Cultural heritage documentation',
            'Digital art for local businesses'
          ],
          skills: ['Creativity', 'Visual communication', 'Software proficiency', 'Cultural awareness', 'Market understanding'],
          challenges: ['Irregular income', 'High competition', 'Subjective evaluation', 'Technology adaptation needed']
        },
        {
          id: 'social',
          name: 'Social Work & Development',
          icon: '🤝',
          description: 'Work for society and community development',
          duration: '3-5 years',
          difficulty: 'Medium',
          averageSalary: '₹3-12 LPA',
          pathways: [
            { step: 1, title: '12th Any Stream', duration: '2 years', requirements: 'Social awareness' },
            { step: 2, title: 'BA Social Work/Sociology', duration: '3 years', requirements: 'Social science foundation' },
            { step: 3, title: 'MSW/Specialization', duration: '2 years', requirements: 'Advanced social work' },
            { step: 4, title: 'Field Experience', duration: '1-2 years', requirements: 'Practical exposure' },
            { step: 5, title: 'Leadership Roles', duration: 'Ongoing', requirements: 'Impact demonstration' }
          ],
          opportunities: [
            { role: 'Social Worker', salary: '₹3-8 LPA', location: 'NGOs, Government', demand: 'High' },
            { role: 'Development Officer', salary: '₹4-10 LPA', location: 'Development agencies', demand: 'High' },
            { role: 'Community Organizer', salary: '₹3-7 LPA', location: 'Grassroots organizations', demand: 'Medium' },
            { role: 'Policy Analyst', salary: '₹6-15 LPA', location: 'Think tanks', demand: 'Growing' }
          ],
          jkOpportunities: [
            'Peace and conflict resolution',
            'Rural development programs',
            'Women empowerment initiatives',
            'Youth skill development',
            'Cultural preservation projects'
          ],
          skills: ['Empathy', 'Communication', 'Problem-solving', 'Cultural sensitivity', 'Project management'],
          challenges: ['Lower financial rewards', 'Emotional challenges', 'Bureaucratic hurdles', 'Slow pace of change']
        }
      ]
    }
  }

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 800)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-white text-3xl"
            >
              💼
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">Loading Career Pathways</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preparing your career guidance...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 px-4 pb-12 sm:pb-16 md:pb-20 overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 md:mb-12 px-4"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-4 text-responsive">Career Pathways</h1>
          <p className="text-adaptive-secondary text-base sm:text-lg md:text-xl text-responsive max-w-3xl mx-auto">
            Explore detailed career paths and opportunities in Jammu & Kashmir
          </p>
        </motion.div>

        {/* Stream Selection - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8 sm:mb-10 md:mb-12 px-4"
        >
          <div className="glass-strong p-2 rounded-xl flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {Object.entries(careerStreams).map(([key, stream]) => (
              <button
                key={key}
                onClick={() => setSelectedStream(key)}
                className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base w-full sm:w-auto ${
                  selectedStream === key
                    ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
                }`}
              >
                <span className="text-xl sm:text-2xl mr-2">{stream.icon}</span>
                <span className="text-responsive">{stream.name}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* View Mode Toggle - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6 sm:mb-8 px-4"
        >
          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('pathways')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium flex-1 sm:flex-none ${
                viewMode === 'pathways' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
            >
              <span className="text-sm sm:text-base">🛤️</span>
              <span className="hidden sm:inline ml-1">Career Pathways</span>
              <span className="sm:hidden ml-1">Pathways</span>
            </button>
            <button
              onClick={() => setViewMode('opportunities')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium flex-1 sm:flex-none ${
                viewMode === 'opportunities' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
            >
              <span className="text-sm sm:text-base">💼</span>
              <span className="hidden sm:inline ml-1">Job Opportunities</span>
              <span className="sm:hidden ml-1">Jobs</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium flex-1 sm:flex-none ${
                viewMode === 'timeline' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }`}
            >
              <span className="text-sm sm:text-base">📅</span>
              <span className="hidden sm:inline ml-1">Timeline View</span>
              <span className="sm:hidden ml-1">Timeline</span>
            </button>
          </div>
        </motion.div>

        {/* Selected Stream Overview - Responsive */}
        <motion.div
          key={selectedStream}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`glass-strong p-4 sm:p-6 md:p-8 rounded-xl mb-8 sm:mb-10 md:mb-12 bg-gradient-to-r ${careerStreams[selectedStream].color} bg-opacity-10 mx-4`}
        >
          <div className="text-center w-full">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">{careerStreams[selectedStream].icon}</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gradient mb-3 sm:mb-4 text-responsive">
              {careerStreams[selectedStream].name}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-adaptive-secondary max-w-3xl mx-auto text-responsive">
              {careerStreams[selectedStream].description}
            </p>
          </div>
        </motion.div>

        {/* Career Cards - Responsive */}
        <div className="grid gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12 px-4">
          {careerStreams[selectedStream].careers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="card-hover"
            >
              <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl flex-shrink-0 self-center lg:self-start">{career.icon}</div>
                
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3 sm:gap-4">
                    <div className="w-full sm:flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gradient mb-2 text-responsive">{career.name}</h3>
                      <p className="text-adaptive-secondary text-sm sm:text-base mb-4 text-responsive">{career.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCareer(career)}
                      className="btn-primary text-xs sm:text-sm w-full sm:w-auto flex-shrink-0"
                    >
                      Explore Details
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-adaptive-muted mb-1">Duration</div>
                      <div className="font-semibold text-xs sm:text-sm">{career.duration}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-adaptive-muted mb-1">Difficulty</div>
                      <div className={`font-semibold text-xs sm:text-sm ${
                        career.difficulty === 'Very High' ? 'text-red-600' :
                        career.difficulty === 'High' ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {career.difficulty}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-adaptive-muted mb-1">Avg Salary</div>
                      <div className="font-semibold text-primary-600 text-xs sm:text-sm">{career.averageSalary}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-adaptive-muted mb-1">Path Steps</div>
                      <div className="font-semibold text-xs sm:text-sm">{career.pathways.length} steps</div>
                    </div>
                  </div>

                  {/* Quick Pathway Preview - Responsive */}
                  {viewMode === 'pathways' && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {career.pathways.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs sm:text-sm font-bold">
                            {step.step}
                          </div>
                          <div className="text-xs sm:text-sm font-medium whitespace-nowrap">{step.title}</div>
                          {stepIndex < career.pathways.length - 1 && (
                            <div className="text-gray-400 mx-1 sm:mx-2 text-xs sm:text-sm">→</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Opportunities Preview - Responsive */}
                  {viewMode === 'opportunities' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {career.opportunities.slice(0, 4).map((opp, oppIndex) => (
                        <div key={oppIndex} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <div className="font-semibold text-xs sm:text-sm mb-1 text-responsive">{opp.role}</div>
                          <div className="text-xs text-adaptive-muted text-responsive">
                            {opp.salary} • {opp.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timeline Preview - Responsive */}
                  {viewMode === 'timeline' && (
                    <div className="space-y-2">
                      {career.pathways.slice(0, 3).map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-center gap-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-secondary-600 text-white flex items-center justify-center text-xs font-bold">
                            {step.step}
                          </div>
                          <div className="flex-1 text-xs sm:text-sm">
                            <span className="font-medium text-responsive">{step.title}</span>
                            <span className="text-adaptive-muted ml-2 text-responsive">({step.duration})</span>
                          </div>
                        </div>
                      ))}
                      {career.pathways.length > 3 && (
                        <div className="text-xs sm:text-sm text-adaptive-muted ml-8 sm:ml-9 text-responsive">
                          +{career.pathways.length - 3} more steps...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* J&K Specific Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-strong p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold text-gradient mb-6 text-center">
            🏔️ Jammu & Kashmir Specific Opportunities
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {careerStreams[selectedStream].careers.map((career, index) => (
              <div key={career.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-gradient flex items-center">
                  {career.icon} {career.name}
                </h3>
                <ul className="space-y-2">
                  {career.jkOpportunities.map((opp, oppIndex) => (
                    <li key={oppIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Career Detail Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedCareer(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{selectedCareer.icon}</div>
                    <div>
                      <h2 className="text-3xl font-bold text-gradient mb-2">{selectedCareer.name}</h2>
                      <p className="text-gray-600 dark:text-gray-300">{selectedCareer.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCareer(null)}
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    ×
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Career Pathway */}
                  <div>
                    <h3 className="text-xl font-bold mb-6">📍 Career Pathway</h3>
                    <div className="space-y-4">
                      {selectedCareer.pathways.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 dark:text-white">{step.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Duration: {step.duration}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{step.requirements}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Job Opportunities */}
                  <div>
                    <h3 className="text-xl font-bold mb-6">💼 Job Opportunities</h3>
                    <div className="space-y-4">
                      {selectedCareer.opportunities.map((opp, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                        >
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{opp.role}</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Salary: </span>
                              <span className="font-medium text-primary-600">{opp.salary}</span>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Location: </span>
                              <span className="font-medium">{opp.location}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-600 dark:text-gray-400">Demand: </span>
                              <span className={`font-medium ${
                                opp.demand === 'Very High' ? 'text-green-600' :
                                opp.demand === 'High' ? 'text-blue-600' :
                                opp.demand === 'Growing' ? 'text-orange-600' :
                                'text-gray-600'
                              }`}>
                                {opp.demand}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Skills & Challenges */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">🎯 Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCareer.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4">⚠️ Challenges</h3>
                    <ul className="space-y-2">
                      {selectedCareer.challenges.map((challenge, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                          <span className="text-red-500 mr-2 mt-1">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* J&K Opportunities */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4 text-gradient">🏔️ J&K Specific Opportunities</h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {selectedCareer.jkOpportunities.map((opp, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4 mt-8">
                  <button className="btn-primary flex-1">Get Detailed Roadmap</button>
                  <button className="btn-secondary">Find Colleges</button>
                  <button className="btn-accent">Take Aptitude Test</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Careers
