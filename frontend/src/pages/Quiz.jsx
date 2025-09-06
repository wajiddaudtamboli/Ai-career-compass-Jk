import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const Quiz = () => {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    {
      id: 'interests',
      name: 'Interests & Preferences',
      description: 'Discover what you enjoy doing',
      icon: '💡',
      color: 'from-blue-500 to-purple-600',
      questions: [
        {
          id: 'int_1',
          text: 'Which activity interests you the most?',
          options: [
            { value: 'research', label: 'Conducting research and experiments', weight: { science: 3, research: 3 } },
            { value: 'design', label: 'Creating designs and artistic work', weight: { arts: 3, creative: 3 } },
            { value: 'business', label: 'Managing business operations', weight: { commerce: 3, management: 3 } },
            { value: 'technology', label: 'Working with computers and technology', weight: { technology: 3, engineering: 2 } }
          ]
        },
        {
          id: 'int_2',
          text: 'What type of environment do you prefer to work in?',
          options: [
            { value: 'lab', label: 'Laboratory or research facility', weight: { science: 2, research: 3 } },
            { value: 'office', label: 'Corporate office environment', weight: { commerce: 2, management: 2 } },
            { value: 'outdoor', label: 'Outdoor or field work', weight: { agriculture: 3, environmental: 2 } },
            { value: 'creative', label: 'Studio or creative workspace', weight: { arts: 3, creative: 3 } }
          ]
        },
        {
          id: 'int_3',
          text: 'Which subject did you enjoy most in school?',
          options: [
            { value: 'math', label: 'Mathematics', weight: { science: 2, engineering: 3, technology: 2 } },
            { value: 'english', label: 'English Literature', weight: { arts: 3, communication: 2 } },
            { value: 'science', label: 'Physics/Chemistry/Biology', weight: { science: 3, medical: 2 } },
            { value: 'social', label: 'Social Studies/History', weight: { arts: 2, social_work: 2 } }
          ]
        }
      ]
    },
    {
      id: 'aptitude',
      name: 'Aptitude & Skills',
      description: 'Assess your natural abilities',
      icon: '🧠',
      color: 'from-green-500 to-teal-600',
      questions: [
        {
          id: 'apt_1',
          text: 'How do you approach problem-solving?',
          options: [
            { value: 'logical', label: 'Step-by-step logical analysis', weight: { engineering: 3, science: 2, technology: 2 } },
            { value: 'creative', label: 'Creative and innovative thinking', weight: { arts: 3, creative: 3, design: 2 } },
            { value: 'collaborative', label: 'Team discussion and brainstorming', weight: { management: 2, social_work: 2 } },
            { value: 'research', label: 'Detailed research and investigation', weight: { research: 3, science: 2 } }
          ]
        },
        {
          id: 'apt_2',
          text: 'What is your strongest skill?',
          options: [
            { value: 'analytical', label: 'Analytical thinking', weight: { science: 3, research: 2, technology: 2 } },
            { value: 'communication', label: 'Communication and presentation', weight: { arts: 2, management: 2, communication: 3 } },
            { value: 'technical', label: 'Technical and mechanical skills', weight: { engineering: 3, technology: 3 } },
            { value: 'leadership', label: 'Leadership and management', weight: { management: 3, commerce: 2 } }
          ]
        },
        {
          id: 'apt_3',
          text: 'How do you prefer to learn new concepts?',
          options: [
            { value: 'hands_on', label: 'Hands-on practical experience', weight: { engineering: 2, technology: 2, vocational: 3 } },
            { value: 'theoretical', label: 'Reading and theoretical study', weight: { research: 3, science: 2, arts: 2 } },
            { value: 'visual', label: 'Visual aids and demonstrations', weight: { creative: 2, arts: 2, design: 3 } },
            { value: 'discussion', label: 'Group discussions and debates', weight: { social_work: 2, management: 2, communication: 2 } }
          ]
        }
      ]
    },
    {
      id: 'personality',
      name: 'Personality & Work Style',
      description: 'Understand your work preferences',
      icon: '🎭',
      color: 'from-orange-500 to-red-600',
      questions: [
        {
          id: 'per_1',
          text: 'How do you prefer to work?',
          options: [
            { value: 'independently', label: 'Independently with minimal supervision', weight: { research: 2, creative: 2, technology: 2 } },
            { value: 'team', label: 'As part of a collaborative team', weight: { management: 2, social_work: 3, engineering: 1 } },
            { value: 'leadership', label: 'Leading and directing others', weight: { management: 3, commerce: 2 } },
            { value: 'support', label: 'Supporting others and providing assistance', weight: { social_work: 3, healthcare: 2 } }
          ]
        },
        {
          id: 'per_2',
          text: 'What motivates you the most?',
          options: [
            { value: 'achievement', label: 'Personal achievement and recognition', weight: { commerce: 2, management: 2, competitive: 3 } },
            { value: 'helping', label: 'Helping others and making a difference', weight: { social_work: 3, healthcare: 3, education: 2 } },
            { value: 'innovation', label: 'Innovation and creating new things', weight: { technology: 3, creative: 3, research: 2 } },
            { value: 'stability', label: 'Job security and stable income', weight: { government: 3, traditional: 2 } }
          ]
        },
        {
          id: 'per_3',
          text: 'How do you handle stress and pressure?',
          options: [
            { value: 'calm', label: 'Stay calm and think rationally', weight: { healthcare: 2, management: 2, science: 2 } },
            { value: 'seek_help', label: 'Seek help from others', weight: { social_work: 2, collaborative: 2 } },
            { value: 'break_down', label: 'Break down problems into smaller parts', weight: { engineering: 2, technology: 2, analytical: 2 } },
            { value: 'take_breaks', label: 'Take breaks and return refreshed', weight: { creative: 2, self_care: 2 } }
          ]
        }
      ]
    }
  ]

  const careerRecommendations = {
    science: { name: 'Science Stream', careers: ['Medicine', 'Engineering', 'Research', 'Biotechnology'] },
    commerce: { name: 'Commerce Stream', careers: ['Business Management', 'Accounting', 'Economics', 'Banking'] },
    arts: { name: 'Arts Stream', careers: ['Literature', 'Psychology', 'Social Work', 'Journalism'] },
    technology: { name: 'Technology', careers: ['Software Development', 'Data Science', 'Cybersecurity', 'AI/ML'] },
    creative: { name: 'Creative Fields', careers: ['Graphic Design', 'Fine Arts', 'Architecture', 'Film Making'] },
    management: { name: 'Management', careers: ['MBA', 'Project Management', 'Human Resources', 'Operations'] }
  }

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const calculateResults = () => {
    setIsLoading(true)
    
    // Simulate calculation delay
    setTimeout(() => {
      const scores = {}
      
      // Initialize scores
      Object.keys(careerRecommendations).forEach(key => {
        scores[key] = 0
      })

      // Calculate scores based on answers
      categories.forEach(category => {
        category.questions.forEach(question => {
          const answer = answers[question.id]
          if (answer) {
            const option = question.options.find(opt => opt.value === answer.value)
            if (option && option.weight) {
              Object.entries(option.weight).forEach(([field, weight]) => {
                if (scores[field] !== undefined) {
                  scores[field] += weight
                }
              })
            }
          }
        })
      })

      // Sort by highest scores
      const sortedScores = Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)

      const recommendations = sortedScores.map(([field, score]) => ({
        field,
        score,
        percentage: Math.min(Math.round((score / 15) * 100), 100),
        ...careerRecommendations[field]
      }))

      setResults({
        topRecommendations: recommendations,
        allScores: scores,
        totalQuestions: categories.reduce((sum, cat) => sum + cat.questions.length, 0),
        answeredQuestions: Object.keys(answers).length
      })

      setIsLoading(false)
      setShowResults(true)
    }, 2000)
  }

  const nextStep = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateResults()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
    setResults(null)
  }

  const progressPercentage = ((currentStep + 1) / categories.length) * 100

  const currentCategory = categories[currentStep]
  const isStepComplete = currentCategory?.questions.every(q => answers[q.id])

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
              ⚡
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-gradient mb-2">Analyzing Your Responses</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Our AI is processing your answers to provide personalized recommendations...
          </p>
        </motion.div>
      </div>
    )
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="heading-2 text-gradient mb-4">Your Career Assessment Results</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Based on your responses, here are your personalized career recommendations
            </p>
          </motion.div>

          <div className="grid gap-8">
            {results.topRecommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.field}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="glass-strong p-8 rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gradient">
                    #{index + 1} {recommendation.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      {recommendation.percentage}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Match</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                  <motion.div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${recommendation.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Recommended Career Paths:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {recommendation.careers.map((career, careerIndex) => (
                      <motion.div
                        key={career}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + careerIndex * 0.1 + 1 }}
                        className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center text-sm font-medium shadow-sm"
                      >
                        {career}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-12"
          >
            <div className="space-y-4">
              <button
                onClick={resetQuiz}
                className="btn-primary mr-4"
              >
                Retake Assessment
              </button>
              <button
                onClick={() => window.location.href = '/colleges'}
                className="btn-secondary"
              >
                Explore Colleges
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="heading-2 text-gradient mb-4">Career Aptitude Assessment</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Discover your strengths and find the perfect career path tailored for J&K opportunities
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {categories.length}
            </span>
            <span className="text-sm font-medium text-primary-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Current Category */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="glass-strong p-8 rounded-xl mb-8"
          >
            <div className="text-center mb-8">
              <div className={`text-6xl mb-4 bg-gradient-to-r ${currentCategory.color} bg-clip-text text-transparent`}>
                {currentCategory.icon}
              </div>
              <h2 className="text-3xl font-bold text-gradient mb-2">
                {currentCategory.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentCategory.description}
              </p>
            </div>

            <div className="space-y-8">
              {currentCategory.questions.map((question, questionIndex) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: questionIndex * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                    {question.text}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <motion.label
                        key={option.value}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                          answers[question.id]?.value === option.value
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                            : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={answers[question.id]?.value === option.value}
                          onChange={() => handleAnswerSelect(question.id, option)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                          answers[question.id]?.value === option.value
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {answers[question.id]?.value === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {option.label}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              currentStep === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-glass hover:scale-105'
            }`}
          >
            ← Previous
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {isStepComplete ? 'All questions answered!' : 'Please answer all questions to continue'}
            </p>
          </div>

          <button
            onClick={nextStep}
            disabled={!isStepComplete}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              !isStepComplete
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : currentStep === categories.length - 1
                ? 'btn-accent hover:scale-105'
                : 'btn-primary hover:scale-105'
            }`}
          >
            {currentStep === categories.length - 1 ? 'Get Results ✨' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz
