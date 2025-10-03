import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { 
  Microscope, 
  TrendingUp, 
  Palette, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight, 
  RotateCcw,
  Trophy,
  Award,
  Star
} from 'lucide-react'

const Quiz = () => {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    {
      id: 'science',
      name: 'Science Stream Questions',
      description: 'Test your knowledge in Science subjects (Class 10 Level)',
      icon: Microscope,
      color: 'from-blue-500 to-purple-600',
      questions: [
        {
          id: 'sci_1',
          text: 'Which of these is a source of energy?',
          options: [
            { value: 'moon', label: 'Moon', isCorrect: false },
            { value: 'sun', label: 'Sun', isCorrect: true },
            { value: 'stone', label: 'Stone', isCorrect: false },
            { value: 'air', label: 'Air', isCorrect: false }
          ],
          correctAnswer: 'sun',
          explanation: 'The Sun is the primary source of energy for Earth, providing light and heat',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'sci_2',
          text: 'Which part of our body pumps blood?',
          options: [
            { value: 'brain', label: 'Brain', isCorrect: false },
            { value: 'heart', label: 'Heart', isCorrect: true },
            { value: 'lungs', label: 'Lungs', isCorrect: false },
            { value: 'stomach', label: 'Stomach', isCorrect: false }
          ],
          correctAnswer: 'heart',
          explanation: 'The heart is a muscular organ that pumps blood throughout the body',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'sci_3',
          text: 'Water changes into ice by —',
          options: [
            { value: 'boiling', label: 'Boiling', isCorrect: false },
            { value: 'freezing', label: 'Freezing', isCorrect: true },
            { value: 'melting', label: 'Melting', isCorrect: false },
            { value: 'evaporation', label: 'Evaporation', isCorrect: false }
          ],
          correctAnswer: 'freezing',
          explanation: 'Freezing is the process where water changes from liquid to solid state (ice) at 0°C',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'sci_4',
          text: 'Which metal is used in making electric wires?',
          options: [
            { value: 'gold', label: 'Gold', isCorrect: false },
            { value: 'copper', label: 'Copper', isCorrect: true },
            { value: 'silver', label: 'Silver', isCorrect: false },
            { value: 'iron', label: 'Iron', isCorrect: false }
          ],
          correctAnswer: 'copper',
          explanation: 'Copper is widely used for electrical wiring due to its excellent conductivity and affordability',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'sci_5',
          text: 'Which planet is known as the "Red Planet"?',
          options: [
            { value: 'earth', label: 'Earth', isCorrect: false },
            { value: 'jupiter', label: 'Jupiter', isCorrect: false },
            { value: 'mars', label: 'Mars', isCorrect: true },
            { value: 'venus', label: 'Venus', isCorrect: false }
          ],
          correctAnswer: 'mars',
          explanation: 'Mars is called the Red Planet because of iron oxide (rust) on its surface',
          difficulty: 'Easy',
          gradeLevel: 10
        }
      ]
    },
    {
      id: 'commerce',
      name: 'Commerce Stream Questions',
      description: 'Test your knowledge in Commerce subjects (Class 10 Level)',
      icon: TrendingUp,
      color: 'from-green-500 to-teal-600',
      questions: [
        {
          id: 'com_1',
          text: 'What do we call the money a student pays to school every month?',
          options: [
            { value: 'fine', label: 'Fine', isCorrect: false },
            { value: 'rent', label: 'Rent', isCorrect: false },
            { value: 'fee', label: 'Fee', isCorrect: true },
            { value: 'loan', label: 'Loan', isCorrect: false }
          ],
          correctAnswer: 'fee',
          explanation: 'Fee is the regular payment made for educational services or membership',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'com_2',
          text: 'If you buy a chocolate for ₹10 and sell it for ₹15, what is the profit?',
          options: [
            { value: '2', label: '₹2', isCorrect: false },
            { value: '3', label: '₹3', isCorrect: false },
            { value: '5', label: '₹5', isCorrect: true },
            { value: '10', label: '₹10', isCorrect: false }
          ],
          correctAnswer: '5',
          explanation: 'Profit = Selling Price - Cost Price = ₹15 - ₹10 = ₹5',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'com_3',
          text: 'What is the full form of ATM?',
          options: [
            { value: 'anytime', label: 'Any Time Money', isCorrect: false },
            { value: 'allmachine', label: 'All Time Machine', isCorrect: false },
            { value: 'allmoney', label: 'All Time Money', isCorrect: false },
            { value: 'automatic', label: 'Automatic Teller Machine', isCorrect: true }
          ],
          correctAnswer: 'automatic',
          explanation: 'ATM stands for Automatic Teller Machine, used for banking transactions',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'com_4',
          text: 'Who is called the "Father of Economics"?',
          options: [
            { value: 'einstein', label: 'Albert Einstein', isCorrect: false },
            { value: 'smith', label: 'Adam Smith', isCorrect: true },
            { value: 'gandhi', label: 'Mahatma Gandhi', isCorrect: false },
            { value: 'gates', label: 'Bill Gates', isCorrect: false }
          ],
          correctAnswer: 'smith',
          explanation: 'Adam Smith is known as the Father of Economics for his work "The Wealth of Nations"',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'com_5',
          text: 'If a shopkeeper has 100 pencils and sells 40, how many are left?',
          options: [
            { value: '20', label: '20', isCorrect: false },
            { value: '40', label: '40', isCorrect: false },
            { value: '50', label: '50', isCorrect: false },
            { value: '60', label: '60', isCorrect: true }
          ],
          correctAnswer: '60',
          explanation: 'Remaining pencils = Total - Sold = 100 - 40 = 60',
          difficulty: 'Easy',
          gradeLevel: 10
        }
      ]
    },
    {
      id: 'arts',
      name: 'Arts Stream Questions',
      description: 'Test your knowledge in Arts subjects (Class 10 Level)',
      icon: Palette,
      color: 'from-orange-500 to-red-600',
      questions: [
        {
          id: 'art_1',
          text: 'Who painted the "Mona Lisa"?',
          options: [
            { value: 'vangogh', label: 'Vincent van Gogh', isCorrect: false },
            { value: 'davinci', label: 'Leonardo da Vinci', isCorrect: true },
            { value: 'picasso', label: 'Pablo Picasso', isCorrect: false },
            { value: 'monet', label: 'Claude Monet', isCorrect: false }
          ],
          correctAnswer: 'davinci',
          explanation: 'Leonardo da Vinci painted the famous Mona Lisa during the Renaissance period',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'art_2',
          text: 'What is the technique of applying paint in small dots called?',
          options: [
            { value: 'fresco', label: 'Fresco', isCorrect: false },
            { value: 'collage', label: 'Collage', isCorrect: false },
            { value: 'pointillism', label: 'Pointillism', isCorrect: true },
            { value: 'watercolor', label: 'Watercolor', isCorrect: false }
          ],
          correctAnswer: 'pointillism',
          explanation: 'Pointillism is a painting technique using small, distinct dots of color',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'art_3',
          text: 'Which country is famous for the "Taj Mahal"?',
          options: [
            { value: 'pakistan', label: 'Pakistan', isCorrect: false },
            { value: 'india', label: 'India', isCorrect: true },
            { value: 'bangladesh', label: 'Bangladesh', isCorrect: false },
            { value: 'afghanistan', label: 'Afghanistan', isCorrect: false }
          ],
          correctAnswer: 'india',
          explanation: 'The Taj Mahal is located in Agra, India, and is a UNESCO World Heritage Site',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'art_4',
          text: 'What is the main tool used for sculpture?',
          options: [
            { value: 'brush', label: 'Brush', isCorrect: false },
            { value: 'chisel', label: 'Chisel', isCorrect: true },
            { value: 'pencil', label: 'Pencil', isCorrect: false },
            { value: 'scissors', label: 'Scissors', isCorrect: false }
          ],
          correctAnswer: 'chisel',
          explanation: 'A chisel is the primary tool used by sculptors to carve and shape materials',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'art_5',
          text: 'Which of these is a famous dance form of India?',
          options: [
            { value: 'ballet', label: 'Ballet', isCorrect: false },
            { value: 'tango', label: 'Tango', isCorrect: false },
            { value: 'bharatanatyam', label: 'Bharatanatyam', isCorrect: true },
            { value: 'waltz', label: 'Waltz', isCorrect: false }
          ],
          correctAnswer: 'bharatanatyam',
          explanation: 'Bharatanatyam is one of the eight classical dance forms of India',
          difficulty: 'Easy',
          gradeLevel: 10
        }
      ]
    }
  ]

  const calculateResults = (userAnswers) => {
    const streamScores = {
      science: 0,
      commerce: 0,
      arts: 0
    }

    const detailedResults = []

    categories.forEach(category => {
      category.questions.forEach(question => {
        const userAnswer = userAnswers[question.id]
        const isCorrect = userAnswer === question.correctAnswer

        if (isCorrect) {
          streamScores[category.id] += 1
        }

        detailedResults.push({
          question: question.text,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation,
          category: category.name,
          categoryId: category.id
        })
      })
    })

    const totalQuestions = categories.reduce((sum, cat) => sum + cat.questions.length, 0)
    const totalCorrect = Object.values(streamScores).reduce((sum, score) => sum + score, 0)
    const percentage = Math.round((totalCorrect / totalQuestions) * 100)

    // Determine recommended stream
    const maxScore = Math.max(...Object.values(streamScores))
    const recommendedStreams = Object.keys(streamScores).filter(
      stream => streamScores[stream] === maxScore
    )

    return {
      streamScores,
      totalCorrect,
      totalQuestions,
      percentage,
      recommendedStreams,
      detailedResults
    }
  }

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmit = () => {
    setIsLoading(true)
    setTimeout(() => {
      const results = calculateResults(answers)
      setResults(results)
      setShowResults(true)
      setIsLoading(false)
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
    setResults(null)
    setIsLoading(false)
  }

  const currentCategory = categories[currentStep]
  const isLastCategory = currentStep === categories.length - 1

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            {/* Results Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Trophy className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz Results
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your Career Aptitude Assessment Results
              </p>
            </div>

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Score</p>
                    <p className="text-2xl font-bold">{results.percentage}%</p>
                  </div>
                  <Star className="w-8 h-8 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Correct Answers</p>
                    <p className="text-2xl font-bold">{results.totalCorrect}/{results.totalQuestions}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Science Stream</p>
                    <p className="text-2xl font-bold">{results.streamScores.science}/5</p>
                  </div>
                  <Microscope className="w-8 h-8 opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Commerce Stream</p>
                    <p className="text-2xl font-bold">{results.streamScores.commerce}/5</p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-80" />
                </div>
              </div>
            </div>

            {/* Stream Analysis */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Stream Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  const score = results.streamScores[category.id]
                  const percentage = Math.round((score / category.questions.length) * 100)
                  
                  return (
                    <div key={category.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mr-4`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {category.name.replace(' Questions', '')}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {score}/{category.questions.length} ({percentage}%)
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommended Stream */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Recommended Stream{results.recommendedStreams.length > 1 ? 's' : ''}
              </h2>
              <div className="flex flex-wrap gap-3">
                {results.recommendedStreams.map(stream => {
                  const category = categories.find(cat => cat.id === stream)
                  const IconComponent = category.icon
                  return (
                    <div key={stream} className={`flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${category.color} text-white`}>
                      <IconComponent className="w-5 h-5 mr-2" />
                      <span className="font-medium capitalize">{stream}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Detailed Results */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Detailed Results
              </h2>
              <div className="space-y-4">
                {results.detailedResults.map((result, index) => {
                  const category = categories.find(cat => cat.id === result.categoryId)
                  const IconComponent = category.icon
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border-2 ${
                      result.isCorrect 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                        : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          result.isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {result.isCorrect ? 
                            <CheckCircle className="w-5 h-5 text-white" /> : 
                            <XCircle className="w-5 h-5 text-white" />
                          }
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <IconComponent className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {result.category}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white mb-2">
                            {result.question}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Your answer: <span className={result.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {result.userAnswer || 'Not answered'}
                            </span>
                          </p>
                          {!result.isCorrect && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Correct answer: <span className="text-green-600 dark:text-green-400">
                                {result.correctAnswer}
                              </span>
                            </p>
                          )}
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {result.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Quiz
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Save Results
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Career Aptitude Assessment
                </h1>
                <p className="text-blue-100">
                  Discover your academic strengths across different streams
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100">Progress</div>
                <div className="text-lg font-semibold text-white">
                  {currentStep + 1} / {categories.length}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-blue-500/30 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / categories.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {!isLoading ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Category Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${currentCategory.color} flex items-center justify-center mb-4`}>
                      <currentCategory.icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentCategory.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {currentCategory.description}
                    </p>
                  </div>

                  {/* Questions */}
                  <div className="space-y-8">
                    {currentCategory.questions.map((question, questionIndex) => (
                      <div key={question.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {questionIndex + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                              {question.text}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {question.options.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => handleAnswer(question.id, option.value)}
                                  className={`p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                                    answers[question.id] === option.value
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                                  }`}
                                >
                                  <span className="text-gray-900 dark:text-white font-medium">
                                    {option.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {isLastCategory ? (
                      <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < categories.reduce((sum, cat) => sum + cat.questions.length, 0)}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <Trophy className="w-5 h-5 mr-2" />
                        Submit Quiz
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center"
                      >
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Calculating Results...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Analyzing your responses and determining your aptitude
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Quiz