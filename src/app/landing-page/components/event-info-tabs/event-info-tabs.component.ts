import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type TabId = 'evento' | 'hackathon' | 'desafios' | 'premios';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

interface InfoCard {
  icon: string;
  title: string;
  lines: string[];
}

interface Topic {
  icon: string;
  title: string;
  description: string;
}

interface DifficultyTier {
  slug: 'beginneryouth' | 'intermediate' | 'advanced';
  label: string;
  count: string;
  description: string;
}

interface AwardInfo {
  name: string;
  description: string;
  fullDescription: string;
}

@Component({
  selector: 'app-event-info-tabs',
  imports: [CommonModule, RouterModule],
  templateUrl: './event-info-tabs.component.html',
  styleUrl: './event-info-tabs.component.scss'
})
export class EventInfoTabsComponent {
  readonly tabs: Tab[] = [
    { id: 'evento', label: 'Sobre o Evento', icon: 'ph ph-info' },
    { id: 'hackathon', label: 'O que é o Hackathon', icon: 'ph ph-rocket-launch' },
    { id: 'desafios', label: 'Desafios', icon: 'ph ph-flask' },
    { id: 'premios', label: 'Modalidades e Prêmios', icon: 'ph ph-medal' }
  ];

  readonly activeTab = signal<TabId>('evento');
  readonly showModal = signal(false);
  readonly selectedAward = signal<AwardInfo | null>(null);

  // ── Tab: Sobre o Evento ───────────────────────────────────
  readonly infoCards: InfoCard[] = [
    { icon: 'ph ph-calendar-dots', title: 'Quando', lines: ['14 e 15 de Novembro, 2026', '48 horas de inovação'] },
    { icon: 'ph ph-map-pin', title: 'Onde', lines: ['Toda Uberlândia, MG', 'Múltiplas localizações'] },
    { icon: 'ph ph-users-three', title: 'Equipes', lines: ['2 a 6 pessoas por equipe', 'Todas as idades'] },
    { icon: 'ph ph-trophy', title: 'Prêmios', lines: ['Certificados NASA', 'Prêmios locais e globais'] }
  ];

  // ── Tab: O que é o Hackathon ──────────────────────────────
  readonly howItWorks: string[] = [
    '<strong>Desafios reais:</strong> todos os desafios partem de problemas que a NASA enfrenta de verdade',
    '<strong>Dados abertos:</strong> acesso livre aos dados e recursos da NASA para construir a solução',
    '<strong>48 horas:</strong> tempo limitado para sair da ideia a um protótipo funcional e uma apresentação',
    '<strong>Equipes diversas:</strong> gente de programação, design, ciência, engenharia e curiosos em geral',
    '<strong>Mentoria:</strong> especialistas disponíveis para orientação técnica durante todo o evento'
  ];

  readonly topics: Topic[] = [
    { icon: 'ph ph-globe-hemisphere-west', title: 'Ciências da Terra', description: 'Mudanças climáticas, desastres naturais, agricultura sustentável' },
    { icon: 'ph ph-rocket-launch', title: 'Exploração Espacial', description: 'Missões a Marte, exploração lunar, tecnologias espaciais' },
    { icon: 'ph ph-shooting-star', title: 'Tecnologia Espacial', description: 'Satélites, comunicações, navegação e instrumentação' },
    { icon: 'ph ph-atom', title: 'Ciência Planetária', description: 'Astronomia, astrofísica e ciências planetárias' }
  ];

  // ── Tab: Desafios ─────────────────────────────────────────
  readonly tiers: DifficultyTier[] = [
    {
      slug: 'beginneryouth',
      label: 'Iniciante/Jovem',
      count: '6 desafios',
      description: 'Para quem está começando ou para participantes mais jovens. Focam em criatividade, narrativa e conceitos fundamentais.'
    },
    {
      slug: 'intermediate',
      label: 'Intermediário',
      count: '12 desafios',
      description: 'Pedem conhecimento técnico moderado e habilidade de desenvolvimento. Envolvem análise de dados e prototipagem.'
    },
    {
      slug: 'advanced',
      label: 'Avançado',
      count: '11 desafios',
      description: 'Desafios complexos que exigem expertise avançada, incluindo IA, machine learning e modelagem científica.'
    }
  ];

  readonly highlights: Topic[] = [
    { icon: 'ph ph-planet', title: 'Exoplanetas com IA', description: 'Use inteligência artificial para descobrir novos mundos além do sistema solar.' },
    { icon: 'ph ph-globe-hemisphere-west', title: 'Dados Terra de 25 anos', description: 'Crie animações com o histórico do satélite Terra da NASA.' },
    { icon: 'ph ph-house-line', title: 'Habitats espaciais', description: 'Projete moradias no espaço para futuras missões à Lua e a Marte.' },
    { icon: 'ph ph-flower-lotus', title: 'Floração global', description: 'Monitore padrões de floração pelo mundo usando dados de satélite.' }
  ];

  // ── Tab: Modalidades e Prêmios ────────────────────────────
  readonly awardNames: string[] = [
    'Art & Technology',
    'Best Mission Concept',
    'Best Use of Data',
    'Best Use of Science',
    'Best Use of Storytelling',
    'Best Use of Technology',
    'Galactic Impact',
    'Global Community',
    'Local Impact',
    'Most Inspirational'
  ];

