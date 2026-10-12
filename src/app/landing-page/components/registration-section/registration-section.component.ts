import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  REGISTRATION_URL,
  REGISTRATION_VIDEO_ID,
  SUPPORT_FORMS,
  WHATSAPP_URL,
} from '../../../shared/data/registration.data';
import { YoutubeEmbedComponent } from '../../../shared/youtube-embed/youtube-embed.component';

interface RegistrationTrack {
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  /** Participante tem um só caminho; o apoio tem um formulário por papel. */
  ctas: { label: string; url: string; icon: string }[];
  /** O cartão do participante é o caminho principal e ganha o destaque. */
  primary?: boolean;
}

@Component({
  selector: 'app-registration-section',
  imports: [RouterLink, YoutubeEmbedComponent],
  templateUrl: './registration-section.component.html',
  styleUrl: './registration-section.component.scss',
})
export class RegistrationSectionComponent {
  readonly registrationUrl = REGISTRATION_URL;
  readonly whatsappUrl = WHATSAPP_URL;
  readonly videoId = REGISTRATION_VIDEO_ID;

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
      ctas: [
        { label: 'Inscrever-se no site da NASA', url: REGISTRATION_URL, icon: 'ph ph-rocket-launch' },
      ],
      primary: true,
    },
    {
      icon: 'ph ph-hand-heart',
      eyebrow: 'Quero apoiar',
      title: 'Mentores, voluntários e palestrantes',
      description:
        'A organização local seleciona quem vai orientar os times, sustentar as 48 horas de hackathon e subir ao palco. Cada papel tem seu próprio formulário.',
      bullets: [
        'Mentoria técnica, de negócios ou de ciência',
        'Voluntariado na operação do evento',
        'Palestras na programação do hackathon',
      ],
      ctas: SUPPORT_FORMS.map(form => ({ label: form.role, url: form.url, icon: form.icon })),
    },
  ];
}
