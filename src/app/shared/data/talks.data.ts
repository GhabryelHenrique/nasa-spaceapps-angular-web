/**
 * Semana de palestras da edição 2026 — o esquenta antes do hackathon (14 e 15/11).
 * Palestras feitas com o Google Developer Groups (GDG) levam `withPartner`.
 *
 * Os dados vêm do formulário de palestrantes (`SPEAKER_FORM_URL`) e dos cards de
 * divulgação. Só entra aqui o que é público: e-mail e telefone ficam fora do site.
 * Para incluir uma palestra nova, basta adicionar um item em `TALKS` — a home e
 * `/palestras` se montam a partir desta lista.
 */

export interface SpeakerLink {
  label: string;
  icon: string;
  url: string;
}

export interface Speaker {
  name: string;
  /** Como a pessoa pediu para ser anunciada na divulgação. */
  alias?: string;
  pronouns?: string;
  role: string;
  organization: string;
  city?: string;
  /**
   * Só para quem vem de fora do Brasil: marca a palestra como internacional
   * (selo com bandeira na home e em `/palestras`).
   */
  origin?: { label: string; flag: string };
  photo: string;
  /** `object-position` da foto quando o rosto não fica no alto (padrão do CSS: ~18%). */
  photoPosition?: string;
  /** Mini-bio para divulgação, mantendo as palavras de quem enviou (1ª ou 3ª pessoa). */
  bio: string;
  /** Credenciais curtas para os selos do cartão — vazio esconde os selos. */
  credentials: string[];
  links: SpeakerLink[];
}

export interface Talk {
  slug: string;
  title: string;
  /** Início, com fuso de Brasília — usado no status e no link de agenda. */
  startsAt: string;
  durationMinutes: number;
  /** Rótulos prontos para exibir, no mesmo estilo do cronograma da home. */
  dayLabel: string;
  timeLabel: string;
  format: string;
  mode: 'Presencial' | 'Online' | 'Híbrido';
  level?: string;
  /** Rótulos curtos da área da palestra (os selos do card de divulgação). */
  tags: string[];
  summary: string;
  // Listas vazias escondem o bloco correspondente na página.
  takeaways: string[];
  /** Ferramentas e tecnologias usadas na atividade. */
  stack: string[];
  /** Temas gerais do hackathon que a atividade cobre. */
  topics: string[];
  /** Desafios oficiais de 2026 relacionados (slugs de `CHALLENGES_DATA`). */
  challengeSlugs: string[];
  /** Palestra feita em parceria com o `TALKS_PARTNER` (GDG). */
  withPartner?: boolean;
  /** Local; enquanto não houver, a página avisa que sai nos canais. */
  venue?: string;
  /** Endereço completo do local, para o card de divulgação e o link de agenda. */
  venueAddress?: string;
  /** Página do evento no Sympla, onde o ingresso (gratuito) é emitido. */
  ticketUrl?: string;
  speaker: Speaker;
}

export const TALKS_PARTNER = {
  name: 'Google Developer Groups',
  shortName: 'GDG Uberlândia',
  url: 'https://gdg.community.dev/gdg-uberlandia/',
  /** Logo com texto escuro: sempre exibir sobre placa branca, nunca direto no azul. */
  logo: 'assets/google-developer-groups-seeklogo.svg',
};

export const TALKS: Talk[] = [
  {
    slug: 'ia-segura-acessivel-escolas',
    title:
      'IA Segura e Acessível nas Escolas: Construindo um Futuro Mais Justo',
    startsAt: '2026-11-09T14:00:00-03:00',
    // Duração ainda não confirmada — só define o fim no status e no link de agenda.
    durationMinutes: 60,
    dayLabel: 'Segunda, 9 de novembro',
    venue: 'UFU FEELT',
    venueAddress:
      'Av. João Naves de Ávila, 2121 - Direção FEELT - Bairro Santa Mônica',
    timeLabel: '19h',
    format: 'Palestra',
    mode: 'Presencial',
    tags: ['IA', 'Acessibilidade', 'Segurança'],
    summary:
      'Como levar a inteligência artificial para dentro das escolas de forma segura e acessível -' +
      'e por que isso é decisivo para um futuro mais justo, sobretudo em países onde a segurança da IA ainda é menor. Nessa sessão, partimos de exemplos locais, como o Pix e as eleições, e de casos reais de pagamentos para praticar como detectar, limitar e se recuperar de falhas e usos indevidos da IA, e como usamos com segurança nos nossos projetos',
    takeaways: [],
    stack: [],
    topics: [],
    challengeSlugs: [],
    ticketUrl:
      'https://www.sympla.com.br/evento/nasa-space-apps-warmup-ia-segura-e-acessivel-construindo-um-futuro-mais-justo/3606886',
    speaker: {
      name: 'Mel Tranfield',
      role: 'Vice-curadora e engenheira',
      organization: 'Londres Hub II',
      origin: {
        label: 'Londres, Reino Unido',
        flag: 'assets/flags/reino-unido.svg',
      },
      photo: 'assets/speakers/mel-tranfield.jpeg',
      photoPosition: '50% 35%',
      bio:
        'Mel é vice-curadora de Londres Hub II e engenheira. Ela executa um projeto de segurança de IA nas ' +
        'escolas e é responsável pela acessibilidade e segurança de IA, particularmente em países onde a ' +
        'segurança da IA é menor.',
      credentials: [],
      links: [
        {
          label: 'Instagram',
          icon: 'fa-brands fa-instagram',
          url: 'https://www.instagram.com/meltranfield/',
        },
        {
          label: 'LinkedIn',
          icon: 'fa-brands fa-linkedin',
          url: 'https://www.linkedin.com/in/melissa-tranfield/',
        },
      ],
    },
  },
  {
    slug: 'agentes-adk-kubernetes-gemini',
    title: 'Agentes ADK em Kubernetes com Gemini, GCP e muito DevOps!',
    startsAt: '2026-11-10T19:00:00-03:00',
    venue: 'UFU FEELT',
    venueAddress:
      'Av. João Naves de Ávila, 2121 - Direção FEELT - Bairro Santa Mônica',
    durationMinutes: 50,
    dayLabel: 'Terça, 10 de novembro',
    timeLabel: '19h',
    format: 'Palestra · 40–50 min',
    mode: 'Presencial',
    level: 'Iniciante',
    tags: ['IA', 'DevOps', 'Cloud'],
    withPartner: true,
    summary:
      'Um workshop já levado a universidades, agora no formato de palestra: como colocar agentes de IA ' +
      'criados com o ADK (Agent Development Kit) para rodar no Google Kubernetes Engine (GKE), conectados ' +
      'ao Gemini e com as principais ferramentas de DevOps — Docker, Terraform e Kubernetes. Os agentes ' +
      'de exemplo miram desafios oficiais do NASA Space Apps 2026.',
    takeaways: [
      'Criação de agentes de IA com o ADK e o Gemini',
      'Escalonamento de aplicações no Kubernetes',
      'Integração entre DevOps e IA, do container ao deploy na GCP',
    ],
    stack: ['ADK', 'Gemini', 'GKE', 'Kubernetes', 'Docker', 'Terraform', 'GCP'],
    topics: [
      'IA generativa como copiloto durante o hackathon',
      'Deploy rápido (GCP, Vercel, Netlify, Streamlit, GitHub Pages)',
    ],
    challengeSlugs: [
      'create-health-monitoring-software-for-astronauts-on-space-missions',
      'the-earth-information-jukebox',
    ],
    ticketUrl:
      'https://www.sympla.com.br/evento/nasa-space-apps-warmup-agentes-adk-em-kubernetes-com-gemini-gcp-e-muito-devops/3624155',
    speaker: {
      name: 'Camilla Martins',
      alias: 'Punk do DevOps',
      pronouns: 'ela/ele',
      role: 'Senior SRE e doutoranda',
      organization: 'Storyblok · UNIRIO',
      city: 'Rio de Janeiro',
      photo: 'assets/speakers/camilla-martins.jpg',
      bio:
        'Sou Senior Site Reliability Engineer e atualmente trabalho na Storyblok, com pós em Forense ' +
        'Computacional e Mestre em Informática na Universidade Federal do Estado do Rio de Janeiro. ' +
        'Doutoranda também pela Federal do Estado do Rio de Janeiro. Sou Docker Community Leader premiada ' +
        'três vezes pela Docker Inc, Docker Captain, DevOpsDays Core Organizer, Google Developer Expert em ' +
        'Cloud, IBM Champion, KCD/CNCF organizer, organizadora de eventos no Rio de DevOps e palestrante de ' +
        'eventos de DevOps pelo mundo. Nas horas vagas, estou curtindo a vida viajando por aí (já viajei 30 ' +
        'países e contando) e afofando meus gatinhos pretos <3',
      credentials: [
        'Google Developer Expert em Cloud',
        'Docker Captain',
        'IBM Champion',
        'DevOpsDays Core Organizer',
      ],
      links: [
        {
          label: 'Instagram',
          icon: 'fa-brands fa-instagram',
          url: 'https://www.instagram.com/punkdodevops',
        },
        {
          label: 'GitHub',
          icon: 'fa-brands fa-github',
          url: 'https://github.com/camilla-m',
        },
        {
          label: 'punkdodevops.com',
          icon: 'ph ph-globe',
          url: 'https://punkdodevops.com',
        },
      ],
    },
  },
  {
    slug: 'software-defined-automation-industria',
    title:
      'Software-Defined Automation: como atualizar uma fábrica que não pode desligar, e por que a indústria precisa de quem vem de TI',
    startsAt: '2026-11-10T20:00:00-03:00',
    venue: 'UFU FEELT',
    ticketUrl:
      'https://www.sympla.com.br/evento/nasa-space-apps-warmup-agentes-adk-em-kubernetes-com-gemini-gcp-e-muito-devops/3624155',
    venueAddress:
      'Av. João Naves de Ávila, 2121 - Direção FEELT - Bairro Santa Mônica',
    durationMinutes: 50,
    dayLabel: 'Terça, 10 de novembro',
    timeLabel: '20h',
    format: 'Palestra · 40–50 min',
    mode: 'Presencial',
    level: 'Todos os níveis',
    tags: ['Indústria 4.0', 'Automação', 'Carreira'],
    summary:
      'As diferenças críticas entre a TI tradicional e o chão de fábrica, onde os sistemas exigem 99,999% ' +
      'de disponibilidade e uma falha de código pode virar um acidente físico, como o desligamento de uma ' +
      'caldeira. A palestra apresenta a Software-Defined Automation (SDA), que desacopla o hardware da ' +
      'lógica de controle e leva práticas modernas de desenvolvimento para a indústria, e mostra como ' +
      'padrões abertos (IEC 61499), Edge Computing e contêineres resolvem o "pesadelo do legado" ' +
      'industrial e permitem atualizar processos contínuos. Por fim, faz a ponte entre o que se aprende ' +
      'na faculdade (redes, Docker, ML e sistemas distribuídos) e a automação na prática, com as ' +
      'oportunidades de carreira para quem domina software e quer atuar na indústria.',
    takeaways: [
      'Na fábrica, disponibilidade e segurança física (safety) vêm antes de tudo: um erro de software vira um evento físico',
      'A Software-Defined Automation leva práticas modernas de software (deploy controlado, virtualização) para a fábrica sem parar a produção',
      'A indústria precisa de quem vem de TI: contêineres, sistemas distribuídos e redes são a chave para modernizar o chão de fábrica',
    ],
    stack: ['IEC 61499', 'Edge Computing', 'Docker', 'Sistemas distribuídos', 'Redes'],
    topics: [],
    challengeSlugs: [],
    speaker: {
      name: 'Marcos Antônio Souza Júnior',
      alias: 'Marcos Souza',
      role: 'Coordenador de Indústria 4.0',
      organization: 'Aimirim',
      city: 'Uberlândia',
      photo: 'assets/speakers/marcos-souza.jpeg',
      photoPosition: '50% 35%',
      bio:
        'Marcos Antônio Souza é Engenheiro Mecânico (UFU) e Coordenador de Indústria 4.0 na Aimirim. ' +
        'Especialista em digitalização, automação e controle avançado de processos, lidera equipes ' +
        'multidisciplinares na criação de sistemas inteligentes orientados a dados para gerar eficiência ' +
        'e impacto nos negócios.',
      credentials: [],
      links: [
        {
          label: 'Instagram',
          icon: 'fa-brands fa-instagram',
          url: 'https://www.instagram.com/marcos.ant.souza/',
        },
      ],
    },
  },
];

export type TalkStatus = 'upcoming' | 'live' | 'done';

export function isInternationalTalk(talk: Talk): boolean {
  return talk.speaker.origin !== undefined;
}

export function talkStatus(talk: Talk, now: Date = new Date()): TalkStatus {
  const start = new Date(talk.startsAt).getTime();
  const end = start + talk.durationMinutes * 60_000;
  const current = now.getTime();
  if (current < start) return 'upcoming';
  return current <= end ? 'live' : 'done';
}

/** "10 de novembro" — o `dayLabel` sem o dia da semana. */
export function talkDateLabel(talk: Talk): string {
  return talk.dayLabel.split(', ').pop() ?? talk.dayLabel;
}

/** Link "Adicionar ao Google Agenda" com data, horário e descrição da palestra. */
export function talkCalendarUrl(talk: Talk): string {
  const toUtcStamp = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const start = new Date(talk.startsAt);
  const end = new Date(start.getTime() + talk.durationMinutes * 60_000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${talk.title} — NASA Space Apps Uberlândia`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details:
      `Palestra com ${talk.speaker.name} na semana de palestras do NASA Space Apps Uberlândia 2026` +
      `${talk.withPartner ? `, em parceria com o ${TALKS_PARTNER.shortName}` : ''}.\n\n${talk.summary}`,
    location: talk.venue
      ? [talk.venue, talk.venueAddress, 'Uberlândia, MG']
          .filter(Boolean)
          .join(', ')
      : 'Uberlândia, MG',
  });

  return `https://calendar.google.com/calendar/render?${params}`;
}
