-- Sample data for AI Career Compass J&K
-- This file contains authentic data relevant to Jammu & Kashmir region

-- Insert careers data
INSERT INTO careers (title, description, category, education_level, skills_required, salary_range_min, salary_range_max, location, company_types, growth_prospects, opportunities_in_jk, requirements) VALUES

-- Technology Careers
('Software Engineer', 'Develop and maintain software applications, websites, and mobile apps. High demand in emerging IT sector of J&K.', 'Technology', 'Bachelor''s Degree', '["Programming", "Problem Solving", "Teamwork", "Communication"]', 300000, 1200000, 'Srinagar, Jammu', '["IT Companies", "Startups", "Government", "E-commerce"]', 'Excellent growth with government push for IT sector in J&K. New IT parks coming up.', 'Growing IT sector with government initiatives, startup incubation centers in Srinagar and Jammu. Companies like TCS, Infosys setting up offices.', 'B.Tech/B.E in Computer Science, IT, or related field. Strong programming skills in Java, Python, or similar languages.'),

('Data Scientist', 'Analyze large datasets to derive business insights and build predictive models. Emerging field with applications in agriculture, tourism, governance.', 'Technology', 'Master''s Degree', '["Statistics", "Machine Learning", "Python", "SQL", "Data Visualization"]', 500000, 1800000, 'Srinagar, Jammu', '["Government", "Research Institutes", "IT Companies", "Agricultural Organizations"]', 'High demand expected as J&K focuses on data-driven governance and smart agriculture.', 'Government initiatives for digital J&K creating opportunities. Agriculture analytics, tourism insights, and governance applications.', 'Master''s in Data Science, Statistics, Computer Science. Experience with Python, R, SQL, and ML frameworks.'),

('Mobile App Developer', 'Create mobile applications for Android and iOS platforms. Growing demand for local language apps and tourism-related applications.', 'Technology', 'Bachelor''s Degree', '["Mobile Development", "UI/UX Design", "Programming", "Problem Solving"]', 250000, 1000000, 'Srinagar, Jammu', '["Startups", "IT Companies", "Tourism Companies", "Government"]', 'Strong growth potential with focus on local apps, tourism, and governance solutions.', 'Opportunities in developing tourism apps, local language apps, and government service applications.', 'B.Tech in Computer Science or related field. Experience with React Native, Flutter, or native development.'),

-- Healthcare Careers
('Medical Doctor', 'Provide medical care and treatment to patients. Critical need in J&K healthcare system.', 'Healthcare', 'MBBS + MD/MS', '["Medical Knowledge", "Empathy", "Communication", "Problem Solving", "Leadership"]', 600000, 2500000, 'Srinagar, Jammu, Leh', '["Government Hospitals", "Private Hospitals", "Clinics", "Medical Colleges"]', 'Excellent prospects with government healthcare expansion and medical tourism growth.', 'High demand due to shortage of doctors. New medical colleges being established. Medical tourism potential.', 'MBBS degree, followed by MD/MS specialization. Clear NEET examination.'),

('Physiotherapist', 'Help patients recover from injuries and improve physical mobility. Growing awareness about physiotherapy in the region.', 'Healthcare', 'Bachelor''s Degree', '["Anatomy Knowledge", "Manual Therapy", "Patient Care", "Communication"]', 200000, 800000, 'Srinagar, Jammu', '["Hospitals", "Clinics", "Sports Centers", "Rehabilitation Centers"]', 'Growing field with increasing awareness about physical therapy and sports medicine.', 'Opportunities in hospitals, sports medicine for local athletes, and rehabilitation centers.', 'Bachelor''s in Physiotherapy (BPT). License from respective state council.'),

-- Tourism & Hospitality
('Hotel Manager', 'Manage hotel operations, ensure guest satisfaction, and oversee staff. Crucial for J&K''s tourism industry.', 'Tourism & Hospitality', 'Bachelor''s Degree', '["Management", "Customer Service", "Leadership", "Communication", "Problem Solving"]', 300000, 1200000, 'Srinagar, Gulmarg, Pahalgam, Leh', '["Hotels", "Resorts", "Houseboats", "Tourism Companies"]', 'Excellent growth with tourism revival and new hospitality projects.', 'Booming tourism industry offers great opportunities. Government focus on promoting tourism.', 'Bachelor''s in Hotel Management, Tourism, or related field. Experience in hospitality industry preferred.'),

