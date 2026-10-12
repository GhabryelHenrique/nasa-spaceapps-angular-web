/**
 * Links oficiais de inscrição da edição 2026.
 *
 * A inscrição do participante acontece **no site da NASA**, não aqui: a sede
 * local não hospeda formulário próprio. Mentores, voluntários e palestrantes
 * usam formulários separados da organização de Uberlândia.
 */

/** Página oficial da sede Uberlândia no site do Space Apps (inscrição do participante). */
export const REGISTRATION_URL =
  'https://www.spaceappschallenge.org/2026/local-events/uberlandia';

/** Formulários da organização local — um por forma de apoio ao evento. */
export const MENTOR_FORM_URL = 'https://forms.gle/1p46hmxY24L2Pfdx5';
export const VOLUNTEER_FORM_URL = 'https://forms.gle/mQJwKM4wh6MdLCRc8';
export const SPEAKER_FORM_URL = 'https://forms.gle/C2v8zWJYJuBrToKq9';

export interface SupportForm {
  /** Papel no plural, para títulos e rótulos curtos ("Mentores"). */
  role: string;
  /** Rótulo do botão que abre o formulário. */
  ctaLabel: string;
  icon: string;
  url: string;
}

/** Ordem de exibição dos formulários de apoio em todo o site. */
export const SUPPORT_FORMS: SupportForm[] = [
  { role: 'Mentores', ctaLabel: 'Quero ser mentor', icon: 'ph ph-chalkboard-teacher', url: MENTOR_FORM_URL },
  { role: 'Voluntários', ctaLabel: 'Quero ser voluntário', icon: 'ph ph-hand-heart', url: VOLUNTEER_FORM_URL },
  { role: 'Palestrantes', ctaLabel: 'Quero palestrar', icon: 'ph ph-microphone-stage', url: SPEAKER_FORM_URL },
];

/** Vídeo do YouTube exibido na seção de inscrições da home e em /como-se-inscrever. */
export const REGISTRATION_VIDEO_ID = 'ZMWMhXjySbQ';

/** Data em que as inscrições abriram — usada nos selos de "inscrições abertas". */
export const REGISTRATION_OPEN_DATE = '2026-08-26T00:00:00-03:00';

export const WHATSAPP_URL = 'https://chat.whatsapp.com/LLsTZ9soMR2GflnGSrft0j';
export const DISCORD_URL = 'https://discord.gg/FT4Jsvj5vy';
export const INSTAGRAM_URL = 'https://www.instagram.com/nasaspaceappsuberlandia';
