import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscordAuthService } from '../../services/discord-auth.service';

@Component({
  selector: 'app-discord-callback',
  imports: [],
  templateUrl: './discord-callback.component.html',
  styleUrl: './discord-callback.component.scss'
})
export class DiscordCallbackComponent implements OnInit {
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private discordAuth: DiscordAuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const error = params['error'];

      if (error) {
        this.error = 'Erro na autenticação com Discord';
        this.loading = false;
        return;
      }

      if (code) {
        console.log()
        this.handleDiscordCallback(code);
      } else {
        this.error = 'Código de autorização não encontrado';
        this.loading = false;
      }
    });
  }

  private async handleDiscordCallback(code: string): Promise<void> {
    try {
      await this.discordAuth.handleCallback(code);

      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.error = 'Erro ao processar autenticação';
      this.loading = false;
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
