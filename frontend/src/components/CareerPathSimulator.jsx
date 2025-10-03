import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CareerPathSimulator = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    currentEducation: '',
    careerChoice: '',
    timeframe: '5 years',
    location: 'Jammu & Kashmir',
    interests: []
  });
  const [simulation, setSimulation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const educationLevels = [
    { id: 'class10', label: 'Class 10th', description: 'Secondary Education' },
    { id: 'class12_science', label: 'Class 12th (Science)', description: 'PCM/PCB Stream' },
    { id: 'class12_commerce', label: 'Class 12th (Commerce)', description: 'Business Studies' },
    { id: 'class12_arts', label: 'Class 12th (Arts)', description: 'Humanities' },
    { id: 'graduation', label: 'Graduation', description: 'Bachelor\'s Degree' },
    { id: 'postgraduation', label: 'Post Graduation', description: 'Master\'s Degree' }
  ];

  const careerOptions = [
    { id: 'software_engineer', label: 'Software Engineer', category: 'Technology' },
    { id: 'doctor', label: 'Medical Doctor', category: 'Healthcare' },
    { id: 'civil_engineer', label: 'Civil Engineer', category: 'Engineering' },
    { id: 'teacher', label: 'Teacher/Professor', category: 'Education' },
    { id: 'ias_officer', label: 'IAS Officer', category: 'Civil Services' },
    { id: 'entrepreneur', label: 'Entrepreneur', category: 'Business' },
    { id: 'chartered_accountant', label: 'Chartered Accountant', category: 'Finance' },
    { id: 'lawyer', label: 'Lawyer', category: 'Legal' },
    { id: 'journalist', label: 'Journalist', category: 'Media' },
    { id: 'data_scientist', label: 'Data Scientist', category: 'Technology' },
    { id: 'psychologist', label: 'Psychologist', category: 'Healthcare' },
    { id: 'digital_marketer', label: 'Digital Marketer', category: 'Marketing' }
  ];

  const timeframeOptions = [
    { id: '2 years', label: '2 Years', description: 'Short-term goals' },
    { id: '5 years', label: '5 Years', description: 'Medium-term planning' },
    { id: '10 years', label: '10 Years', description: 'Long-term vision' },
    { id: '15 years', label: '15 Years', description: 'Career peak planning' }
  ];

  const interests = [
    { id: 'problem_solving', label: 'Problem Solving', icon: '🧩' },
    { id: 'creativity', label: 'Creative Work', icon: '🎨' },
    { id: 'leadership', label: 'Leadership', icon: '👑' },
    { id: 'helping_others', label: 'Helping Others', icon: '🤝' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'research', label: 'Research', icon: '🔬' },
    { id: 'communication', label: 'Communication', icon: '💬' },
    { id: 'business', label: 'Business', icon: '📈' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const simulateCareerPath = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/simulate-career', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentEducation: formData.currentEducation,
          careerChoice: formData.careerChoice,
          timeframe: formData.timeframe,
          additionalInfo: {
            location: formData.location,
            interests: formData.interests
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSimulation({
          careerPath: data.careerPath,
          timeframe: data.timeframe,
          timestamp: data.timestamp
        });
      } else {
        console.error('Failed to simulate career path:', data.error);
        setSimulation({
          careerPath: 'Unable to generate career path simulation at this time. Please try again later or contact our counselors for personalized guidance.',
          timeframe: formData.timeframe,
          timestamp: new Date().toISOString(),
          isError: true
        });
      }
    } catch (error) {
      console.error('Career simulation error:', error);
      setSimulation({
        careerPath: 'Unable to connect to the career simulation service. Please check your internet connection and try again.',
        timeframe: formData.timeframe,
        timestamp: new Date().toISOString(),
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSimulator = () => {
    setFormData({
      currentEducation: '',
      careerChoice: '',
      timeframe: '5 years',
      location: 'Jammu & Kashmir',
      interests: []
    });
    setSimulation(null);
  };

  const canSimulate = () => {
    return formData.currentEducation && formData.careerChoice;
  };

  if (simulation) {
    return (
      <div className={`min-h-screen py-12 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔮</div>
              <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Career Path Simulation
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI-generated roadmap for your {formData.timeframe} journey as a {careerOptions.find(c => c.id === formData.careerChoice)?.label}
              </p>
            </div>

            <div className={`p-6 rounded-xl mb-6 ${
              isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🤖</span>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Career Path Analysis
                </h3>
              </div>
              
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Analyzing career trajectories and market trends...
                  </span>
                </div>
              ) : (
                <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
                  <div className={`whitespace-pre-wrap leading-relaxed ${
                    simulation.isError 
                      ? 'text-red-600 dark:text-red-400' 
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {simulation.careerPath}
                  </div>
                </div>
              )}
            </div>

            {!simulation.isError && (
              <div className={`p-6 rounded-xl mb-6 ${
                isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-green-50 border border-green-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="mr-2">📊</span>
                  Simulation Parameters
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Current Education:</strong>
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {educationLevels.find(e => e.id === formData.currentEducation)?.label}
                    </span>
                  </div>
                  <div>
                    <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Career Goal:</strong>
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {careerOptions.find(c => c.id === formData.careerChoice)?.label}
                    </span>
                  </div>
                  <div>
                    <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Timeframe:</strong>
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.timeframe}
                    </span>
                  </div>
                  <div>
                    <strong className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Location:</strong>
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.location}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={resetSimulator}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Different Path
              </motion.button>
              
              <motion.button
                onClick={() => window.open('/counselling', '_blank')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Expert Guidance
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-4">🔮</div>
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI Career Path Simulator
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Visualize your future career journey with AI-powered projections. Explore potential paths, 
            milestones, and opportunities tailored to your goals.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-8 rounded-2xl shadow-lg ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <div className="space-y-8">
            {/* Current Education */}
            <div>
              <label className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Current Education Level *
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {educationLevels.map((level) => (
                  <motion.label
                    key={level.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.currentEducation === level.id
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDarkMode 
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="currentEducation"
                      value={level.id}
                      checked={formData.currentEducation === level.id}
                      onChange={(e) => handleInputChange('currentEducation', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {level.label}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {level.description}
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Career Choice */}
            <div>
              <label className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Desired Career Path *
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {careerOptions.map((career) => (
                  <motion.label
                    key={career.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.careerChoice === career.id
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDarkMode 
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="careerChoice"
                      value={career.id}
                      checked={formData.careerChoice === career.id}
                      onChange={(e) => handleInputChange('careerChoice', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {career.label}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {career.category}
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Timeframe */}
            <div>
              <label className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Simulation Timeframe
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {timeframeOptions.map((option) => (
                  <motion.label
                    key={option.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.timeframe === option.id
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDarkMode 
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="timeframe"
                      value={option.id}
                      checked={formData.timeframe === option.id}
                      onChange={(e) => handleInputChange('timeframe', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {option.label}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {option.description}
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Interests (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interests.map((interest) => (
                  <motion.label
                    key={interest.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center ${
                      formData.interests.includes(interest.id)
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-blue-500 bg-blue-50'
                        : isDarkMode 
                          ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                          : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest.id)}
                      onChange={() => handleInterestToggle(interest.id)}
                      className="sr-only"
                    />
                    <div className="text-2xl mb-2">{interest.icon}</div>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {interest.label}
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <motion.button
                onClick={simulateCareerPath}
                disabled={!canSimulate() || isLoading}
                className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  !canSimulate() || isLoading
                    ? 'opacity-50 cursor-not-allowed bg-gray-400'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
                whileHover={canSimulate() && !isLoading ? { scale: 1.05 } : {}}
                whileTap={canSimulate() && !isLoading ? { scale: 0.95 } : {}}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Simulating Path...</span>
                  </div>
                ) : (
                  <>
                    🔮 Simulate My Career Path
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerPathSimulator;