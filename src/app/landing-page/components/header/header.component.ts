import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  joinDiscordServer(): void {
    window.open('https://discord.gg/FT4Jsvj5vy', '_blank');
  }
}
