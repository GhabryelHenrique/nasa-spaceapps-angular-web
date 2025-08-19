import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'politica-privacidade', component: PrivacyPolicyComponent },
  { path: '**', redirectTo: '' }
];
