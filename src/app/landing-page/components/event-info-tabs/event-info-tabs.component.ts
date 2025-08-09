import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AwardInfo {
  name: string;
  description: string;
  fullDescription: string;
}

@Component({
  selector: 'app-event-info-tabs',
  imports: [CommonModule],
  templateUrl: './event-info-tabs.component.html',
  styleUrl: './event-info-tabs.component.scss'
})
export class EventInfoTabsComponent {
  activeTab: string = 'evento';
  showModal: boolean = false;
  selectedAward: AwardInfo | null = null;

  awardsInfo: { [key: string]: AwardInfo } = {
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
      fullDescription: 'Premia projetos que excel em comunicar conceitos complexos através de narrativas envolventes. Valoriza-se a capacidade de tornar ciência e tecnologia acessíveis através de histórias cativantes e comunicação eficaz.'
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  openAwardModal(awardName: string): void {
    this.selectedAward = this.awardsInfo[awardName];
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAward = null;
  }
}
