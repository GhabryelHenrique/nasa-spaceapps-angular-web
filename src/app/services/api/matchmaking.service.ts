import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ParticipantProfile,
  TeamMatch,
  FindMatchesRequest,
  BestMatchesResponse
} from '../../models/matchmaking.models';

@Injectable({
  providedIn: 'root'
})
export class MatchmakingAuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Profile Management
  createProfile(profile: ParticipantProfile): Observable<any> {
    return this.http.post(`${this.apiUrl}/matchmaking/profile`, profile);
  }

  getProfile(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/matchmaking/profile/${encodeURIComponent(email)}`);
  }

  updateProfile(email: string, profile: Partial<ParticipantProfile>): Observable<any> {
    return this.http.put(`${this.apiUrl}/matchmaking/profile/${encodeURIComponent(email)}`, profile);
  }

  deleteProfile(email: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/matchmaking/profile/${encodeURIComponent(email)}`);
  }

  sendMatchNotification(senderEmail: string, recipientEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/matchmaking/send-match-notification`, { senderEmail, recipientEmail });
  }

  getAllProfiles(skills?: string[]): Observable<any> {
    const params: Record<string, string> = {};
    if (skills && skills.length > 0) {
      params['skills'] = skills.join(',');
    }
    return this.http.get(`${this.apiUrl}/matchmaking/profiles`, { params });
  }

  // Matchmaking
  findMatches(request: FindMatchesRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/matchmaking/find-matches`, request);
  }

  getMatches(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/matchmaking/matches/${encodeURIComponent(email)}`);
  }

  acceptMatch(matchId: string, participantEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/matchmaking/matches/${matchId}/accept`, {
      participantEmail
    });
  }

  rejectMatch(matchId: string, participantEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/matchmaking/matches/${matchId}/reject`, {
      participantEmail
    });
  }

  getMatchById(matchId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/matchmaking/match/${matchId}`);
  }

  generateTeams(teamSize?: number): Observable<any> {
    const params: Record<string, string> = {};
    if (teamSize) {
      params['teamSize'] = teamSize.toString();
    }
    return this.http.post(`${this.apiUrl}/matchmaking/generate-teams`, {}, { params });
  }

  getHighQualityMatches(minScore?: number): Observable<any> {
    const params: Record<string, string> = {};
    if (minScore) {
      params['minScore'] = minScore.toString();
    }
    return this.http.get(`${this.apiUrl}/matchmaking/high-quality-matches`, { params });
  }

  // Analytics
  exportMatchmakingData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/matchmaking/analytics/export`);
  }

  getSimilarProfiles(email: string, limit?: number): Observable<any> {
    const params: Record<string, string> = {};
    if (limit) {
      params['limit'] = limit.toString();
    }
    return this.http.get(`${this.apiUrl}/matchmaking/similar-profiles/${encodeURIComponent(email)}`, { params });
  }

  // Best Matches API from API_BEST_MATCHES.md
  getBestMatches(email: string, limit?: number, includeTeams?: boolean): Observable<BestMatchesResponse> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', limit.toString());
    }
    if (includeTeams) {
      params = params.set('includeTeams', includeTeams.toString());
    }

    return this.http.get<BestMatchesResponse>(`${this.apiUrl}/matchmaking/best-matches/${encodeURIComponent(email)}`, { params });
  }
}
