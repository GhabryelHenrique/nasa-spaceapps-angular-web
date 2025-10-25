import { Team } from './teams.data';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
  alt?: string;
}

export interface WinnerTeamPresentation {
  introduction: string;
  projectDescription: string;
  achievements: string[];
  impact: string;
  usesOfAI: string;
  technologiesUsed: string[];
  nasaData: any[];
}

export interface WinnerTeam extends Omit<Team, 'memberships'> {
  // ID único para a URL (slug)
  slug: string;

  // Categoria de prêmio
  awardCategory: string;
  awardYear: number;

  // Texto de apresentação estruturado
  presentation: WinnerTeamPresentation;

  // Galeria de mídia (fotos e vídeos)
  mediaGallery: MediaItem[];

  // Informações dos membros com fotos
  teamMembers: {
    name: string;
    role: string;
    photo?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  }[];

  // Links adicionais
  projectVideo?: string;
  presentationSlides?: string;
  githubRepo?: string;
}

export interface WinnerTeamsData {
  teams: WinnerTeam[];
}
