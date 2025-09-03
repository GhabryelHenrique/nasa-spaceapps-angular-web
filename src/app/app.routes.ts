import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TeamsComponent } from './teams/teams.component';
import { WarRoomComponent } from './war-room/war-room.component';
import { ChallengesComponent } from './challenges/challenges.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'desafios', component: ChallengesComponent },
  { path: 'times', component: TeamsComponent },
  { path: 'sala-de-guerra', component: WarRoomComponent },
  { path: 'politica-privacidade', component: PrivacyPolicyComponent },
  { path: '**', redirectTo: '' }
];
