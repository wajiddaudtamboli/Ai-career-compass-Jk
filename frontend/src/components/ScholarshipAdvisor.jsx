import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ScholarshipAdvisor = () => {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    familyIncome: '',
    academicLevel: '',
    stream: '',
    marks: '',
    state: 'Jammu & Kashmir',
    gender: '',
    physicallyHandicapped: false,
    minority: '',
    achievements: []
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'general', label: 'General', description: 'General Category' },
    { id: 'obc', label: 'OBC', description: 'Other Backward Classes' },
    { id: 'sc', label: 'SC', description: 'Scheduled Caste' },
    { id: 'st', label: 'ST', description: 'Scheduled Tribe' },
    { id: 'ews', label: 'EWS', description: 'Economically Weaker Section' }
  ];

  const incomeRanges = [
    { id: 'below1', label: 'Below ₹1 Lakh', value: 'Below ₹1,00,000' },
    { id: '1to2.5', label: '₹1-2.5 Lakhs', value: '₹1,00,000 - ₹2,50,000' },
    { id: '2.5to5', label: '₹2.5-5 Lakhs', value: '₹2,50,000 - ₹5,00,000' },
    { id: '5to8', label: '₹5-8 Lakhs', value: '₹5,00,000 - ₹8,00,000' },
    { id: 'above8', label: 'Above ₹8 Lakhs', value: 'Above ₹8,00,000' }
  ];

  const academicLevels = [
    { id: 'class10', label: 'Class 10th', description: 'Secondary Education' },
    { id: 'class12', label: 'Class 12th', description: 'Higher Secondary Education' },
    { id: 'graduation', label: 'Graduation', description: 'Bachelor\'s Degree' },
    { id: 'postgraduation', label: 'Post Graduation', description: 'Master\'s Degree' },
    { id: 'phd', label: 'PhD', description: 'Doctoral Studies' }
  ];

  const streams = [
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'commerce', label: 'Commerce', icon: '💼' },
    { id: 'arts', label: 'Arts/Humanities', icon: '🎨' },
    { id: 'engineering', label: 'Engineering', icon: '⚙️' },
    { id: 'medical', label: 'Medical', icon: '🏥' },
    { id: 'management', label: 'Management', icon: '📊' },
    { id: 'law', label: 'Law', icon: '⚖️' },
    { id: 'other', label: 'Other', icon: '📚' }
  ];

  const minorities = [
    { id: 'none', label: 'Not Applicable' },
    { id: 'muslim', label: 'Muslim' },
    { id: 'christian', label: 'Christian' },
    { id: 'sikh', label: 'Sikh' },
    { id: 'buddhist', label: 'Buddhist' },
    { id: 'jain', label: 'Jain' },
    { id: 'parsi', label: 'Parsi' }
  ];

  const achievements = [
    { id: 'sports', label: 'Sports Achievements', icon: '🏆' },
    { id: 'arts', label: 'Arts & Culture', icon: '🎭' },
    { id: 'science', label: 'Science Olympiad', icon: '🧪' },
    { id: 'debate', label: 'Debate/Elocution', icon: '🎤' },
    { id: 'volunteer', label: 'Volunteer Work', icon: '🤝' },
    { id: 'research', label: 'Research Projects', icon: '📊' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAchievementToggle = (achievementId) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.includes(achievementId)
        ? prev.achievements.filter(id => id !== achievementId)
        : [...prev.achievements, achievementId]
    }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getScholarshipRecommendations = async () => {
    setIsLoading(true);
    try {
      const studentProfile = {
        category: formData.category,
        academicLevel: formData.academicLevel,
        stream: formData.stream,
        marks: formData.marks,
        state: formData.state,
        gender: formData.gender,
        physicallyHandicapped: formData.physicallyHandicapped,
        minority: formData.minority,
        achievements: formData.achievements
      };

      const financialInfo = {
        familyIncome: formData.familyIncome,
        category: formData.category
      };

      const response = await fetch('/api/ai/scholarship-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentProfile,
          financialInfo
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults({
          recommendations: data.scholarships,
          timestamp: data.timestamp
        });
        setStep(5);
      } else {
        console.error('Failed to get scholarship recommendations:', data.error);
        setResults({
          recommendations: 'Unable to generate scholarship recommendations at this time. Please contact our counselors for personalized assistance.',
          timestamp: new Date().toISOString(),
          isError: true
        });
        setStep(5);
      }
    } catch (error) {
      console.error('Scholarship recommendation error:', error);
      setResults({
        recommendations: 'Unable to connect to our scholarship database. Please try again later or contact support.',
        timestamp: new Date().toISOString(),
        isError: true
      });
      setStep(5);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      category: '',
      familyIncome: '',
      academicLevel: '',
      stream: '',
      marks: '',
      state: 'Jammu & Kashmir',
      gender: '',
      physicallyHandicapped: false,
      minority: '',
      achievements: []
    });
    setResults(null);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.category && formData.familyIncome;
      case 2:
        return formData.academicLevel && formData.stream;
      case 3:
        return formData.marks && formData.gender;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (results) {
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
              <div className="text-6xl mb-4">🎓</div>
              <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Scholarship Recommendations
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Based on your profile, here are the scholarships you're eligible for:
              </p>
            </div>

            <div className={`p-6 rounded-xl mb-6 ${
              isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">🤖</span>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Scholarship Advisor Recommendations
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
                    Finding the best scholarships for you...
                  </span>
                </div>
              ) : (
                <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
                  <div className={`whitespace-pre-wrap ${
                    results.isError 
                      ? 'text-red-600 dark:text-red-400' 
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {results.recommendations}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <motion.button
                onClick={resetForm}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Check Again
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
        {/* Progress Bar */}
        <div className={`mb-8 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Step {step} of 4
            </span>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {Math.round((step / 4) * 100)}% Complete
            </span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : ''}`}>
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`p-8 rounded-2xl shadow-lg ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            {step === 1 && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Basic Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <motion.label
                          key={category.id}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.category === category.id
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
                            name="category"
                            value={category.id}
                            checked={formData.category === category.id}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="sr-only"
                          />
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {category.label}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {category.description}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Family Annual Income *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {incomeRanges.map((income) => (
                        <motion.label
                          key={income.id}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.familyIncome === income.value
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
                            name="familyIncome"
                            value={income.value}
                            checked={formData.familyIncome === income.value}
                            onChange={(e) => handleInputChange('familyIncome', e.target.value)}
                            className="sr-only"
                          />
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {income.label}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Academic Details
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Current Academic Level *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {academicLevels.map((level) => (
                        <motion.label
                          key={level.id}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.academicLevel === level.id
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
                            name="academicLevel"
                            value={level.id}
                            checked={formData.academicLevel === level.id}
                            onChange={(e) => handleInputChange('academicLevel', e.target.value)}
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

                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Stream/Field of Study *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {streams.map((stream) => (
                        <motion.label
                          key={stream.id}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center ${
                            formData.stream === stream.id
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
                            name="stream"
                            value={stream.id}
                            checked={formData.stream === stream.id}
                            onChange={(e) => handleInputChange('stream', e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-2xl mb-2">{stream.icon}</div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stream.label}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Personal Details
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Latest Academic Percentage/CGPA *
                    </label>
                    <input
                      type="text"
                      value={formData.marks}
                      onChange={(e) => handleInputChange('marks', e.target.value)}
                      placeholder="e.g., 85% or 8.5 CGPA"
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Gender *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['male', 'female', 'other'].map((gender) => (
                        <motion.label
                          key={gender}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center ${
                            formData.gender === gender
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
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="sr-only"
                          />
                          <div className={`font-medium capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {gender}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Minority Community (if applicable)
                    </label>
                    <select
                      value={formData.minority}
                      onChange={(e) => handleInputChange('minority', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {minorities.map((minority) => (
                        <option key={minority.id} value={minority.id}>
                          {minority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <motion.label
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.physicallyHandicapped
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
                        checked={formData.physicallyHandicapped}
                        onChange={(e) => handleInputChange('physicallyHandicapped', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.physicallyHandicapped 
                          ? 'bg-blue-500 border-blue-500' 
                          : isDarkMode ? 'border-gray-500' : 'border-gray-400'
                      }`}>
                        {formData.physicallyHandicapped && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </div>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Person with Disability (PWD)
                      </span>
                    </motion.label>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Additional Information
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Special Achievements (Optional) - Select all that apply
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {achievements.map((achievement) => (
                        <motion.label
                          key={achievement.id}
                          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center ${
                            formData.achievements.includes(achievement.id)
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
                            checked={formData.achievements.includes(achievement.id)}
                            onChange={() => handleAchievementToggle(achievement.id)}
                            className="sr-only"
                          />
                          <div className="text-2xl mb-2">{achievement.icon}</div>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {achievement.label}
                          </div>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Review Your Information
                    </h3>
                    <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p><strong>Category:</strong> {formData.category?.toUpperCase()}</p>
                      <p><strong>Income:</strong> {formData.familyIncome}</p>
                      <p><strong>Education:</strong> {formData.academicLevel} - {formData.stream}</p>
                      <p><strong>Marks:</strong> {formData.marks}</p>
                      <p><strong>Gender:</strong> {formData.gender}</p>
                      {formData.minority !== 'none' && (
                        <p><strong>Minority:</strong> {formData.minority}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <motion.button
                onClick={prevStep}
                disabled={step === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  step === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={step > 1 ? { scale: 1.05 } : {}}
                whileTap={step > 1 ? { scale: 0.95 } : {}}
              >
                Previous
              </motion.button>

              <motion.button
                onClick={step === 4 ? getScholarshipRecommendations : nextStep}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  !canProceed()
                    ? 'opacity-50 cursor-not-allowed bg-gray-400'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
                whileHover={canProceed() ? { scale: 1.05 } : {}}
                whileTap={canProceed() ? { scale: 0.95 } : {}}
              >
                {step === 4 ? 'Get Recommendations' : 'Next'}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScholarshipAdvisor;