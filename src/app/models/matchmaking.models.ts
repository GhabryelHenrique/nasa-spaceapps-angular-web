export interface WorkExperience {
  company: string;
  position: string;
  sector: string;
  yearsOfExperience: number;
  technologies: string[];
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  role: string;
  duration?: string;
  url?: string;
}

export interface Availability {
  hoursPerWeek: number;
  timezone: string;
  preferredWorkingHours: string;
  availableDates: string[];
}

export interface Preferences {
  teamSize: 'small' | 'medium' | 'large' | 'any';
  projectType: string[];
  communicationStyle: 'direct' | 'collaborative' | 'supportive' | 'analytical';
  workStyle: 'leader' | 'contributor' | 'specialist' | 'facilitator';
  interests: string[];
}

export interface ParticipantProfile {
  email: string;
  fullName: string;
  skills: string[];
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  workExperience: WorkExperience[];
  education: string;
  projects: Project[];
  availability: Availability;
  preferences: Preferences;
  languages: string[];
  githubProfile?: string;
  linkedinProfile?: string;
  portfolioUrl?: string;
  bio?: string;
  participationGoals?: string[];
  challengesInterests?: string[];
}

export interface MatchScore {
  overall: number;
  skillsCompatibility: number;
  experienceBalance: number;
  availabilityMatch: number;
  preferencesAlignment: number;
  communicationFit: number;
}

export interface TeamMatch {
  id: string;
  participantEmails: string[];
  matchScore: MatchScore;
  reasoning: {
    strengths: string[];
    concerns: string[];
    suggestions: string[];
  };
  challengeCategory?: string;
  recommendedRoles?: Record<string, string>;
  createdAt: string;
  status: 'suggested' | 'accepted' | 'rejected' | 'expired';
  metadata: {
    teamSize: number;
    isHighQuality: boolean;
    isViable: boolean;
  };
}

export interface FindMatchesRequest {
  email: string;
  teamSize?: number;
  challengeCategories?: string[];
  minMatchScore?: number;
}