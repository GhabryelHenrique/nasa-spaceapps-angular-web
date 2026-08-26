import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'desafios',
    loadComponent: () => import('./challenges/challenges.component').then(m => m.ChallengesComponent)
  },
  {
    path: 'como-se-inscrever',
    loadComponent: () => import('./how-to-register/how-to-register.component').then(m => m.HowToRegisterComponent)
  },
  {
    path: 'times',
    loadComponent: () => import('./teams/teams.component').then(m => m.TeamsComponent)
  },
  {
    path: 'times-vencedores/:slug',
    loadComponent: () => import('./winner-team-detail/winner-team-detail.component').then(m => m.WinnerTeamDetailComponent)
  },
  {
    path: 'sala-de-guerra',
    loadComponent: () => import('./war-room/war-room.component').then(m => m.WarRoomComponent)
  },
  {
    path: 'participantes',
    loadComponent: () => import('./participants/participants.component').then(m => m.ParticipantsComponent)
  },
  {
    path: 'patrocinio',
    loadComponent: () => import('./sponsorship/sponsorship.component').then(m => m.SponsorshipComponent)
  },
  {
    path: 'politica-privacidade',
    loadComponent: () => import('./privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  { path: '**', redirectTo: '' }
];