('Tour Guide', 'Guide tourists, provide information about local attractions, history, and culture. Essential for J&K tourism.', 'Tourism & Hospitality', 'Any Degree', '["Communication", "Local Knowledge", "Languages", "Customer Service"]', 150000, 500000, 'Srinagar, Gulmarg, Pahalgam, Leh, Jammu', '["Tourism Companies", "Government Tourism", "Independent", "Hotels"]', 'Good prospects with tourism growth and government certification programs.', 'High demand due to increasing tourist footfall. Government training and certification programs available.', 'Any graduate degree. Knowledge of local history, culture, and languages. Tourism department certification preferred.'),

-- Agriculture & Allied
('Agricultural Engineer', 'Develop and implement agricultural technology solutions. Important for modernizing J&K agriculture.', 'Agriculture', 'Bachelor''s Degree', '["Agricultural Technology", "Engineering", "Problem Solving", "Project Management"]', 250000, 800000, 'Srinagar, Jammu, Rural Areas', '["Government", "Agricultural Companies", "NGOs", "Research Institutes"]', 'Good prospects with focus on agricultural modernization and technology adoption.', 'Government initiatives for modern agriculture. Opportunities in irrigation, food processing, and agricultural technology.', 'B.Tech in Agricultural Engineering or related field. Knowledge of modern agricultural practices.'),

('Horticulturist', 'Specialize in fruit cultivation, especially apples, which are J&K''s major crop. Also work with saffron cultivation.', 'Agriculture', 'Bachelor''s Degree', '["Plant Science", "Cultivation Techniques", "Research", "Problem Solving"]', 200000, 700000, 'Kashmir Valley, Jammu', '["Government", "Agricultural Universities", "Private Farms", "Research Institutes"]', 'Strong prospects given J&K''s strength in horticulture, especially apple and saffron.', 'Major opportunities in apple cultivation, saffron farming, and fruit processing. Government support available.', 'B.Sc in Horticulture or related field. Knowledge of fruit cultivation and post-harvest management.'),

-- Government & Administration
('Administrative Officer', 'Manage government departments and implement policies. Important role in governance and public service.', 'Government', 'Bachelor''s Degree', '["Administration", "Leadership", "Communication", "Policy Implementation", "Problem Solving"]', 400000, 1500000, 'Srinagar, Jammu, District Headquarters', '["State Government", "Central Government", "Public Sector Units"]', 'Stable career with good growth prospects. Regular recruitment through competitive exams.', 'Regular recruitment for various administrative positions. Good career progression opportunities.', 'Bachelor''s degree in any field. Clear competitive exams like KAS, IAS, or other administrative service exams.'),

('Police Officer', 'Maintain law and order, investigate crimes, and ensure public safety. Critical for security and peace.', 'Government', 'Bachelor''s Degree', '["Leadership", "Physical Fitness", "Investigation", "Communication", "Decision Making"]', 300000, 1200000, 'Throughout J&K', '["J&K Police", "Central Police Forces", "Special Forces"]', 'Stable career with opportunities for specialization and career advancement.', 'Regular recruitment for constables to IPS officers. Special opportunities in security and counter-terrorism.', 'Bachelor''s degree. Physical fitness requirements. Clear competitive exams and physical tests.'),

-- Education
('School Teacher', 'Educate students at primary, secondary, or higher secondary level. Crucial for educational development.', 'Education', 'Bachelor''s Degree + B.Ed', '["Subject Knowledge", "Communication", "Patience", "Classroom Management", "Empathy"]', 200000, 600000, 'Throughout J&K', '["Government Schools", "Private Schools", "Coaching Institutes"]', 'Stable career with social impact. Regular recruitment and promotions available.', 'High demand for quality teachers. Government focus on improving education infrastructure.', 'Bachelor''s degree in relevant subject plus B.Ed. Clear Teacher Eligibility Test (TET).'),

('College Professor', 'Teach undergraduate and postgraduate students, conduct research. Important for higher education development.', 'Education', 'Master''s Degree + PhD', '["Subject Expertise", "Research", "Communication", "Leadership", "Innovation"]', 400000, 1200000, 'Srinagar, Jammu, Other College Towns', '["Government Colleges", "Universities", "Private Colleges"]', 'Good prospects with expansion of higher education and new universities.', 'New universities and colleges being established. Research opportunities available.', 'Master''s degree in relevant subject, PhD preferred. Clear NET/SET examinations.'),

