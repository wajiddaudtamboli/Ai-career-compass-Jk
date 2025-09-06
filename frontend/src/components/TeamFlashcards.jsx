import React from 'react';

const TeamFlashcards = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Wajid Tamboli",
      role: "Team Leader",
      avatar: "👨‍💼"
    },
    {
      id: 2,
      name: "Pooja Mallelor",
      role: "Team Member",
      avatar: "👩‍💻"
    },
    {
      id: 3,
      name: "Sneha Khairate",
      role: "Team Member",
      avatar: "👩‍🎨"
    },
    {
      id: 4,
      name: "Vijayalaxmi Kamble",
      role: "Team Member",
      avatar: "👩‍🔬"
    },
    {
      id: 5,
      name: "Sanjana Waghmare",
      role: "Team Member",
      avatar: "👩‍💼"
    },
    {
      id: 6,
      name: "Priyanka Dhule",
      role: "Team Member",
      avatar: "👩‍🎓"
    },
    {
      id: 7,
      name: "Prof. V. D. Gaikwad",
      role: "Mentor",
      avatar: "👨‍🏫"
    }
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dedicated professionals working together to guide your career journey
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out p-6 text-center"
            >
              {/* Avatar */}
              <div className="mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-4xl">
                  {member.avatar}
                </div>
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {member.role}
              </p>

              {/* Decorative Element */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Team Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We are committed to helping students and professionals navigate their career paths 
              with personalized guidance, innovative tools, and expert mentorship. Together, we 
              create opportunities for growth and success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFlashcards;