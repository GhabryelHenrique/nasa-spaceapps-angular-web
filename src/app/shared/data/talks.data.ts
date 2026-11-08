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

export interface SpeakerAward {
  /** Selo curto, em destaque: "Vencedora global do NASA Space Apps 2025". */
  title: string;
  /** Complemento do selo: o prêmio e a equipe. */
  detail?: string;
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
  /**
   * Prêmio de destaque (ex.: vencedora global do Space Apps): ganha selo próprio
   * na home, em `/palestras`, nos posts e nas legendas.
   */
  award?: SpeakerAward;
  photo: string;
  /** `object-position` da foto quando o rosto não fica no alto (padrão do CSS: ~18%). */
  photoPosition?: string;
  /** Mini-bio para divulgação, mantendo as palavras de quem enviou (1ª ou 3ª pessoa). */
  bio: string;
  /** Credenciais curtas para os selos do cartão — vazio esconde os selos. */
  credentials: string[];
  links: SpeakerLink[];
}

export interface TalkBrand {
  name: string;
  /** Versão para fundo escuro (texto branco): vai direto no Deep Blue, sem placa. */
  logo: string;
  url: string;
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
  /** Empresa que a pessoa representa: o logo vai no card da palestra e no post. */
  brand?: TalkBrand;
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
    brand: {
      name: 'Aimirim',
      logo: 'assets/sponsors/aimirim.png',
      url: 'https://www.aimirimsti.com.br',
    },
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
  {
    slug: 'robotica-google-gemini',
    title: 'Navegando no universo da robótica com Google Gemini',
    startsAt: '2026-11-11T19:00:00-03:00',
    durationMinutes: 50,
    dayLabel: 'Quarta, 11 de novembro',
    timeLabel: '19h',
    format: 'Palestra · 40–50 min',
    mode: 'Online',
    level: 'Iniciante',
    tags: ['IA', 'Robótica', 'Machine Learning'],
    withPartner: true,
    summary:
      'Como a IA multimodal do Google Gemini está dando "olhos" e "cérebro" para robôs navegarem no ' +
      'mundo real, revolucionando a autonomia, o processamento visual e a tomada de decisão no mundo ' +
      'físico. A sessão traz uma introdução ao Gemini Robotics, a reprodução de um tutorial e um olhar ' +
      'para novas atividades.',
    takeaways: [
      'Como o Gemini interpreta ambientes complexos em tempo real',
      'A tradução de comandos em linguagem natural para ações robóticas',
      'Onde a robótica autônoma vai impactar o mercado nos próximos anos',
    ],
    stack: ['Gemini', 'Gemini Robotics'],
    topics: [],
    challengeSlugs: ['lunar-landing-site-navigator'],
    speaker: {
      name: 'Victor Ulisses Pugliese',
      alias: 'Victor Pugliese',
      role: 'Doutorando em Ciência da Computação',
      organization: 'Unifesp',
      city: 'Caraguatatuba',
      photo: 'assets/speakers/victor-pugliese.jpeg',
      bio:
        'Formado pelo IFSP-Caraguatatuba, Victor é doutorando em Ciência da Computação pela UNIFESP, ' +
        'mestre pelo ITA e reconhecido como Google Developer Expert (GDE) em AI & Cloud. Organizador do ' +
        'GDG Caraguatatuba, acumula mais de 10 anos de experiência na indústria e dezenas de publicações ' +
        'científicas internacionais, com passagem como pesquisador visitante no Instituto Superior Técnico ' +
        'da Universidade de Lisboa. Victor une o melhor dos dois mundos: a profundidade da pesquisa ' +
        'acadêmica com a aplicação prática da tecnologia no ecossistema de inovação 🚀',
      credentials: [
        'Google Developer Expert em AI & Cloud',
        'Organizador do GDG Caraguatatuba',
        'Mestre pelo ITA',
      ],
      links: [
        {
          label: 'Instagram',
          icon: 'fa-brands fa-instagram',
          url: 'https://www.instagram.com/victorpug.exe/',
        },
      ],
    },
  },
  {
    slug: 'pureflow-da-participacao-ao-premio-global',
    title:
      'Da Participação ao Prêmio Global: A Experiência da Pureflow no NASA Space Apps 2025',
    startsAt: '2026-11-13T19:00:00-03:00',
    durationMinutes: 50,
    dayLabel: 'Sexta, 13 de novembro',
    timeLabel: '19h',
    format: 'Palestra · 40–50 min',
    mode: 'Online',
    level: 'Todos os níveis',
    tags: ['Hackathon', 'Design de Produto', 'Colaboração'],
    summary:
      'Do desafio local ao reconhecimento global: a experiência de participar do NASA Space Apps Challenge ' +
      'e os aprendizados de três edições do evento, a partir da trajetória da equipe Pureflow, vencedora ' +
      'do prêmio Global Best Mission Concept em 2025. A palestra aborda a colaboração entre diferentes ' +
      'áreas, a compreensão do desafio, a definição de uma proposta de valor e a prototipagem de uma ' +
      'solução com tempo limitado, mostrando que a participação em um hackathon vai além do resultado ' +
      'final. O objetivo é inspirar novos participantes a trabalhar de forma colaborativa e a enxergar os ' +
      'desafios como oportunidades para aprender, experimentar e criar soluções com potencial de impacto.',
    takeaways: [
      'Como transformar um desafio complexo em uma ideia de solução clara e viável dentro do tempo limitado de um hackathon',
      'A importância da colaboração multidisciplinar e de combinar diferentes habilidades para construir um projeto mais completo',
      'Aprendizados e estratégias da jornada da Pureflow, do NASA Space Apps ao prêmio Global Best Mission Concept em 2025',
    ],
    stack: [],
    topics: [
      'Como acessar e usar os dados abertos da NASA (Earthdata, APIs, catálogos)',
      'Prototipagem rápida: do zero ao MVP em 48h',
      'Critérios de avaliação do Space Apps e o que a NASA valoriza',
    ],
    challengeSlugs: [],
    speaker: {
      name: 'Laiza Leal de Souza',
      role: 'Estudante de Ciência da Computação e UI/UX Designer',
      organization: 'Universidade Tiradentes',
      city: 'Aracaju',
      award: {
        title: 'Vencedora global do NASA Space Apps 2025',
        detail: 'Best Mission Concept com a equipe Pureflow',
      },
      photo: 'assets/speakers/laiza-leal.jpeg',
      photoPosition: '55% 40%',
      bio:
        'Laiza Leal é estudante de Ciência da Computação, formada em Design Gráfico e atua com UI/UX Design ' +
        'e interfaces para produtos digitais. Participou do NASA Space Apps Challenge por três anos ' +
        'consecutivos e, em 2025, integrou a equipe Pureflow, vencedora do prêmio Global Best Mission ' +
        'Concept. Tem interesse em tecnologia, inovação e design centrado nas pessoas.',
      // O prêmio já tem selo próprio (`award`): aqui só o que complementa.
      credentials: ['3 edições do NASA Space Apps', 'Formada em Design Gráfico'],
      links: [
        {
          label: 'LinkedIn',
          icon: 'fa-brands fa-linkedin',
          url: 'https://www.linkedin.com/in/laiza-leal-de-souza-0947b9282',
        },
      ],
    },
  },
  {
    slug: 'lovable-do-prompt-ao-deploy',
    title: 'Do prompt ao deploy: um app full-stack com Lovable em 48 horas',
    // Horário e duração ainda não confirmados — 9h é o início do hackathon.
    startsAt: '2026-11-14T09:00:00-03:00',
    durationMinutes: 40,
    dayLabel: 'Sábado, 14 de novembro',
    venue: 'ESAMC Uberlândia',
    venueAddress: 'Av. Vasconcelos Costa, 270 - Bairro Martins',
    timeLabel: '9h',
    format: 'Palestra de abertura',
    mode: 'Presencial',
    level: 'Intermediário',
    tags: ['IA', 'Vibe Coding', 'Full-stack'],
    summary:
      'A abertura do hackathon com a mão no código: uma demonstração técnica de como sair de uma ideia ' +
      'para um app full-stack funcionando com o Lovable, a plataforma que gera e edita código a partir de ' +
      'conversas em linguagem natural. Ao vivo, construímos um protótipo que consome dados abertos da NASA, ' +
      'com front-end em React e TypeScript e banco de dados, autenticação e funções de backend no Supabase, ' +
      'e sincronizamos tudo com o GitHub para o time seguir no editor que preferir. A sessão mostra ainda ' +
      'como escrever prompts que mantêm o código consistente, como depurar quando a IA erra e como publicar ' +
      'o projeto com um link pronto para a submissão.',
    takeaways: [
      'Como planejar e escrever prompts que mantêm o código gerado consistente do começo ao fim do projeto',
      'Backend sem sair do Lovable: banco de dados, autenticação e funções no Supabase',
      'Fluxo de time no hackathon: sincronização com o GitHub, depuração e publicação com link para a submissão',
    ],
    stack: ['Lovable', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'GitHub'],
    topics: [
      'IA generativa como copiloto durante o hackathon',
      'Do protótipo ao link publicado para a submissão',
    ],
    challengeSlugs: [],
    brand: {
      name: 'Lovable',
      logo: 'assets/sponsors/lovable.svg',
      url: 'https://lovable.dev',
    },
    speaker: {
      name: 'Lucio Amorim',
      role: 'Partner no Brasil',
      organization: 'Lovable',
      photo: 'assets/speakers/lucio-amorim.png',
      photoPosition: '50% 30%',
      bio:
        'Lucio Amorim é Lovable Partner no Brasil, atuando na expansão da plataforma junto a empresas, ' +
        'instituições e comunidades. Pioneiro na realização de hackathons da Lovable no país, acumula mais ' +
        'de 20 anos de experiência em GTM e estratégia de negócios em startups e grandes empresas como ' +
        'Shell e Petrobras.',
      credentials: [
        'Lovable Partner no Brasil',
        'Pioneiro nos hackathons da Lovable no país',
        '20+ anos em GTM e estratégia',
      ],
      links: [
        {
          label: 'Instagram',
          icon: 'fa-brands fa-instagram',
          url: 'https://www.instagram.com/lucioamorim.ai/',
        },
      ],
    },
  },
];

export type TalkStatus = 'upcoming' | 'live' | 'done';

export function isInternationalTalk(talk: Talk): boolean {
  return talk.speaker.origin !== undefined;
}

/** Palestra só online, sem local físico: no lugar do endereço, avisa do link da transmissão. */
export function isOnlineTalk(talk: Talk): boolean {
  return talk.mode === 'Online' && !talk.venue;
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
      : isOnlineTalk(talk)
        ? 'Online'
        : 'Uberlândia, MG',
  });

  return `https://calendar.google.com/calendar/render?${params}`;
}
