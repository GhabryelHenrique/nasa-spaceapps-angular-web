import { Component } from '@angular/core';
import { DiscordAuthService } from '../../../services/discord-auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private discordAuth: DiscordAuthService) {}

  loginWithDiscord(): void {
    this.discordAuth.loginWithDiscord();
  }
}
