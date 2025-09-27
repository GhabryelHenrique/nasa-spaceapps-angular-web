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
  hoursPerWeek: string;
  timezone: string;
  preferredWorkingHours: string;
  availableDates?: string[];
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
  phoneNumber: string;
  skills: string[];
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  workExperience: WorkExperience[];
  education: string;
  gender?: string;
  preferFemaleTeam?: boolean;
  challengesOfInterest?: string[];
  interestAreas?: string[];
  projects: Project[];
  availability: Availability;
  preferences: Preferences;
  languages: string[];
  githubProfile?: string;
  linkedinProfile?: string;
  portfolioUrl?: string;
  bio?: string;
  participationGoals?: string[];
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

export interface IndividualMatch {
  participant: ParticipantProfile;
  matchScore: MatchScore;
  reasoning: {
    strengths: string[];
    concerns: string[];
    suggestions: string[];
  };
}

export interface TeamMatchResult {
  teamId: string;
  participants: string[];
  matchScore: MatchScore;
  reasoning: {
    strengths: string[];
    concerns: string[];
    suggestions: string[];
  };
  recommendedRoles: Record<string, string>;
}

export interface BestMatchesResponse {
  success: boolean;
  targetParticipant: {
    email: string;
    fullName: string;
    skills: string[];
    expertiseLevel: string;
  };
  individualMatches: {
    count: number;
    matches: IndividualMatch[];
  };
  teamMatches?: {
    count: number;
    matches: TeamMatchResult[];
  };
  summary: {
    totalIndividualMatches: number;
    averageMatchScore: number;
    topMatchScore: number;
  };
}