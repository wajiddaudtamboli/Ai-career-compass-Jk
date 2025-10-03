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
      id: 'science',
      name: 'Science Stream Questions',
      description: 'Test your knowledge in Science subjects (Class 10 Level)',
      icon: '�',
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
      icon: '💼',
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
      icon: '�',
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
          explanation: 'Pointillism is a painting technique using small distinct dots of color',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'art_3',
          text: 'Which color do you get by mixing blue and yellow?',
          options: [
            { value: 'red', label: 'Red', isCorrect: false },
            { value: 'purple', label: 'Purple', isCorrect: false },
            { value: 'green', label: 'Green', isCorrect: true },
            { value: 'orange', label: 'Orange', isCorrect: false }
          ],
          correctAnswer: 'green',
          explanation: 'Blue and yellow are primary colors that combine to create green (secondary color)',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'art_4',
          text: 'Which Indian artist is famous for bold modern paintings and abstract art?',
          options: [
            { value: 'rajaravi', label: 'Raja Ravi Varma', isCorrect: false },
            { value: 'amrita', label: 'Amrita Sher-Gil', isCorrect: false },
            { value: 'husain', label: 'M.F. Husain', isCorrect: true },
            { value: 'tagore', label: 'Rabindranath Tagore', isCorrect: false }
          ],
          correctAnswer: 'husain',
          explanation: 'M.F. Husain was a prominent Indian modernist painter known for bold abstract works',
          difficulty: 'Easy',
          gradeLevel: 10
        },
        {
          id: 'art_5',
          text: 'Which of the following is a Japanese art of paper folding?',
          options: [
            { value: 'calligraphy', label: 'Calligraphy', isCorrect: false },
            { value: 'origami', label: 'Origami', isCorrect: true },
            { value: 'ikebana', label: 'Ikebana', isCorrect: false },
            { value: 'sumie', label: 'Sumi-e', isCorrect: false }
          ],
          correctAnswer: 'origami',
          explanation: 'Origami is the traditional Japanese art of paper folding into decorative shapes',
          difficulty: 'Easy',
          gradeLevel: 10
        }
      ]
    }
  ]

  const careerRecommendations = {
    science: { 
      name: 'Science Stream', 
      careers: ['Medicine (MBBS/BDS)', 'Engineering (B.Tech)', 'Research Scientist', 'Biotechnology', 'Pharmacy', 'Nursing'],
      description: 'Perfect for students interested in scientific research, healthcare, and technology'
    },
    commerce: { 
      name: 'Commerce Stream', 
      careers: ['Business Management (BBA)', 'Chartered Accountant (CA)', 'Economics', 'Banking & Finance', 'Company Secretary (CS)', 'Digital Marketing'],
      description: 'Ideal for students interested in business, finance, and entrepreneurship'
    },
    arts: { 
      name: 'Arts Stream', 
      careers: ['Literature & Languages (BA)', 'Psychology', 'Social Work', 'Journalism', 'Fine Arts', 'History & Archaeology'],
      description: 'Great for creative minds interested in humanities, social sciences, and creative fields'
    }
  }

  const handleAnswerSelect = (questionId, answer, question) => {
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: {
        ...answer,
        isCorrect: answer.value === question.correctAnswer,
        explanation: question.explanation
      }
    }))
  }

  const calculateResults = () => {
    setIsLoading(true)
    
    // Simulate calculation delay
    setTimeout(() => {
      const scores = {
        science: 0,
        commerce: 0,
        arts: 0
      }
      
      let totalCorrect = 0
      let totalQuestions = 0

      // Calculate scores based on correct answers per stream
      categories.forEach(category => {
        let streamCorrect = 0
        category.questions.forEach(question => {
          totalQuestions++
          const answer = answers[question.id]
          if (answer && answer.value === question.correctAnswer) {
            streamCorrect++
            totalCorrect++
          }
        })
        
        // Calculate percentage for this stream
        const streamPercentage = (streamCorrect / category.questions.length) * 100
        scores[category.id] = streamPercentage
      })

      // Sort by highest scores
      const sortedScores = Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)

      const recommendations = sortedScores.map(([field, score]) => ({
        field,
        score: Math.round(score),
        percentage: Math.round(score),
        ...careerRecommendations[field]
      }))

      setResults({
        topRecommendations: recommendations,
        allScores: scores,
        totalQuestions: totalQuestions,
        answeredQuestions: Object.keys(answers).length,
        totalCorrect: totalCorrect,
        overallPercentage: Math.round((totalCorrect / totalQuestions) * 100)
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
          <h2 className="text-2xl font-bold text-gradient mb-2">Calculating Your Scores</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Evaluating your performance across different streams to recommend the best path for you...
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
            <h1 className="heading-2 text-gradient mb-4">Your Quiz Results</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Based on your performance, here are your recommended streams for Class 11
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl mb-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gradient mb-2">Overall Performance</h3>
                <div className="text-4xl font-bold text-primary-600 mb-2">{results.overallPercentage}%</div>
                <p className="text-gray-600 dark:text-gray-400">
                  You answered {results.totalCorrect} out of {results.totalQuestions} questions correctly
                </p>
              </div>
            </div>
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

                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {recommendation.description}
                  </p>
                  <h4 className="font-semibold mb-3">Recommended Career Paths:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recommendation.careers.map((career, careerIndex) => (
                      <motion.div
                        key={career}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + careerIndex * 0.1 + 1 }}
                        className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center font-medium shadow-sm border-l-4 border-primary-500"
                      >
                        {career}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Performance in this stream */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Your Performance in {recommendation.name}:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You scored {recommendation.percentage}% in this stream's questions
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Answer Review */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gradient mb-6 text-center">Answer Review</h2>
            <div className="space-y-6">
              {categories.map((category, categoryIndex) => (
                <div key={category.id} className="glass-light p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    {category.name}
                  </h3>
                  <div className="space-y-4">
                    {category.questions.map((question, questionIndex) => {
                      const userAnswer = answers[question.id]
                      const isCorrect = userAnswer?.value === question.correctAnswer
                      return (
                        <div key={question.id} className={`p-4 rounded-lg border-2 ${\n                          isCorrect \n                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'\n                            : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'\n                        }`}>\n                          <div className="flex items-start justify-between mb-2">\n                            <h4 className="font-semibold text-gray-800 dark:text-white">\n                              {questionIndex + 1}. {question.text}\n                            </h4>\n                            <span className={`px-2 py-1 rounded text-sm font-medium ${\n                              isCorrect \n                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'\n                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'\n                            }`}>\n                              {isCorrect ? '✓ Correct' : '✗ Incorrect'}\n                            </span>\n                          </div>\n                          <div className="text-sm space-y-2">\n                            <p className="text-gray-600 dark:text-gray-400">\n                              <strong>Your Answer:</strong> {userAnswer?.label || 'Not answered'}\n                            </p>\n                            {!isCorrect && (\n                              <p className="text-gray-600 dark:text-gray-400">\n                                <strong>Correct Answer:</strong> {question.options.find(opt => opt.value === question.correctAnswer)?.label}\n                              </p>\n                            )}\n                            <p className="text-gray-700 dark:text-gray-300 italic">\n                              <strong>Explanation:</strong> {question.explanation}\n                            </p>\n                          </div>\n                        </div>\n                      )\n                    })}\n                  </div>\n                </div>\n              ))}\n            </div>\n          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="text-center mt-12"
          >
            <div className="space-y-4">
              <button
                onClick={resetQuiz}
                className="btn-primary mr-4"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => window.location.href = '/colleges'}
                className="btn-secondary"
              >
                Explore Colleges
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Based on your performance, consider the recommended stream for your Class 11 selection
            </p>
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
          <h1 className="heading-2 text-gradient mb-4">Stream Selection Quiz</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Test your knowledge in different subjects to discover which stream suits you best for Class 11
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
                          onChange={() => handleAnswerSelect(question.id, option, question)}
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
