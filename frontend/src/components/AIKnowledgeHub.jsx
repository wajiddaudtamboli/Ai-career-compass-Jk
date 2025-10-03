import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AIKnowledgeHub = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularTopics, setPopularTopics] = useState([]);

  const categories = [
    { id: 'all', name: 'All Topics', icon: '🌟' },
    { id: 'scholarships', name: 'Scholarships', icon: '💰' },
    { id: 'exams', name: 'Entrance Exams', icon: '📝' },
    { id: 'colleges', name: 'Colleges', icon: '🏫' },
    { id: 'careers', name: 'Career Paths', icon: '🚀' },
    { id: 'skills', name: 'Skill Development', icon: '🎯' },
    { id: 'government', name: 'Government Jobs', icon: '🏛️' }
  ];

  const quickTopics = [
    'Top scholarships for government college students in India',
    'Upcoming government exams after B.Sc.',
    'Best engineering colleges in Jammu & Kashmir',
    'NEET preparation strategy for 2024',
    'Career options after 12th Commerce',
    'Digital marketing courses for beginners',
    'Civil services preparation guide',
    'MBA entrance exam requirements',
    'Healthcare careers in J&K',
    'Startup opportunities for students'
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Set popular topics
    setPopularTopics(quickTopics.slice(0, 6));
  }, []);

  const searchKnowledge = async (query = searchQuery) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setContent(null);

    try {
      const response = await fetch('/api/ai/knowledge-hub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: query,
          userContext: {
            userId: 'anonymous',
            location: 'Jammu & Kashmir',
            category: selectedCategory !== 'all' ? selectedCategory : undefined
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContent({
          topic: query,
          content: data.content,
          timestamp: data.timestamp
        });

        // Add to recent searches
        const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      } else {
        setContent({
          topic: query,
          content: 'Sorry, I couldn\'t find information about this topic right now. Please try again or contact our support team.',
          timestamp: new Date().toISOString(),
          isError: true
        });
      }
    } catch (error) {
      console.error('Knowledge search error:', error);
      setContent({
        topic: query,
        content: 'Unable to connect to the knowledge base. Please check your internet connection and try again.',
        timestamp: new Date().toISOString(),
        isError: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchKnowledge();
  };

  const searchTopic = (topic) => {
    setSearchQuery(topic);
    searchKnowledge(topic);
  };

  const generateDynamicContent = async (contentType) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          parameters: {
            category: selectedCategory,
            region: 'Jammu & Kashmir'
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setContent({
          topic: `Generated ${contentType.replace('_', ' ')} content`,
          content: data.content,
          timestamp: data.timestamp,
          isGenerated: true
        });
      }
    } catch (error) {
      console.error('Content generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="text-6xl mb-4">🧠</div>
            <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Knowledge Hub
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get instant, comprehensive information about careers, colleges, exams, and scholarships. 
              Powered by AI to give you the most up-to-date and relevant guidance.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className={`relative rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask me anything... e.g., 'Scholarships for engineering students in J&K'"
                className={`w-full px-6 py-4 pr-16 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white placeholder-gray-400' 
                    : 'bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <motion.button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Search</span>
                  </div>
                ) : (
                  '🔍 Search'
                )}
              </motion.button>
            </div>
          </motion.form>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence>
              {content && (
                <motion.div
                  key={content.topic}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className={`p-8 rounded-2xl shadow-lg mb-8 ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {content.topic}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span>🤖</span>
                          <span>AI-Generated</span>
                        </span>
                        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(content.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {content.isGenerated && (
                      <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs rounded-full">
                        Dynamic Content
                      </span>
                    )}
                  </div>

                  <div className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none`}>
                    <div className={`whitespace-pre-wrap leading-relaxed ${
                      content.isError 
                        ? 'text-red-600 dark:text-red-400' 
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {content.content}
                    </div>
                  </div>

                  {!content.isError && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          onClick={() => searchTopic('Related scholarship opportunities')}
                          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          💰 Related Scholarships
                        </motion.button>
                        <motion.button
                          onClick={() => searchTopic('Admission requirements and process')}
                          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          📋 Admission Process
                        </motion.button>
                        <motion.button
                          onClick={() => searchTopic('Career prospects and salary expectations')}
                          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          🚀 Career Prospects
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {isLoading && !content && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-8 rounded-2xl shadow-lg text-center ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      AI is researching your query...
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gathering the most up-to-date and relevant information
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Welcome State */}
            {!content && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-8 rounded-2xl shadow-lg text-center ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="text-6xl mb-4">🚀</div>
                <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Ready to Explore Knowledge?
                </h3>
                <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ask me anything about careers, colleges, exams, or scholarships. I'll provide you with 
                  comprehensive, up-to-date information tailored to your needs.
                </p>

                {/* Dynamic Content Generators */}
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => generateDynamicContent('faq')}
                    className={`p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700' 
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-3xl mb-2">❓</div>
                    <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Generate FAQ
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Common questions and answers
                    </p>
                  </motion.button>

                  <motion.button
                    onClick={() => generateDynamicContent('admission_guide')}
                    className={`p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700' 
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-3xl mb-2">📚</div>
                    <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Admission Guide
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Step-by-step admission process
                    </p>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Topics */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`p-6 rounded-2xl shadow-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="mr-2">🔥</span>
                Popular Topics
              </h3>
              <div className="space-y-2">
                {popularTopics.map((topic, index) => (
                  <motion.button
                    key={index}
                    onClick={() => searchTopic(topic)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={`p-6 rounded-2xl shadow-lg ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="mr-2">🕒</span>
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={index}
                      onClick={() => searchTopic(search)}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                        isDarkMode 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      {search}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className={`p-6 rounded-2xl shadow-lg ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="mr-2">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  onClick={() => window.open('/counselling', '_blank')}
                  className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  💬 Get Personal Counseling
                </motion.button>
                <motion.button
                  onClick={() => window.open('/quiz', '_blank')}
                  className={`w-full p-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🧠 Take Career Quiz
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIKnowledgeHub;