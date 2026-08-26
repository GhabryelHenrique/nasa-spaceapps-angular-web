import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DISCORD_URL,
  MENTOR_FORM_URL,
  REGISTRATION_URL,
  WHATSAPP_URL,
} from '../shared/data/registration.data';

interface Step {
  icon: string;
  title: string;
  description: string;
  /** Detalhes práticos — o que a pessoa vai ver na tela ou precisa ter em mãos. */
  details: string[];
  /** Link de ação opcional do passo. */
  action?: { label: string; url: string; external: boolean };
  /** Prazo relacionado, quando o passo depende do calendário oficial. */
  deadline?: string;
}

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-how-to-register',
  imports: [RouterLink],
  templateUrl: './how-to-register.component.html',
  styleUrl: './how-to-register.component.scss',
})
export class HowToRegisterComponent {
  readonly registrationUrl = REGISTRATION_URL;
  readonly mentorFormUrl = MENTOR_FORM_URL;
  readonly whatsappUrl = WHATSAPP_URL;
  readonly discordUrl = DISCORD_URL;

  /** Índice da pergunta aberta no acordeão; `null` = todas fechadas. */
  readonly openFaq = signal<number | null>(0);

  readonly steps: Step[] = [
    {
      icon: 'ph ph-globe-hemisphere-west',
      title: 'Abra a página da sede Uberlândia',
      description:
        'A inscrição não acontece neste site: ela é feita no site oficial do NASA Space Apps Challenge, na página do evento local de Uberlândia.',
      details: [
        'Confira se a página diz "Uberlândia, Minas Gerais, Brazil" e o ano 2026',
        'A página está em inglês — se quiser, use o tradutor do navegador',
      ],
      action: {
        label: 'Abrir a página oficial de Uberlândia',
        url: REGISTRATION_URL,
        external: true,
      },
    },
    {
      icon: 'ph ph-user-circle-plus',
      title: 'Crie sua conta no Space Apps',
      description:
        'Clique em "Sign Up" no topo da página. A conta é gratuita, individual e serve para todas as edições do Space Apps.',
      details: [
        'Use um e-mail que você acessa com frequência — a confirmação chega nele',
        'Se o e-mail não aparecer em alguns minutos, confira a caixa de spam',
        'Já participou em outro ano? Basta fazer login com a conta antiga',
      ],
    },
    {
      icon: 'ph ph-map-pin',
      title: 'Registre-se no evento local de Uberlândia',
      description:
        'Logado, volte à página de Uberlândia e confirme sua participação no botão de registro do evento local. É esse passo que coloca você na nossa sede.',
      details: [
        'Escolha a participação presencial em Uberlândia',
        'Sem esse passo você fica inscrito no Space Apps, mas fora da sede local',
        'A inscrição é gratuita — nenhuma etapa do evento é paga',
      ],
      action: {
        label: 'Fazer minha inscrição agora',
        url: REGISTRATION_URL,
        external: true,
      },
    },
    {
      icon: 'ph ph-identification-card',
      title: 'Complete seu perfil',
      description:
        'Preencha suas habilidades e interesses. É por esse perfil que outros participantes encontram você na hora de montar equipe.',
      details: [
        'Marque suas áreas: código, design, dados, ciência, negócios, comunicação',
        'Perfis completos aparecem melhor na busca por integrantes',
        'Não é preciso saber programar para participar',
      ],
    },
    {
      icon: 'ph ph-chats-circle',
      title: 'Entre na comunidade de Uberlândia',
      description:
        'Todos os avisos da sede local — horários, local do evento, mentorias e formação de times — saem primeiro no WhatsApp e no Discord.',
      details: [
        'É aqui que a organização responde dúvidas em tempo real',
        'Também é o melhor lugar para encontrar gente procurando time',
      ],
      action: {
        label: 'Entrar no grupo do WhatsApp',
        url: WHATSAPP_URL,
        external: true,
      },
    },
    {
      icon: 'ph ph-users-three',
      title: 'Monte seu time de até 6 pessoas',
      description:
        'A formação de equipes abre em 17 de setembro, junto com os resumos dos desafios e o Guia do Participante.',
      details: [
        'Times têm de 1 a 6 integrantes — dá para se inscrever sozinho e formar time depois',
        'Você pode usar a ferramenta "Find a Team" do site oficial ou a nossa comunidade',
        'Times mistos (tecnologia + design + ciência + comunicação) costumam ir mais longe',
      ],
      deadline: '17 de setembro de 2026',
    },
    {
      icon: 'ph ph-target',
      title: 'Escolha seu desafio',
      description:
        'As declarações oficiais dos desafios saem em 28 de outubro. Até lá, use os resumos para ir estudando os temas que combinam com o time.',
      details: [
        'São dezenas de desafios, de dados de satélite a educação e clima',
        'A escolha final pode ser feita no próprio dia do evento',
      ],
      deadline: '28 de outubro de 2026',
      action: {
        label: 'Ver os desafios',
        url: '/desafios',
        external: false,
      },
    },
    {
      icon: 'ph ph-rocket-launch',
      title: 'Apareça em 14 e 15 de novembro',
      description:
        'São 48 horas de hackathon em Uberlândia. Leve seu notebook, carregador e disposição — o resto a organização resolve.',
      details: [
        'Chegue no horário do credenciamento para não perder a abertura',
        'A submissão do projeto acontece no próprio site do Space Apps, ainda durante o evento',
      ],
      deadline: '14 e 15 de novembro de 2026',
    },
  ];