  readonly judgingSteps: Topic[] = [
    { icon: '1', title: 'Avaliação Local', description: 'Juízes locais selecionam os projetos vencedores de cada categoria para competir globalmente como <strong>Global Nominees</strong>.' },
    { icon: '2', title: 'Avaliação Global', description: 'Especialistas da NASA e das agências parceiras avaliam todos os Global Nominees para escolher os <strong>Global Finalists</strong>.' },
    { icon: '3', title: 'Avaliação Executiva', description: 'O comitê executivo da NASA seleciona os <strong>10 Global Winners</strong> entre todos os Global Finalists.' }
  ];

  readonly awardsInfo: Record<string, AwardInfo> = {
    'Art & Technology': {
      name: 'Art & Technology',
      description: 'Projeto que combina arte e tecnologia de forma inovadora',
      fullDescription: 'Este prêmio reconhece projetos que integram criatividade artística com soluções tecnológicas avançadas. Valoriza-se a capacidade de usar tecnologia para criar expressões artísticas únicas ou usar arte para tornar a tecnologia mais acessível e envolvente.'
    },
    'Best Mission Concept': {
      name: 'Best Mission Concept',
      description: 'Conceito mais plausível para uma missão espacial',
      fullDescription: 'Reconhece o projeto com o conceito de missão espacial mais viável e bem estruturado. Considera-se a factibilidade técnica, orçamentária, cronograma realista, objetivos científicos claros e potencial impacto na exploração espacial.'
    },
    'Best Use of Data': {
      name: 'Best Use of Data',
      description: 'Melhor utilização de dados espaciais',
      fullDescription: 'Premia projetos que fazem uso excepcional de dados espaciais da NASA e outras agências. Valoriza-se a capacidade de tornar dados complexos acessíveis, criar visualizações inovadoras ou desenvolver aplicações práticas com dados espaciais.'
    },
    'Best Use of Science': {
      name: 'Best Use of Science',
      description: 'Melhor aplicação do método científico',
      fullDescription: 'Reconhece projetos que demonstram excelência na aplicação de princípios científicos e metodologia rigorosa. Valoriza-se a precisão científica, validação de hipóteses, uso correto de dados e contribuição para o conhecimento científico.'
    },
    'Best Use of Storytelling': {
      name: 'Best Use of Storytelling',
      description: 'Melhor narrativa e comunicação',
      fullDescription: 'Premia projetos que se destacam ao comunicar conceitos complexos através de narrativas envolventes. Valoriza-se a capacidade de tornar ciência e tecnologia acessíveis através de histórias cativantes e comunicação eficaz.'
    },
    'Best Use of Technology': {
      name: 'Best Use of Technology',
      description: 'Uso mais inovador de tecnologia',
      fullDescription: 'Reconhece projetos que demonstram uso excepcional e inovador de tecnologia. Considera-se originalidade na aplicação tecnológica, elegância da solução técnica e potencial de impacto transformador da tecnologia utilizada.'
    },
    'Galactic Impact': {
      name: 'Galactic Impact',
      description: 'Maior potencial de impacto na vida',
      fullDescription: 'Premia o projeto com maior potencial para melhorar significativamente a vida na Terra ou contribuir para a exploração espacial. Valoriza-se o alcance do impacto, sustentabilidade da solução e benefícios para a humanidade.'
    },
    'Global Community': {
      name: 'Global Community',
      description: 'Melhor engajamento com a comunidade global',
      fullDescription: 'Reconhece projetos que promovem colaboração internacional e engajamento com comunidades diversas. Valoriza-se a inclusão, acessibilidade, capacidade de unir pessoas e potencial de replicação em diferentes contextos culturais.'
    },
    'Local Impact': {
      name: 'Local Impact',
      description: 'Maior impacto na comunidade local',
      fullDescription: 'Premia projetos que abordam especificamente desafios da comunidade local onde o evento acontece. Valoriza-se a relevância regional, viabilidade de implementação local e benefícios diretos para a comunidade de Uberlândia.'
    },
    'Most Inspirational': {
      name: 'Most Inspirational',
      description: 'Projeto mais inspirador',
      fullDescription: 'Reconhece o projeto que mais inspira e motiva a comunidade. Valoriza-se a capacidade de despertar paixão pela ciência e tecnologia, motivar outros a inovar e criar esperança para o futuro através de soluções criativas.'
    }
  };

  setActiveTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  /** Navegação por setas dentro do tablist, como manda o padrão ARIA. */
  onTabKeydown(event: KeyboardEvent, index: number): void {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;

    event.preventDefault();
    const next = (index + delta + this.tabs.length) % this.tabs.length;
    this.setActiveTab(this.tabs[next].id);
    (event.currentTarget as HTMLElement)
      .parentElement?.querySelectorAll<HTMLElement>('.tab-btn')[next]?.focus();
  }

  openAwardModal(awardName: string): void {
    this.selectedAward.set(this.awardsInfo[awardName] ?? null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedAward.set(null);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showModal()) this.closeModal();
  }

  awardImage(name: string): string {
    return `assets/awards/${name}.png`;
  }
}
