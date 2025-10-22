-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  userId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  azureOid TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  portfolioWebsite TEXT,
  githubLink TEXT,
  linkedinLink TEXT,
  photoURL TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  projectId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES profiles(userId) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  techStack TEXT[] DEFAULT '{}',
  projectLink TEXT,
  githubRepo TEXT,
  startDate DATE NOT NULL,
  endDate DATE,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  eduId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES profiles(userId) ON DELETE CASCADE,
  institute TEXT NOT NULL,
  degree TEXT NOT NULL,
  branch TEXT NOT NULL,
  startYear INTEGER NOT NULL,
  endYear INTEGER,
  cgpaOrPercentage DECIMAL(5,2) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  courseId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES profiles(userId) ON DELETE CASCADE,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  certificateLink TEXT,
  completionDate DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  achievementId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES profiles(userId) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  skillId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES profiles(userId) ON DELETE CASCADE,
  category TEXT NOT NULL,
  skills JSONB DEFAULT '[]',
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Create positions of responsibility table
CREATE TABLE IF NOT EXISTS positionsOfResponsibility (
  posId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES profiles(userId) ON DELETE CASCADE,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  description TEXT,
  startDate DATE NOT NULL,
  endDate DATE,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  certId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES profiles(userId) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  issuer TEXT NOT NULL,
  issueDate DATE NOT NULL,
  certificateLink TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_projects_userId ON projects(userId);
CREATE INDEX idx_education_userId ON education(userId);
CREATE INDEX idx_courses_userId ON courses(userId);
CREATE INDEX idx_achievements_userId ON achievements(userId);
CREATE INDEX idx_skills_userId ON skills(userId);
CREATE INDEX idx_positionsOfResponsibility_userId ON positionsOfResponsibility(userId);
CREATE INDEX idx_certifications_userId ON certifications(userId);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE positionsOfResponsibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = userId);

-- RLS Policies for projects
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own projects" ON projects
  FOR DELETE USING (auth.uid() = userId);

-- Similar policies for other tables (education, courses, achievements, skills, positionsOfResponsibility, certifications)
CREATE POLICY "Users can view their own education" ON education
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can manage their own education" ON education
  FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own education" ON education
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own education" ON education
  FOR DELETE USING (auth.uid() = userId);

CREATE POLICY "Users can view their own courses" ON courses
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can manage their own courses" ON courses
  FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own courses" ON courses
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own courses" ON courses
  FOR DELETE USING (auth.uid() = userId);

CREATE POLICY "Users can view their own achievements" ON achievements
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can manage their own achievements" ON achievements
  FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own achievements" ON achievements
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own achievements" ON achievements
  FOR DELETE USING (auth.uid() = userId);

CREATE POLICY "Users can view their own skills" ON skills
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can manage their own skills" ON skills
  FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own skills" ON skills
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own skills" ON skills
  FOR DELETE USING (auth.uid() = userId);

CREATE POLICY "Users can view their own positions" ON positionsOfResponsibility
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can manage their own positions" ON positionsOfResponsibility
  FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own positions" ON positionsOfResponsibility
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own positions" ON positionsOfResponsibility
  FOR DELETE USING (auth.uid() = userId);

CREATE POLICY "Users can view their own certifications" ON certifications
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can manage their own certifications" ON certifications
  FOR INSERT WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own certifications" ON certifications
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own certifications" ON certifications
  FOR DELETE USING (auth.uid() = userId);
