// Enhanced Database Schema for Dynamic Content Management
// This replaces the static schema with dynamic content tables

-- Drop existing tables if needed for fresh start
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS quiz_results CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS colleges CASCADE;
DROP TABLE IF EXISTS careers CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS gemini_logs CASCADE;
DROP TABLE IF EXISTS content_blocks CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table for content management
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '["read", "write", "delete"]',
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dynamic content blocks for flexible content management
CREATE TABLE content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_type VARCHAR(100) NOT NULL, -- hero, about, services, features, etc.
    block_name VARCHAR(255) NOT NULL,
    title VARCHAR(500),
    subtitle VARCHAR(500),
    content TEXT,
    media_url TEXT,
    metadata JSONB DEFAULT '{}', -- flexible data storage
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    page_route VARCHAR(255), -- which page this block belongs to
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced user profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE, -- Clerk user ID or custom ID
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    education_level VARCHAR(100),
    interests JSONB DEFAULT '[]',
    skills JSONB DEFAULT '[]',
    location VARCHAR(255),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}', -- user preferences
    profile_completion_percentage INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced careers table with dynamic content
CREATE TABLE careers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    detailed_description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    education_level VARCHAR(100),
    skills_required JSONB DEFAULT '[]',
    salary_range_min INTEGER,
    salary_range_max INTEGER,
    currency VARCHAR(10) DEFAULT 'INR',
    location JSONB DEFAULT '[]', -- array of locations
    company_types JSONB DEFAULT '[]',
    growth_prospects TEXT,
    opportunities_in_jk TEXT,
    requirements TEXT,
    career_path JSONB DEFAULT '[]', -- progression steps
    related_careers JSONB DEFAULT '[]', -- UUIDs of related careers
    demand_score INTEGER CHECK (demand_score >= 1 AND demand_score <= 10),
    featured BOOLEAN DEFAULT false,
    meta_title VARCHAR(500),
    meta_description TEXT,
    tags JSONB DEFAULT '[]',
    active BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced colleges table
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    college_type VARCHAR(100) NOT NULL,
    affiliation VARCHAR(255),
    courses JSONB NOT NULL DEFAULT '[]',
    facilities JSONB DEFAULT '[]',
    contact_info JSONB DEFAULT '{}',
    website VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(50),
    established_year INTEGER,
    ranking INTEGER,
    accreditation JSONB DEFAULT '[]',
    fees_range JSONB DEFAULT '{}',
    admission_process TEXT,
    eligibility JSONB DEFAULT '{}',
    placements JSONB DEFAULT '{}',
    gallery JSONB DEFAULT '[]', -- array of image URLs
    virtual_tour_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    featured BOOLEAN DEFAULT false,
    verification_status VARCHAR(50) DEFAULT 'pending',
    meta_title VARCHAR(500),
    meta_description TEXT,
    active BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced quiz system
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    options JSONB, -- for multiple choice questions
    correct_answer TEXT, -- for knowledge-based questions
    category VARCHAR(100),
    subcategory VARCHAR(100),
    difficulty_level VARCHAR(20) DEFAULT 'medium',
    points INTEGER DEFAULT 1,
    explanation TEXT, -- explanation for the answer
    order_index INTEGER,
    is_required BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced quiz results with detailed analytics
CREATE TABLE quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    session_id VARCHAR(255), -- for anonymous users
    answers JSONB NOT NULL,
    score INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    recommendations JSONB DEFAULT '[]',
    personality_type VARCHAR(100),
    career_matches JSONB DEFAULT '[]',
    completion_time INTEGER, -- in seconds
    ip_address INET,
    user_agent TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON DELETE CASCADE
);

-- Dynamic blog/articles system
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    gallery JSONB DEFAULT '[]',
    author_id UUID REFERENCES admins(id),
    category VARCHAR(100),
    tags JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
    featured BOOLEAN DEFAULT false,
    reading_time INTEGER, -- estimated reading time in minutes
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    meta_title VARCHAR(500),
    meta_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced testimonials with verification
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(255),
    company VARCHAR(255),
    college VARCHAR(255),
    testimonial TEXT NOT NULL,
    detailed_testimonial TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
    verification_documents JSONB DEFAULT '[]',
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    category VARCHAR(100), -- career_success, college_experience, platform_review
    location VARCHAR(255),
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced contact messages with categorization
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(500),
    message TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general', -- general, career_query, college_query, technical_support
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    status VARCHAR(50) DEFAULT 'new', -- new, in_progress, resolved, closed
    assigned_to UUID REFERENCES admins(id),
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    response_time INTEGER, -- in hours
    source VARCHAR(100), -- website, mobile_app, api
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gemini API logs and analytics
CREATE TABLE gemini_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    endpoint VARCHAR(255) NOT NULL, -- which Gemini endpoint was called
    request_type VARCHAR(100), -- market_data, crypto_price, trading_info
    symbol VARCHAR(20), -- cryptocurrency symbol
    request_data JSONB,
    response_data JSONB,
    response_status INTEGER,
    response_time INTEGER, -- in milliseconds
    error_message TEXT,
    user_id VARCHAR(255),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced analytics with detailed tracking
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(100),
    event_action VARCHAR(100),
    event_label VARCHAR(255),
    event_data JSONB DEFAULT '{}',
    page_url TEXT,
    page_title VARCHAR(500),
    referrer TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive indexes for performance
CREATE INDEX idx_careers_category ON careers(category);
CREATE INDEX idx_careers_location ON careers USING GIN(location);
CREATE INDEX idx_careers_featured ON careers(featured, active);
CREATE INDEX idx_careers_slug ON careers(slug);
CREATE INDEX idx_careers_views ON careers(views_count DESC);

CREATE INDEX idx_colleges_type ON colleges(college_type);
CREATE INDEX idx_colleges_location ON colleges(location);
CREATE INDEX idx_colleges_featured ON colleges(featured, active);
CREATE INDEX idx_colleges_slug ON colleges(slug);
CREATE INDEX idx_colleges_ranking ON colleges(ranking);

CREATE INDEX idx_content_blocks_type ON content_blocks(block_type, page_route);
CREATE INDEX idx_content_blocks_active ON content_blocks(is_active, display_order);

CREATE INDEX idx_articles_status ON articles(status, published_at);
CREATE INDEX idx_articles_featured ON articles(featured, status);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_views ON articles(views_count DESC);

CREATE INDEX idx_testimonials_featured ON testimonials(featured, active);
CREATE INDEX idx_testimonials_verification ON testimonials(verification_status);

CREATE INDEX idx_quiz_results_user ON quiz_results(user_id, completed_at);
CREATE INDEX idx_contact_messages_status ON contact_messages(status, created_at);
CREATE INDEX idx_gemini_logs_symbol ON gemini_logs(symbol, created_at);
CREATE INDEX idx_analytics_event ON analytics(event_type, created_at);

-- Full text search indexes
CREATE INDEX idx_careers_search ON careers USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_colleges_search ON colleges USING gin(to_tsvector('english', name || ' ' || location));
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('english', title || ' ' || content));

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON content_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
