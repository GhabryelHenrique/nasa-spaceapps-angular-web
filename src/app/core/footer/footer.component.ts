import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MENTOR_FORM_URL, REGISTRATION_URL } from '../../shared/data/registration.data';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  // RouterLink faltava aqui: os routerLink do template eram atributos inertes.
  imports: [CommonModule, RouterLink],
})
export class FooterComponent implements OnInit {

  readonly registrationUrl = REGISTRATION_URL;
  readonly mentorFormUrl = MENTOR_FORM_URL;

  constructor() { }

  ngOnInit() {
  }

}
