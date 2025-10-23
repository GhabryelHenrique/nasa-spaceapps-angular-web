import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TeamsComponent } from './teams/teams.component';
import { WarRoomComponent } from './war-room/war-room.component';
import { MatchmakingDashboardComponent } from './matchmaking/matchmaking-dashboard.component';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileCreateComponent } from './components/profile-create/profile-create.component';
import { MatchesComponent } from './components/matches/matches.component';
import { AuthGuard } from './guards/auth.guard';
import { ChallengesComponent } from './challenges/challenges.component';
import { ParticipantsComponent } from './participants/participants.component';
import { WinnerTeamDetailComponent } from './winner-team-detail/winner-team-detail.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile/create', component: ProfileCreateComponent, canActivate: [AuthGuard] },
  { path: 'matches', component: MatchesComponent, canActivate: [AuthGuard] },
  { path: 'desafios', component: ChallengesComponent },
  { path: 'times', component: TeamsComponent },
  { path: 'times-vencedores/:slug', component: WinnerTeamDetailComponent },
  { path: 'sala-de-guerra', component: WarRoomComponent },
  { path: 'matchmaking', component: MatchmakingDashboardComponent },
  { path: 'participantes', component: ParticipantsComponent },
  { path: 'politica-privacidade', component: PrivacyPolicyComponent },
  { path: '**', redirectTo: '' }
];
