import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DiscordCallbackComponent } from './auth/discord-callback/discord-callback.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'auth/discord/callback', component: DiscordCallbackComponent },
  { path: '**', redirectTo: '' }
];
