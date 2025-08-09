import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  email: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiscordAuthService {
  private readonly CLIENT_ID = '1402383692462166137';
  private readonly CLIENT_SECRET = 'iIPs7vQwRIH9GF53paCl4E_9rYzTkevH';
  private readonly REDIRECT_URI = `${window.location.origin}/auth/discord/callback`;

  private userSubject = new BehaviorSubject<DiscordUser | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('discord_user');
      if (savedUser) {
        this.userSubject.next(JSON.parse(savedUser));
      }
    }
  }

  loginWithDiscord(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${this.CLIENT_ID}&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&response_type=code&scope=identify+email`;
    window.location.href = discordAuthUrl;
  }

  async handleCallback(code: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const tokenResponse = await this.http.post<any>('https://discord.com/api/oauth2/token', {
        code,
        clientId: this.CLIENT_ID,
        clientSecret: this.CLIENT_SECRET,
        redirectUri: this.REDIRECT_URI
      }).toPromise();

      const userResponse = await this.http.get<DiscordUser>('https://discord.com/api/discord/user', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`
        }
      }).toPromise();

      if (userResponse) {
        this.setUser(userResponse);
      }
    } catch (error) {
      console.error('Error during Discord authentication:', error);
      throw error;
    }
  }

  private setUser(user: DiscordUser): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.userSubject.next(user);
    localStorage.setItem('discord_user', JSON.stringify(user));
  }

  logout(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.userSubject.next(null);
    localStorage.removeItem('discord_user');
  }

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  getCurrentUser(): DiscordUser | null {
    return this.userSubject.value;
  }
}
