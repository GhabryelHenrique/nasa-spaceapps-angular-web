import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  MENTOR_FORM_URL,
  REGISTRATION_URL,
  WHATSAPP_URL,
} from '../../../shared/data/registration.data';

interface RegistrationTrack {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  ctaUrl: string;
  ctaIcon: string;
  /** O cartão do participante é o caminho principal e ganha o destaque. */
  primary?: boolean;
}

@Component({
  selector: 'app-registration-section',
  imports: [RouterLink],
  templateUrl: './registration-section.component.html',
  styleUrl: './registration-section.component.scss',
})
export class RegistrationSectionComponent {
  readonly registrationUrl = REGISTRATION_URL;
  readonly whatsappUrl = WHATSAPP_URL;

  readonly tracks: RegistrationTrack[] = [
    {
      icon: 'ph ph-user-plus',
      eyebrow: 'Quero participar',
      title: 'Inscrição de participante',
      description:
        'Feita no site oficial da NASA, na página da sede Uberlândia. É gratuita e aberta a qualquer pessoa — de qualquer área, com ou sem experiência.',
      bullets: [
        'Crie sua conta no Space Apps',
        'Escolha Uberlândia como sua sede',
        'Monte ou entre em um time de até 6 pessoas',
      ],
      ctaLabel: 'Inscrever-se no site da NASA',
      ctaUrl: REGISTRATION_URL,
      ctaIcon: 'ph ph-rocket-launch',
      primary: true,
    },
    {
      icon: 'ph ph-chalkboard-teacher',
      eyebrow: 'Quero apoiar',
      title: 'Mentores, jurados e voluntários',
      description:
        'A organização local seleciona quem vai orientar, avaliar e sustentar as 48 horas de hackathon. A inscrição é por formulário próprio.',
      bullets: [
        'Mentoria técnica, de negócios ou de ciência',
        'Avaliação de projetos na banca',
        'Voluntariado na operação do evento',
      ],
      ctaLabel: 'Preencher formulário de mentoria',
      ctaUrl: MENTOR_FORM_URL,
      ctaIcon: 'ph ph-clipboard-text',
    },
  ];
}
