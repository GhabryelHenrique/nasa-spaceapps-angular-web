import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface LinkedInProfile {
  name: string;
  title: string;
  profileUrl: string;
  photoUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class LinkedinService {
  constructor(private http: HttpClient) {}

  getProfiles(): Observable<LinkedInProfile[]> {
    return from(this.loadAndProcessProfiles());
  }

  private async loadAndProcessProfiles(): Promise<LinkedInProfile[]> {
    try {
      const response = await fetch('/assets/data/linkedins.txt');
      const text = await response.text();
      const urls = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && line.includes('linkedin.com'));

      return urls.map((url, index) => {
        const username = this.extractUsername(url);
        return {
          name: this.formatName(username),
          title: 'Participante NASA Space Apps',
          profileUrl: url,
          photoUrl: this.getDefaultPhoto(username, index)
        };
      });
    } catch (error) {
      console.error('Error loading LinkedIn URLs:', error);
      return [];
    }
  }

  private extractUsername(url: string): string {
    const match = url.match(/\/in\/([^\/]+)\/?$/) || url.match(/\/([^\/]+)\/?$/);
    return match ? match[1] : 'Participante';
  }

  private formatName(username: string): string {
    // Remove hífens e underscores, capitalize primeira letra de cada palavra
    return username
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getDefaultPhoto(username: string, index: number): string {
    const colors = ['4ecdc4', '45b7d1', '5865F2', '9b59b6', 'e74c3c', 'f39c12'];
    const color = colors[index % colors.length];
    const name = this.formatName(username);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=200`;
  }
}
