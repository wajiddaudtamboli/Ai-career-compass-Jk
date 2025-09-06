-- Enhanced User Profile Schema for AI Career Compass J&K
-- Add user profile fields to support dynamic profile management

-- Create enhanced users table with profile fields
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create detailed user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    
    -- Academic Information
    current_class VARCHAR(50),
    stream VARCHAR(100),
    school VARCHAR(255),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Jammu & Kashmir',
    
    -- Career Preferences
    interests JSONB DEFAULT '[]',
    career_goals TEXT,
    preferred_locations JSONB DEFAULT '[]',
    
    -- Skills and Achievements
    skills JSONB DEFAULT '[]',
    achievements TEXT,
    extracurricular_activities JSONB DEFAULT '[]',
    
    -- Family Background
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    father_occupation VARCHAR(255),
    mother_occupation VARCHAR(255),
    family_income_range VARCHAR(100),
    
    -- Additional Information
    languages_known JSONB DEFAULT '["English", "Hindi"]',
    special_needs TEXT,
    profile_picture_url TEXT,
    
    -- Profile Status
    profile_completion_percentage INTEGER DEFAULT 0,
    is_profile_public BOOLEAN DEFAULT false,
    last_profile_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Create profile preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dashboard Preferences
    dashboard_theme VARCHAR(50) DEFAULT 'light',
    language_preference VARCHAR(10) DEFAULT 'en',
    
    -- Notification Preferences
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    
    -- Privacy Settings
    show_profile_to_peers BOOLEAN DEFAULT false,
    show_quiz_results BOOLEAN DEFAULT false,
    allow_mentor_contact BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Create quiz attempts tracking
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_type VARCHAR(100) NOT NULL,
    responses JSONB NOT NULL,
    calculated_scores JSONB,
    career_recommendations JSONB,
    attempt_number INTEGER DEFAULT 1,
    completion_time_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user activity log
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL, -- 'profile_update', 'quiz_taken', 'career_explored', 'college_bookmarked'
    activity_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bookmark_type VARCHAR(50) NOT NULL, -- 'career', 'college', 'article'
    bookmark_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, bookmark_type, bookmark_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON user_bookmarks(user_id);

-- Create function to calculate profile completion
CREATE OR REPLACE FUNCTION calculate_profile_completion(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    completion_score INTEGER := 0;
    profile_record RECORD;
BEGIN
    SELECT * INTO profile_record FROM user_profiles WHERE user_id = user_uuid;
    
    IF profile_record IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Basic Information (40 points)
    IF profile_record.full_name IS NOT NULL AND LENGTH(TRIM(profile_record.full_name)) > 0 THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.email IS NOT NULL AND LENGTH(TRIM(profile_record.email)) > 0 THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.phone IS NOT NULL AND LENGTH(TRIM(profile_record.phone)) > 0 THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.date_of_birth IS NOT NULL THEN
        completion_score := completion_score + 10;
    END IF;
    
    -- Academic Information (30 points)
    IF profile_record.current_class IS NOT NULL AND LENGTH(TRIM(profile_record.current_class)) > 0 THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.stream IS NOT NULL AND LENGTH(TRIM(profile_record.stream)) > 0 THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.school IS NOT NULL AND LENGTH(TRIM(profile_record.school)) > 0 THEN
        completion_score := completion_score + 10;
    END IF;
    
    -- Career and Skills (20 points)
    IF profile_record.interests IS NOT NULL AND json_array_length(profile_record.interests) > 0 THEN
        completion_score := completion_score + 10;
    END IF;
    
    IF profile_record.career_goals IS NOT NULL AND LENGTH(TRIM(profile_record.career_goals)) > 0 THEN
        completion_score := completion_score + 10;
    END IF;
    
    -- Family Information (10 points)
    IF profile_record.father_name IS NOT NULL AND LENGTH(TRIM(profile_record.father_name)) > 0 THEN
        completion_score := completion_score + 5;
    END IF;
    
    IF profile_record.mother_name IS NOT NULL AND LENGTH(TRIM(profile_record.mother_name)) > 0 THEN
        completion_score := completion_score + 5;
    END IF;
    
    RETURN completion_score;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update profile completion percentage
CREATE OR REPLACE FUNCTION update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.profile_completion_percentage := calculate_profile_completion(NEW.user_id);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profile_completion
    BEFORE INSERT OR UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_completion();