-- Arts & Media
('Journalist', 'Report news, investigate stories, and inform the public. Important for democracy and transparency.', 'Media', 'Bachelor''s Degree', '["Writing", "Communication", "Investigation", "Digital Media", "Languages"]', 200000, 800000, 'Srinagar, Jammu', '["Newspapers", "TV Channels", "Digital Media", "Freelance"]', 'Evolving field with digital media growth and need for local content.', 'Local media houses and national media presence. Opportunities in digital journalism and local language content.', 'Bachelor''s in Journalism, Mass Communication, or related field. Strong writing and communication skills.'),

('Graphic Designer', 'Create visual content for digital and print media. Growing demand with digital marketing growth.', 'Creative', 'Bachelor''s Degree', '["Design Software", "Creativity", "Visual Communication", "Branding"]', 180000, 600000, 'Srinagar, Jammu', '["Advertising Agencies", "IT Companies", "Startups", "Freelance"]', 'Good growth potential with digital marketing and e-commerce expansion.', 'Growing demand from local businesses, tourism sector, and digital marketing agencies.', 'Bachelor''s in Graphic Design, Fine Arts, or related field. Proficiency in design software like Adobe Creative Suite.');

-- Insert colleges data
INSERT INTO colleges (name, location, college_type, courses, facilities, contact_info, website, established_year, ranking, fees_range, admission_process, eligibility, placements) VALUES

-- Engineering Colleges
('National Institute of Technology (NIT) Srinagar', 'Srinagar, Kashmir', 'Engineering', 
'["Computer Science Engineering", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Electronics & Communication", "Chemical Engineering"]',
'["Central Library", "Computer Labs", "Research Labs", "Hostel Facilities", "Sports Complex", "Auditorium", "Medical Facility"]',
'{"phone": "0194-2420475", "email": "registrar@nitsri.ac.in", "address": "Hazratbal, Srinagar-190006"}',
'https://www.nitsri.ac.in', 1960, 1,
'{"tuition_fee_per_year": 165000, "hostel_fee_per_year": 45000, "total_approximate": 210000}',
'JEE Main followed by JoSAA counseling', 
'{"jee_main_rank": "Required", "12th_percentage": "75% minimum", "subjects": "Physics, Chemistry, Mathematics"}',
'{"average_package": 800000, "highest_package": 2500000, "placement_percentage": 85, "top_recruiters": ["TCS", "Infosys", "Microsoft", "Google", "Amazon"]}'),

('Islamic University of Science and Technology (IUST)', 'Awantipora, Kashmir', 'Engineering & Technology',
'["Computer Science", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Food Technology", "MBA", "MCA"]',
'["Modern Labs", "Library", "Hostels", "Sports Facilities", "Medical Center", "Mosque", "Cafeteria"]',
'{"phone": "01933-247955", "email": "info@islamicuniversity.edu.in", "address": "Awantipora, Pulwama-192122"}',
'https://www.islamicuniversity.edu.in', 2005, 2,
'{"tuition_fee_per_year": 45000, "hostel_fee_per_year": 25000, "total_approximate": 70000}',
'IUST Entrance Test or JEE Main',
'{"entrance_test": "IUST CET or JEE Main", "12th_percentage": "50% minimum", "subjects": "PCM for Engineering"}',
'{"average_package": 400000, "highest_package": 1200000, "placement_percentage": 70, "top_recruiters": ["Wipro", "Cognizant", "HCL", "Tech Mahindra"]}'),

('SSM College of Engineering & Technology', 'Pattan, Kashmir', 'Engineering',
'["Computer Science", "Electronics & Communication", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"]',
'["Computer Labs", "Workshop", "Library", "Hostels", "Sports Ground", "Auditorium"]',
'{"phone": "01954-293204", "email": "principal@ssmcet.org", "address": "Pattan, Baramulla-193121"}',
'https://www.ssmcet.org', 2001, 3,
'{"tuition_fee_per_year": 65000, "hostel_fee_per_year": 30000, "total_approximate": 95000}',
'JKCET (J&K Common Entrance Test)',
'{"entrance_test": "JKCET", "12th_percentage": "45% minimum", "subjects": "Physics, Chemistry, Mathematics"}',
'{"average_package": 350000, "highest_package": 800000, "placement_percentage": 60, "top_recruiters": ["Local IT Companies", "Construction Companies", "Government Sector"]}'),

