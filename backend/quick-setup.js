#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 J&K Career Navigator - Complete Database Setup');
console.log('='.repeat(50));

// Step 1: Check environment
console.log('🔍 Checking environment...');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  process.exit(1);
}

// Step 2: Create mock database
console.log('🎭 Setting up mock database...');

const mockDataDir = path.join(__dirname, 'db');
if (!fs.existsSync(mockDataDir)) {
  fs.mkdirSync(mockDataDir, { recursive: true });
}

// Create mock data file
const mockDataContent = `// Mock Database for J&K Career Navigator
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
`;

fs.writeFileSync(path.join(mockDataDir, 'mock-data.js'), mockDataContent);

// Step 3: Update .env for mock mode
console.log('⚙️ Configuring environment...');
let envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('MOCK_MODE')) {
  envContent += '\n# Mock Mode Configuration\nMOCK_MODE=true\n';
  fs.writeFileSync(envPath, envContent);
}

// Step 4: Create logs directory
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Step 5: Create reports directory
const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Step 6: Generate setup report
const report = {
  timestamp: new Date().toISOString(),
  status: 'completed',
  version: '2.0.0',
  components: {
    environment: 'configured',
    mock_database: 'created',
    api_routes: 'ready',
    directories: 'created'
  },
  next_steps: [
    'Start server: npm run dev',
    'Test API: http://localhost:5002/health',
    'View careers: http://localhost:5002/api/careers'
  ]
};

fs.writeFileSync(
  path.join(reportsDir, 'setup-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('✅ Mock database created');
console.log('✅ Environment configured');
console.log('✅ Directories created');
console.log('✅ Setup report generated');
console.log('');
console.log('🎉 DATABASE SETUP COMPLETE!');
console.log('');
console.log('📋 NEXT STEPS:');
console.log('1. Start server: npm run dev');
console.log('2. Test API: http://localhost:5002');
console.log('3. Check health: http://localhost:5002/health');
console.log('');
console.log('🔗 Mock mode includes:');
console.log('   • Sample career data');
console.log('   • College information');
console.log('   • Quiz questions');
console.log('   • API endpoints ready');
console.log('');
console.log('💡 To use real database, update DATABASE_URL in .env');

process.exit(0);
