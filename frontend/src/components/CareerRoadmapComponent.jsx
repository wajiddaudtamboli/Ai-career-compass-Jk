import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import aiService from '../services/aiService';

const CareerRoadmapComponent = ({ studentInterests, academicLevel, targetCareer }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(0);
  const [expandedMilestone, setExpandedMilestone] = useState(null);

  useEffect(() => {
    if (studentInterests && academicLevel) {
      generateRoadmap();
    }
  }, [studentInterests, academicLevel, targetCareer]);

  const generateRoadmap = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const roadmapData = await aiService.generateCareerRoadmap(
        studentInterests,
        academicLevel,
        targetCareer
      );
      setRoadmap(roadmapData.roadmap);
      
      // Track interaction
      aiService.addInteraction({
        type: 'roadmap_generated',
        data: { academicLevel, targetCareer, pathwaysCount: roadmapData.roadmap.pathways?.length }
      });
    } catch (error) {
      setError('Failed to generate career roadmap. Please try again.');
      console.error('Roadmap generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMilestoneIcon = (type) => {
    switch (type) {
      case 'education': return '🎓';
      case 'skill': return '💪';
      case 'experience': return '💼';
      case 'certification': return '📜';
      default: return '⭐';
    }
  };

  const getMilestoneColor = (type) => {
    switch (type) {
      case 'education': return 'from-blue-500 to-blue-600';
      case 'skill': return 'from-green-500 to-green-600';
      case 'experience': return 'from-purple-500 to-purple-600';
      case 'certification': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🗺️</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-adaptive mb-2">Mapping Your Career Journey</h3>
          <p className="text-adaptive-muted">AI is creating personalized pathways based on J&K opportunities...</p>
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
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Roadmap Error</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            <button
              onClick={generateRoadmap}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap || !roadmap.pathways) {
    return (
      <div className="text-center py-8">
        <p className="text-adaptive-muted">No roadmap data available.</p>
        <button
          onClick={generateRoadmap}
          className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
        >
          Generate Roadmap
        </button>
      </div>
    );
  }

  const currentPathway = roadmap.pathways[selectedPathway];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-700">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl">
            🗺️
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-adaptive">Your AI-Generated Career Roadmap</h2>
            <p className="text-adaptive-muted">Personalized pathways tailored for Jammu & Kashmir opportunities</p>
          </div>
        </div>
        
        {targetCareer && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
            <span className="text-sm text-adaptive-muted">Target Career:</span>
            <span className="ml-2 font-semibold text-primary-600">{targetCareer}</span>
          </div>
        )}
      </div>

      {/* Pathway Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-adaptive mb-4">Choose Your Career Pathway</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmap.pathways.map((pathway, index) => (
            <motion.div
              key={pathway.id}
              onClick={() => setSelectedPathway(index)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedPathway === index
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                  : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-adaptive">{pathway.title}</h4>
                <span className="bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 px-2 py-1 rounded text-sm">
                  {pathway.suitability_score}% Match
                </span>
              </div>
              <p className="text-sm text-adaptive-muted mb-3">{pathway.description}</p>
              <div className="flex justify-between text-xs text-adaptive-muted">
                <span>Timeline: {pathway.timeline_years} years</span>
                <span>{pathway.milestones?.length || 0} milestones</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Pathway Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pathway Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-adaptive mb-4">
            {currentPathway.title} - Timeline
          </h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-secondary-500"></div>
            
            {/* Milestones */}
            <div className="space-y-6">
              {currentPathway.milestones?.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-12"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-3 w-6 h-6 bg-gradient-to-br ${getMilestoneColor(milestone.type)} rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold`}>
                    {milestone.year}
                  </div>
                  
                  {/* Milestone Content */}
                  <div 
                    className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      expandedMilestone === index ? 'shadow-lg' : 'hover:shadow-md'
                    }`}
                    onClick={() => setExpandedMilestone(expandedMilestone === index ? null : index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getMilestoneIcon(milestone.type)}</span>
                        <h4 className="font-semibold text-adaptive">{milestone.title}</h4>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        milestone.type === 'education' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        milestone.type === 'skill' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        milestone.type === 'experience' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {milestone.type}
                      </span>
                    </div>
                    
                    <p className="text-adaptive-muted text-sm mb-3">{milestone.description}</p>
                    
                    <AnimatePresence>
                      {expandedMilestone === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 border-t border-gray-200 dark:border-gray-600 pt-3"
                        >
                          {milestone.j_k_institutions && milestone.j_k_institutions.length > 0 && (
                            <div>
                              <h5 className="font-medium text-adaptive mb-1">J&K Institutions:</h5>
                              <ul className="text-sm text-adaptive-muted list-disc list-inside">
                                {milestone.j_k_institutions.map((institution, idx) => (
                                  <li key={idx}>{institution}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {milestone.requirements && milestone.requirements.length > 0 && (
                            <div>
                              <h5 className="font-medium text-adaptive mb-1">Requirements:</h5>
                              <ul className="text-sm text-adaptive-muted list-disc list-inside">
                                {milestone.requirements.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {milestone.outcomes && milestone.outcomes.length > 0 && (
                            <div>
                              <h5 className="font-medium text-adaptive mb-1">Expected Outcomes:</h5>
                              <ul className="text-sm text-adaptive-muted list-disc list-inside">
                                {milestone.outcomes.map((outcome, idx) => (
                                  <li key={idx}>{outcome}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Pathway Information Sidebar */}
        <div className="space-y-6">
          {/* Pathway Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-adaptive mb-4">Pathway Overview</h4>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-adaptive-muted">Suitability Score:</span>
                <div className="flex items-center mt-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                      style={{ width: `${currentPathway.suitability_score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-primary-600">{currentPathway.suitability_score}%</span>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-adaptive-muted">Timeline:</span>
                <p className="font-medium text-adaptive">{currentPathway.timeline_years} years</p>
              </div>
              
              <div>
                <span className="text-sm text-adaptive-muted">Growth Potential:</span>
                <p className="text-sm text-adaptive">{currentPathway.growth_potential}</p>
              </div>
              
              <div>
                <span className="text-sm text-adaptive-muted">Salary Progression:</span>
                <p className="text-sm text-adaptive">{currentPathway.salary_progression}</p>
              </div>
            </div>
          </div>

          {/* J&K Advantages */}
          <div className="bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 rounded-xl p-6 border border-accent-200 dark:border-accent-700">
            <h4 className="text-lg font-semibold text-adaptive mb-3">J&K Regional Advantages</h4>
            <p className="text-sm text-adaptive-muted">{currentPathway.j_k_advantages}</p>
          </div>

          {/* Success Stories */}
          {currentPathway.success_stories && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
              <h4 className="text-lg font-semibold text-adaptive mb-3">Success Stories</h4>
              <p className="text-sm text-adaptive-muted">{currentPathway.success_stories}</p>
            </div>
          )}
        </div>
      </div>

      {/* Skills Matrix */}
      {roadmap.skills_matrix && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-adaptive mb-4">Required Skills Development</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-adaptive mb-3">Technical Skills</h4>
              <div className="space-y-2">
                {roadmap.skills_matrix.technical_skills?.map((skill, index) => (
                  <span key={index} className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-sm mr-2 mb-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-adaptive mb-3">Soft Skills</h4>
              <div className="space-y-2">
                {roadmap.skills_matrix.soft_skills?.map((skill, index) => (
                  <span key={index} className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded text-sm mr-2 mb-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-adaptive mb-3">J&K Specific Skills</h4>
              <div className="space-y-2">
                {roadmap.skills_matrix.j_k_specific_skills?.map((skill, index) => (
                  <span key={index} className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-sm mr-2 mb-2">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Government Support */}
      {roadmap.government_support && roadmap.government_support.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-adaptive mb-4">Government Support & Schemes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.government_support.map((scheme, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-adaptive mb-2">{scheme.scheme_name}</h4>
                <p className="text-sm text-adaptive-muted mb-2">{scheme.description}</p>
                <div className="text-xs text-adaptive-muted">
                  <div><strong>Eligibility:</strong> {scheme.eligibility}</div>
                  <div><strong>Application:</strong> {scheme.application_process}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
        >
          Add to Dashboard
        </button>
        <button
          onClick={() => window.location.href = '/colleges'}
          className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-adaptive hover:bg-gray-50 dark:hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-all duration-200"
        >
          Find Colleges
        </button>
        <button
          onClick={() => {
            const roadmapText = JSON.stringify(roadmap, null, 2);
            const blob = new Blob([roadmapText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'career-roadmap.json';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex-1 bg-gray-100 dark:bg-gray-600 text-adaptive hover:bg-gray-200 dark:hover:bg-gray-500 px-6 py-3 rounded-lg font-medium transition-all duration-200"
        >
          Export Roadmap
        </button>
      </div>
    </div>
  );
};

export default CareerRoadmapComponent;
