import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import aiService from '../services/aiService';

const AdaptiveQuizComponent = ({ onQuizComplete, studentLevel = 'class10' }) => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [adaptive, setAdaptive] = useState(false);

  useEffect(() => {
    generateInitialQuiz();
  }, [studentLevel]);

  useEffect(() => {
    // Timer for current question
    if (quiz && currentQuestionIndex < quiz.questions.length && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [quiz, currentQuestionIndex, timeLeft]);

  const generateInitialQuiz = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const quizData = await aiService.generateAdaptiveQuiz(studentLevel, []);
      setQuiz(quizData.quiz);
      setAdaptive(quizData.adaptive);
      setTimeLeft(300);
    } catch (error) {
      setError('Failed to generate quiz. Please try again.');
      console.error('Quiz generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAdaptiveQuestions = async () => {
    setLoading(true);
    
    try {
      const quizData = await aiService.generateAdaptiveQuiz(studentLevel, answers);
      
      // Add new adaptive questions
      setQuiz(prevQuiz => ({
        ...prevQuiz,
        questions: [...prevQuiz.questions, ...quizData.quiz.questions]
      }));
      setAdaptive(true);
    } catch (error) {
      console.error('Adaptive quiz generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedOption = currentQuestion.options[optionIndex];
    
    const answerData = {
      question_id: currentQuestion.id,
      question: currentQuestion.question,
      selected_option: selectedOption,
      option_index: optionIndex,
      category: currentQuestion.category,
      difficulty: currentQuestion.difficulty,
      time_taken: 300 - timeLeft
    };

    const newAnswers = [...answers, answerData];
    setAnswers(newAnswers);

    // Track interaction
    aiService.addInteraction({
      type: 'quiz_answer',
      data: answerData
    });

    // Move to next question or evaluate
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(300);
      
      // Generate adaptive questions after every 3 answers
      if (newAnswers.length > 0 && newAnswers.length % 3 === 0 && newAnswers.length < 12) {
        generateAdaptiveQuestions();
      }
    } else {
      evaluateQuiz(newAnswers);
    }
  };

  const evaluateQuiz = async (finalAnswers) => {
    setEvaluating(true);
    
    try {
      const userProfile = aiService.getUserProfile() || {
        academic_level: studentLevel,
        location: 'Jammu & Kashmir',
        interests: []
      };

      const evaluation = await aiService.evaluateQuizResults(finalAnswers, userProfile);
      setQuizResult(evaluation.evaluation);
      
      if (onQuizComplete) {
        onQuizComplete(evaluation.evaluation);
      }
    } catch (error) {
      setError('Failed to evaluate quiz results. Please try again.');
      console.error('Quiz evaluation error:', error);
    } finally {
      setEvaluating(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!quiz || quiz.questions.length === 0) return 0;
    return Math.round((currentQuestionIndex / quiz.questions.length) * 100);
  };

  if (loading && !quiz) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-adaptive-muted">Generating adaptive quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-red-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Quiz Error</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            <button
              onClick={generateInitialQuiz}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-adaptive mb-2">Analyzing Your Responses</h3>
          <p className="text-adaptive-muted">AI is evaluating your aptitude and generating personalized career recommendations...</p>
        </div>
      </div>
    );
  }

  if (quizResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Quiz Results */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
              ✅
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-adaptive">Quiz Completed!</h3>
              <p className="text-adaptive-muted">Here's your personalized career analysis</p>
            </div>
          </div>
        </div>

        {/* Aptitude Scores */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-adaptive mb-4">Your Aptitude Profile</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(quizResult.aptitude_scores || {}).map(([skill, score]) => (
              <div key={skill} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-adaptive capitalize">
                    {skill.replace('_', ' ')}
                  </span>
                  <span className="text-lg font-bold text-primary-600">{score}/10</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Streams */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-adaptive mb-4">Recommended Academic Streams</h4>
          <div className="space-y-3">
            {quizResult.recommended_streams?.map((stream, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-adaptive">{stream.stream}</h5>
                  <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-sm font-medium">
                    {stream.match_percentage}% Match
                  </span>
                </div>
                <p className="text-adaptive-muted text-sm mb-2">{stream.reasoning}</p>
                <div className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 p-2 rounded">
                  J&K Opportunities: {stream.j_k_opportunities}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-adaptive mb-4">Top Career Recommendations</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {quizResult.career_recommendations?.slice(0, 4).map((career, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h5 className="font-semibold text-adaptive">{career.title}</h5>
                  <span className="bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 px-2 py-1 rounded text-sm">
                    {career.match_score}% Match
                  </span>
                </div>
                <p className="text-adaptive-muted text-sm mb-3">{career.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-adaptive-muted">J&K Demand:</span>
                    <span className="text-adaptive font-medium">{career.j_k_demand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-adaptive-muted">Salary Range:</span>
                    <span className="text-adaptive font-medium">{career.salary_range}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-adaptive-muted">Education:</span>
                    <span className="text-adaptive font-medium">{career.education_path}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.href = '/roadmap'}
            className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
          >
            Generate Career Roadmap
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-adaptive hover:bg-gray-50 dark:hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            View Detailed Dashboard
          </button>
          <button
            onClick={() => {
              setQuizResult(null);
              setCurrentQuestionIndex(0);
              setAnswers([]);
              generateInitialQuiz();
            }}
            className="flex-1 bg-gray-100 dark:bg-gray-600 text-adaptive hover:bg-gray-200 dark:hover:bg-gray-500 px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Retake Quiz
          </button>
        </div>
      </motion.div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-adaptive-muted">No quiz questions available.</p>
        <button
          onClick={generateInitialQuiz}
          className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
        >
          Generate Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-adaptive">AI-Powered Aptitude Assessment</h2>
            <p className="text-adaptive-muted">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
              {adaptive && <span className="ml-2 text-primary-600">(Adaptive)</span>}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">{formatTime(timeLeft)}</div>
            <div className="text-sm text-adaptive-muted">Time Remaining</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          {/* Question Category & Difficulty */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              currentQuestion.category === 'technical' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
              currentQuestion.category === 'creative' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
              currentQuestion.category === 'leadership' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
              'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
            }`}>
              {currentQuestion.category}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
              'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          {/* Question */}
          <h3 className="text-xl font-semibold text-adaptive mb-4">
            {currentQuestion.question}
          </h3>

          {/* Context (if available) */}
          {currentQuestion.context && (
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-3 mb-6">
              <p className="text-sm text-primary-700 dark:text-primary-300">
                <strong>Context:</strong> {currentQuestion.context}
              </p>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={loading}
                className="w-full text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full mr-3 flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-adaptive">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* J&K Relevance */}
          {currentQuestion.j_k_relevance && (
            <div className="mt-6 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-700 rounded-lg p-3">
              <p className="text-sm text-accent-700 dark:text-accent-300">
                <strong>J&K Relevance:</strong> {currentQuestion.j_k_relevance}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-primary-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
            Generating next adaptive question...
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveQuizComponent;