  readonly mentorSteps: string[] = [
    'Preencha o formulário com sua área de atuação e experiência',
    'A organização local avalia as inscrições e entra em contato por e-mail ou WhatsApp',
    'Você recebe o briefing com horários, formato da mentoria e canal de comunicação',
    'No evento, você orienta os times na sua área — presencialmente, por turnos',
  ];

  readonly faqs: Faq[] = [
    {
      question: 'A inscrição é paga?',
      answer:
        'Não. A participação no NASA Space Apps Challenge é gratuita, tanto no site global quanto na sede de Uberlândia. Nenhuma etapa do evento cobra taxa de inscrição.',
    },
    {
      question: 'Preciso saber programar?',
      answer:
        'Não. Os times precisam de design, ciência, dados, storytelling, negócios e comunicação tanto quanto de código. Vários projetos premiados em Uberlândia foram carregados por quem cuidava da narrativa e da apresentação.',
    },
    {
      question: 'Posso me inscrever sozinho, sem time?',
      answer:
        'Pode. A maioria se inscreve sozinha e forma equipe depois, a partir de 17 de setembro, usando a ferramenta de busca de times do site oficial ou a nossa comunidade no WhatsApp e no Discord.',
    },
    {
      question: 'Quantas pessoas por time?',
      answer:
        'De 1 a 6 integrantes. Todos os membros precisam estar inscritos individualmente no site do Space Apps.',
    },
    {
      question: 'Sou menor de idade. Posso participar?',
      answer:
        'Sim, mas menores de 18 anos precisam de autorização do responsável legal para participar presencialmente. Fale com a organização pelo WhatsApp antes do evento para receber o termo.',
    },
    {
      question: 'Me inscrevi e não recebi e-mail de confirmação. E agora?',
      answer:
        'Confira a caixa de spam e a lixeira. Se não encontrar, tente fazer login no site do Space Apps: se a conta entrar normalmente, o cadastro foi criado. Persistindo o problema, chame a organização no WhatsApp que a gente ajuda.',
    },
    {
      question: 'Qual a diferença entre a inscrição no site da NASA e o formulário de mentoria?',
      answer:
        'A inscrição no site da NASA é para quem vai participar do hackathon como competidor. O formulário de mentoria é da organização de Uberlândia e serve para quem quer atuar como mentor, jurado ou voluntário — nesse caso você não compete.',
    },
    {
      question: 'Posso participar de outra cidade?',
      answer:
        'A sede de Uberlândia é presencial. Se você mora em outra cidade e quer participar aqui, pode — só precisa se organizar para estar presente nos dias 14 e 15 de novembro. Também existe a opção de participação universal (virtual) no site global.',
    },
  ];

  toggleFaq(index: number): void {
    this.openFaq.update(current => (current === index ? null : index));
  }
}