-- Medical Colleges
('Government Medical College (GMC) Srinagar', 'Srinagar, Kashmir', 'Medical',
'["MBBS", "MD", "MS", "Diploma Courses", "Nursing", "Paramedical"]',
'["Hospital Attached", "Modern Labs", "Library", "Research Facilities", "Hostel", "Anatomy Museum"]',
'{"phone": "0194-2503219", "email": "principalgmcsrinagar@gmail.com", "address": "Karan Nagar, Srinagar-190010"}',
'https://www.gmcsrinagar.edu.in', 1959, 1,
'{"tuition_fee_per_year": 15000, "hostel_fee_per_year": 12000, "total_approximate": 27000}',
'NEET-UG for MBBS, NEET-PG for PG courses',
'{"neet_score": "Required as per cutoff", "12th_percentage": "50% minimum", "subjects": "Physics, Chemistry, Biology"}',
'{"government_quota": "85%", "private_practice": "High scope", "specialization_opportunities": "Excellent"}'),

('Government Medical College (GMC) Jammu', 'Jammu', 'Medical',
'["MBBS", "MD", "MS", "BDS", "Nursing", "Physiotherapy", "Pharmacy"]',
'["Associated Hospital", "Labs", "Library", "Research Centers", "Hostels", "Sports Complex"]',
'{"phone": "0191-2548289", "email": "principalgmcjammu@gmail.com", "address": "Sector 5, Bhagwati Nagar, Jammu-180016"}',
'https://www.gmcjammu.nic.in', 1973, 2,
'{"tuition_fee_per_year": 18000, "hostel_fee_per_year": 15000, "total_approximate": 33000}',
'NEET-UG and NEET-PG based admissions',
'{"neet_score": "As per state cutoff", "12th_percentage": "50% minimum", "subjects": "PCB mandatory"}',
'{"government_jobs": "High probability", "private_practice": "Good scope", "hospital_attachments": "Available"}'),

-- Arts & Commerce Colleges
('University of Kashmir', 'Srinagar, Kashmir', 'University',
'["BA", "BSc", "BCom", "MA", "MSc", "MCom", "MBA", "Law", "Education", "Social Work"]',
'["Central Library", "Computer Centers", "Hostels", "Sports Complex", "Cultural Center", "Research Labs"]',
'{"phone": "0194-2414049", "email": "registrar@kashmiruniversity.ac.in", "address": "Hazratbal, Srinagar-190006"}',
'https://www.kashmiruniversity.ac.in', 1948, 1,
'{"tuition_fee_per_year": 5000, "hostel_fee_per_year": 8000, "total_approximate": 13000}',
'Merit-based admission, some courses have entrance tests',
'{"12th_percentage": "Varies by course", "entrance_test": "For some professional courses"}',
'{"government_jobs": "Good opportunities", "private_sector": "Growing", "higher_studies": "Excellent scope"}'),

('University of Jammu', 'Jammu', 'University',
'["BA", "BSc", "BCom", "BBA", "BCA", "MA", "MSc", "MBA", "Law", "Education", "Mass Communication"]',
'["Library", "Computer Labs", "Hostels", "Sports Facilities", "Auditorium", "Research Centers"]',
'{"phone": "0191-2435142", "email": "registrar@jammuuniversity.ac.in", "address": "Baba Saheb Ambedkar Road, Jammu-180006"}',
'https://www.jammuuniversity.ac.in', 1969, 2,
'{"tuition_fee_per_year": 6000, "hostel_fee_per_year": 10000, "total_approximate": 16000}',
'Merit-based and entrance test based',
'{"12th_percentage": "50% minimum", "entrance_tests": "For professional courses"}',
'{"placement_cell": "Active", "industry_connections": "Good", "alumni_network": "Strong"}'),

-- Specific Mentioned College
('N.K. Orchid College of Engineering and Technology', 'Solapur', 'Engineering',
'["Computer Science Engineering", "Information Technology", "Electronics Engineering", "Mechanical Engineering", "Civil Engineering"]',
'["Modern Labs", "Library", "Workshops", "Hostels", "Sports Ground", "Placement Cell", "Industry Partnerships"]',
'{"phone": "9667033839", "email": "wajiddaudtamboli123@gmail.com", "address": "N.K. Orchid College of Engineering and Technology, Solapur"}',
'https://www.nkorchid.edu.in', 2010, 3,
'{"tuition_fee_per_year": 75000, "hostel_fee_per_year": 35000, "total_approximate": 110000}',
'JEE Main, MHT-CET, or College Entrance Test',
'{"entrance_test": "JEE Main/MHT-CET", "12th_percentage": "50% minimum", "subjects": "Physics, Chemistry, Mathematics"}',
'{"average_package": 450000, "highest_package": 1000000, "placement_percentage": 75, "industry_partnerships": "Strong"}');

