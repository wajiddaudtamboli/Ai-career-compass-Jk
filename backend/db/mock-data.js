// Mock Database for J&K Career Navigator
export const mockCareers = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'Develop software applications for IT sector in J&K',
    category: 'Technology',
    education_level: "Bachelor's Degree",
    skills_required: ['Programming', 'Problem Solving'],
    salary_range_min: 300000,
    salary_range_max: 1200000,
    location: 'Srinagar, Jammu',
    active: true
  },
  {
    id: '2',
    title: 'Medical Doctor',
    description: 'Provide healthcare services in J&K',
    category: 'Healthcare',
    education_level: 'MBBS + MD/MS',
    skills_required: ['Medical Knowledge', 'Empathy'],
    salary_range_min: 600000,
    salary_range_max: 2500000,
    location: 'Srinagar, Jammu, Leh',
    active: true
  }
];

export const mockColleges = [
  {
    id: '1',
    name: 'NIT Srinagar',
    location: 'Srinagar, Kashmir',
    college_type: 'Engineering',
    courses: ['Computer Science', 'Electrical Engineering'],
    ranking: 1,
    active: true
  }
];

export const mockQuizQuestions = [
  {
    id: '1',
    question: 'What subjects do you enjoy most?',
    question_type: 'multiple_choice',
    options: ['Science & Math', 'Arts & Literature', 'Social Studies'],
    category: 'interests',
    order_index: 1,
    active: true
  }
];
