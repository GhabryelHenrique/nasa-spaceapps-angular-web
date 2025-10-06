import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkedinService, LinkedInProfile } from '../services/linkedin.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-participants',
  imports: [CommonModule],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss'
})
export class ParticipantsComponent implements OnInit {
  profiles$!: Observable<LinkedInProfile[]>;

  constructor(private linkedinService: LinkedinService) {}

  ngOnInit() {
    this.profiles$ = this.linkedinService.getProfiles();
  }

  openProfile(url: string) {
    window.open(url, '_blank');
  }
}
