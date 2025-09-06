// Enhanced Dynamic Home Component for J&K Career Navigator
// Fetches all content dynamically from backend API + database + Gemini API

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5002';

// Content Block Component - Renders different types of dynamic content
const ContentBlock = ({ block }) => {
  const renderBlockContent = () => {
    switch (block.block_type) {
      case 'hero':
        return (
          <motion.section 
            className="hero-section bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-5xl font-bold mb-6">{block.title}</h1>
              <h2 className="text-2xl mb-8 opacity-90">{block.subtitle}</h2>
              <p className="text-lg mb-8 max-w-3xl mx-auto opacity-80">{block.content}</p>
              {block.metadata?.cta_text && (
                <motion.a
                  href={block.metadata.cta_link}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {block.metadata.cta_text}
                </motion.a>
              )}
            </div>
          </motion.section>
        );
        
      case 'about':
        return (
          <motion.section 
            className="about-section py-16 bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">{block.title}</h2>
                <h3 className="text-xl mb-6 text-blue-600">{block.subtitle}</h3>
                <p className="text-lg text-gray-700 leading-relaxed">{block.content}</p>
                {block.metadata?.features && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {block.metadata.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="feature-card bg-white p-6 rounded-lg shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="text-blue-600 font-semibold">{feature}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        );
        
      case 'services':
        return (
          <motion.section 
            className="services-section py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">{block.title}</h2>
                <h3 className="text-xl text-blue-600">{block.subtitle}</h3>
                <p className="text-lg text-gray-700 mt-4">{block.content}</p>
              </div>
              {block.metadata?.service_items && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {block.metadata.service_items.map((service, index) => (
                    <motion.div
                      key={index}
                      className="service-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="text-3xl mb-4">
                        {getServiceIcon(service.icon)}
                      </div>
                      <h4 className="text-xl font-semibold mb-3 text-gray-800">{service.title}</h4>
                      <p className="text-gray-600">{service.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        );
        
      case 'stats':
        return (
          <motion.section 
            className="stats-section py-16 bg-blue-600 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">{block.title}</h2>
                <h3 className="text-xl opacity-90">{block.subtitle}</h3>
                <p className="text-lg opacity-80 mt-4">{block.content}</p>
              </div>
              {block.metadata?.stats && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {block.metadata.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="stat-card text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-4xl mb-2">{getServiceIcon(stat.icon)}</div>
                      <div className="text-3xl font-bold mb-2">{stat.value}</div>
                      <div className="text-lg opacity-90">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        );
        
      case 'cta':
        return (
          <motion.section 
            className="cta-section py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">{block.title}</h2>
              <h3 className="text-xl mb-6 opacity-90">{block.subtitle}</h3>
              <p className="text-lg mb-8 opacity-80">{block.content}</p>
              <div className="flex justify-center gap-4">
                {block.metadata?.primary_cta && (
                  <motion.a
                    href={block.metadata.primary_link}
                    className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {block.metadata.primary_cta}
                  </motion.a>
                )}
                {block.metadata?.secondary_cta && (
                  <motion.a
                    href={block.metadata.secondary_link}
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {block.metadata.secondary_cta}
                  </motion.a>
                )}
              </div>
            </div>
          </motion.section>
        );
        
      default:
        return (
          <div className="content-block py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-4">{block.title}</h2>
              {block.subtitle && <h3 className="text-lg mb-4 text-gray-600">{block.subtitle}</h3>}
              <p className="text-gray-700">{block.content}</p>
            </div>
          </div>
        );
    }
  };

  return renderBlockContent();
};

// Helper function to get service icons
const getServiceIcon = (iconName) => {
  const icons = {
    assessment: '📊',
    education: '🎓',
    insights: '📈',
    ai: '🤖',
    users: '👥',
    paths: '🛤️',
    colleges: '🏫',
    success: '✅'
  };
  return icons[iconName] || '⭐';
};

// Dynamic Testimonials Component
const DynamicTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/testimonials?featured=true&verified=true&limit=6`);
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="testimonials-loading py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading testimonials...</div>
        </div>
      </div>
    );
  }

  return (
    <section className="testimonials-section py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Success Stories</h2>
          <p className="text-lg text-gray-600">See how we've helped others find their ideal career paths</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="testimonial-card bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">⭐</span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.testimonial}"</p>
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
                <div className="text-blue-600">{testimonial.role}</div>
                <div className="text-gray-600 text-sm">{testimonial.company} • {testimonial.location}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Dynamic Featured Careers Component
const DynamicFeaturedCareers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCareers();
  }, []);

  const fetchFeaturedCareers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/careers?featured=true&limit=6`);
      const data = await response.json();
      if (data.success) {
        setCareers(data.data.careers);
      }
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="careers-loading py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">Loading featured careers...</div>
        </div>
      </div>
    );
  }

  return (
    <section className="featured-careers-section py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Featured Career Opportunities</h2>
          <p className="text-lg text-gray-600">Explore top career paths in Jammu & Kashmir</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careers.map((career, index) => (
            <motion.div
              key={career.id}
              className="career-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {career.category}
                </span>
                <div className="flex items-center">
                  <span className="text-yellow-400">⭐</span>
                  <span className="ml-1 text-sm text-gray-600">{career.demand_score}/10</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{career.title}</h3>
              <p className="text-gray-600 mb-4">{career.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>₹{career.salary_range_min?.toLocaleString()} - ₹{career.salary_range_max?.toLocaleString()}</span>
                <span>{career.education_level}</span>
              </div>
              <motion.a
                href={`/careers/${career.slug}`}
                className="mt-4 block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Cryptocurrency Prices Widget (Gemini API)
const CryptoPricesWidget = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCryptoPrices();
    // Update prices every 30 seconds
    const interval = setInterval(fetchCryptoPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoPrices = async () => {
    try {
      const symbols = 'btcusd,ethusd,ltcusd';
      const response = await fetch(`${API_BASE}/api/gemini/prices?symbols=${symbols}`);
      const data = await response.json();
      if (data.success) {
        setPrices(data.data.prices);
        setError(null);
      } else {
        setError('Failed to fetch prices');
      }
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="crypto-widget bg-gray-100 p-4 rounded-lg">
        <div className="animate-pulse">Loading crypto prices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crypto-widget bg-gray-100 p-4 rounded-lg text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="crypto-widget bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg text-white">
      <h3 className="text-lg font-bold mb-4">💰 Live Crypto Prices</h3>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(prices).map(([symbol, data]) => (
          <div key={symbol} className="text-center">
            <div className="font-semibold">{symbol}</div>
            <div className="text-2xl font-bold">${data.price?.toLocaleString()}</div>
            <div className="text-sm opacity-80">Vol: {data.volume?.toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="text-xs mt-2 opacity-70">
        Powered by Gemini API • Updates every 30s
      </div>
    </div>
  );
};

// Main Enhanced Dynamic Home Component
const EnhancedDynamicHome = () => {
  const [contentBlocks, setContentBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContentBlocks();
  }, []);

  const fetchContentBlocks = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/content-blocks/`);
      const data = await response.json();
      if (data.success) {
        setContentBlocks(data.data);
      } else {
        setError('Failed to fetch content');
      }
    } catch (error) {
      console.error('Error fetching content blocks:', error);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading dynamic content...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-2xl mb-4">⚠️ Error Loading Content</div>
          <div>{error}</div>
          <button 
            onClick={fetchContentBlocks}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-dynamic-home">
      {/* Render dynamic content blocks */}
      {contentBlocks.map((block, index) => (
        <ContentBlock key={block.id} block={block} />
      ))}
      
      {/* Dynamic Featured Careers Section */}
      <DynamicFeaturedCareers />
      
      {/* Dynamic Testimonials Section */}
      <DynamicTestimonials />
      
      {/* Cryptocurrency Prices Widget */}
      <section className="crypto-section py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <CryptoPricesWidget />
        </div>
      </section>
      
      {/* Dynamic Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <section className="debug-section py-8 bg-gray-800 text-white">
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-bold mb-4">🔧 Dynamic System Debug Info</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Content Blocks:</strong> {contentBlocks.length} loaded
              </div>
              <div>
                <strong>API Base:</strong> {API_BASE}
              </div>
              <div>
                <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
              </div>
              <div>
                <strong>System:</strong> Enhanced Dynamic Architecture
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default EnhancedDynamicHome;