-- Insert quiz questions
INSERT INTO quiz_questions (question, question_type, options, category, order_index) VALUES
('What type of work environment do you prefer?', 'multiple_choice', '["Office environment", "Outdoor/Field work", "Laboratory/Research", "Home/Remote work", "Hospital/Clinical setting"]', 'work_environment', 1),
('Which subjects did you enjoy most in school?', 'multiple_choice', '["Mathematics and Physics", "Biology and Chemistry", "Languages and Literature", "History and Social Studies", "Arts and Crafts", "Computer Science"]', 'interests', 2),
('What motivates you the most in a career?', 'multiple_choice', '["High salary and financial security", "Helping others and making a difference", "Creative expression and innovation", "Leadership and management", "Research and discovery", "Adventure and travel"]', 'motivation', 3),
('How do you prefer to work?', 'multiple_choice', '["Independently", "In small teams", "In large teams", "Leading others", "Following instructions", "Mix of individual and team work"]', 'work_style', 4),
('What is your preferred work schedule?', 'multiple_choice', '["Regular 9-5 hours", "Flexible hours", "Shift work", "Seasonal work", "Project-based deadlines", "Emergency/on-call work"]', 'schedule', 5),
('Which skills do you consider your strongest?', 'multiple_choice', '["Problem solving and analytical thinking", "Communication and interpersonal skills", "Creative and artistic abilities", "Technical and computer skills", "Leadership and management", "Physical and hands-on work"]', 'skills', 6),
('What level of education are you willing to pursue?', 'multiple_choice', '["High school diploma", "Certificate/Diploma courses", "Bachelor''s degree", "Master''s degree", "Professional degree (MBBS, Engineering)", "Doctoral degree (PhD)"]', 'education', 7),
('In which location would you prefer to work?', 'multiple_choice', '["Major cities (Srinagar, Jammu)", "Small towns in J&K", "Rural areas", "Outside J&K in India", "International locations", "Remote work from anywhere"]', 'location', 8),
('What type of impact do you want to make?', 'multiple_choice', '["Economic development", "Healthcare and wellness", "Education and knowledge", "Environmental conservation", "Technology innovation", "Social justice and governance"]', 'impact', 9),
('How important is job security to you?', 'multiple_choice', '["Very important - prefer government jobs", "Moderately important", "Not very important - willing to take risks", "Prefer entrepreneurship", "Value growth over security"]', 'security', 10);

-- Insert testimonials
INSERT INTO testimonials (name, role, company, testimonial, rating, featured, active) VALUES
('Dr. Arjun Sharma', 'Senior Software Engineer', 'Google India', 'AI Career Compass J&K helped me understand the tech opportunities available locally. The career guidance was spot-on and helped me prepare for interviews at top tech companies.', 5, true, true),
('Priya Devi', 'Medical Officer', 'GMC Srinagar', 'The platform provided excellent guidance for medical career paths in J&K. The information about colleges and career prospects was very helpful during my preparation.', 5, true, true),
('Mohammad Rashid', 'Hotel Manager', 'The Lalit Grand Palace', 'Tourism is booming in J&K and this platform helped me understand the opportunities in hospitality sector. Great resource for career planning.', 4, true, true),
('Sunita Kumari', 'Agricultural Extension Officer', 'Department of Agriculture J&K', 'Perfect guidance for those interested in agriculture careers. The platform covers all aspects from education to job opportunities in the agriculture sector.', 5, true, true),
('Rahul Gupta', 'Civil Engineer', 'NHAI', 'Excellent career guidance for engineering students in J&K. The information about colleges and career paths is comprehensive and up-to-date.', 4, true, true),
('Fatima Khan', 'Teacher', 'Kendriya Vidyalaya', 'Great platform for understanding education career opportunities. Helped me choose the right path and prepare for teaching exams.', 5, false, true),
('Vikram Singh', 'Police Inspector', 'J&K Police', 'Comprehensive information about government job opportunities. Very helpful for understanding the recruitment process and career growth.', 4, false, true);
