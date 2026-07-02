import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile/create',
    loadComponent: () => import('./components/profile-create/profile-create.component').then(m => m.ProfileCreateComponent),
    canActivate: [authGuard]
  },
  {
    path: 'matches',
    loadComponent: () => import('./components/matches/matches.component').then(m => m.MatchesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'desafios',
    loadComponent: () => import('./challenges/challenges.component').then(m => m.ChallengesComponent)
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
    path: 'matchmaking',
    loadComponent: () => import('./matchmaking/matchmaking-dashboard.component').then(m => m.MatchmakingDashboardComponent)
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
