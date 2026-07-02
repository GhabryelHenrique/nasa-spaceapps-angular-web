import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sponsorship',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sponsorship.component.html',
  styleUrl: './sponsorship.component.scss'
})
export class SponsorshipComponent {
  showLightbox = signal(false);

  openLightbox(): void {
    this.showLightbox.set(true);
  }

  closeLightbox(): void {
    this.showLightbox.set(false);
  }

  metrics = [
    { value: '1.400+', label: 'Participantes em Uberlândia' },
    { value: '160+', label: 'Equipes Inscritas' },
    { value: '100+', label: 'Projetos Submetidos' },
    { value: '30%', label: 'Das inscrições de todo o Brasil' },
    { value: '🏆 #1', label: 'Maior sede do Hemisfério Ocidental' },
    { value: '+500k', label: 'Views no Instagram no evento' }
  ];

  benefits = [
    {
      icon: '🛸',
      title: 'Marca em Órbita',
      description: 'Sua marca associada diretamente ao NASA Space Apps Challenge, a maior hackathon do mundo, agregando alto valor e inovação de ponta.'
    },
    {
      icon: '🧠',
      title: 'Acesso Direto ao Talento',
      description: 'Conecte-se diretamente com mais de 1.400 desenvolvedores, designers, engenheiros e mentes criativas do ecossistema local.'
    },
    {
      icon: '⚡',
      title: 'Alcance Exponencial',
      description: 'Mais de 1 milhão de interações em redes sociais em 60 dias e mais de 500 mil visualizações por edição do evento.'
    }
  ];

  tiers = [
    {
      name: 'Diamante',

      icon: '💎',
      highlighted: true,
      slots: '1 vaga (única)',
      features: [
        'Logotipo com Destaque Máximo no site e materiais',
        'Logotipo Principal nas camisetas do evento',
        'Exibição destacada no telão e no palco',
        'Espaço de ativação Premium (Estande) no local',
        'Tempo de fala na Abertura + Premiação',
        'Desafio próprio patrocinado pela marca',
        'Acesso irrestrito ao banco de talentos',
        '3+ Posts dedicados nas redes sociais',
        'Menção em vídeo/podcast pós-evento',
        'Indicação de mentores e jurados',
        'Exclusividade de categoria'
      ]
    },
    {
      name: 'Ouro',

      icon: '🥇',
      highlighted: false,
      slots: '3 vagas',
      features: [
        'Logotipo com Destaque no site e materiais',
        'Logotipo nas camisetas do evento',
        'Exibição no telão e no palco',
        'Espaço de ativação no local',
        'Tempo de fala na Premiação',
        'Desafio patrocinado (Opcional)',
        'Acesso completo ao banco de talentos',
        '2 Posts dedicados nas redes sociais',
        'Menção em vídeo/podcast pós-evento',
        'Indicação de mentores e jurados'
      ]
    },
    {
      name: 'Prata',

      icon: '🥈',
      highlighted: false,
      slots: '6 vagas',
      features: [
        'Logotipo no site e materiais oficiais',
        'Logotipo nas camisetas do evento',
        'Exibição no telão e no palco',
        'Acesso completo ao banco de talentos',
        '1 Post dedicado nas redes sociais'
      ]
    },
    {
      name: 'Bronze',

      icon: '🥉',
      highlighted: false,
      slots: 'Ilimitadas',
      features: [
        'Logotipo no site e materiais oficiais',
        'Logotipo nas camisetas (Reduzido)',
        'Post dedicado agrupado nas redes sociais'
      ]
    },
    {
      name: 'Apoio',
      price: 'Permuta',
      icon: '🤝',
      highlighted: false,
      slots: 'Ilimitadas',
      features: [
        'Cota voltada para alimentação, espaço, transporte ou brindes',
        'Logo no site e materiais oficiais',
        'Menção nas redes sociais',
        'Contrapartida proporcional ao valor da permuta'
      ]
    }
  ];

  tableData = [
    { contrapartida: 'Logo no site e materiais oficiais', diamante: 'Destaque máx.', ouro: 'Destaque', prata: '✓', bronze: '✓', apoio: 'Logo' },
    { contrapartida: 'Logo nas camisetas do evento', diamante: 'Principal', ouro: '✓', prata: '✓', bronze: 'Reduzido', apoio: '-' },
    { contrapartida: 'Marca no telão e no palco', diamante: '✓', ouro: '✓', prata: '✓', bronze: '-', apoio: '-' },
    { contrapartida: 'Estande / espaço de ativação no local', diamante: 'Premium', ouro: '✓', prata: '-', bronze: '-', apoio: '-' },
    { contrapartida: 'Tempo de fala', diamante: 'Abertura + prem.', ouro: 'Premiação', prata: '-', bronze: '-', apoio: '-' },
    { contrapartida: 'Desafio patrocinado pela marca', diamante: '✓', ouro: 'Opcional', prata: '-', bronze: '-', apoio: '-' },
    { contrapartida: 'Acesso ao banco de talentos', diamante: '✓', ouro: '✓', prata: '✓', bronze: '-', apoio: '-' },
    { contrapartida: 'Posts dedicados nas redes sociais', diamante: '3+', ouro: '2', prata: '1', bronze: 'Agrupado', apoio: 'Menção' },
    { contrapartida: 'Menção em vídeo / podcast pós-evento', diamante: '✓', ouro: '✓', prata: '-', bronze: '-', apoio: '-' },
    { contrapartida: 'Indicação de mentores e jurados', diamante: '✓', ouro: '✓', prata: '-', bronze: '-', apoio: '-' },
    { contrapartida: 'Exclusividade de categoria', diamante: '✓', ouro: '-', prata: '-', bronze: '-', apoio: '-' },
    { contrapartida: 'Cotas disponíveis', diamante: '1 (única)', ouro: '3', prata: '6', bronze: 'Ilimitado', apoio: 'Ilimitado' }
  ];

  contactWhatsApp(): void {
    window.open('https://wa.me/5534984432264?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20as%20cotas%20de%20patroc%C3%ADnio%20do%20NASA%20Space%20Apps%20Uberl%C3%A2ndia.', '_blank');
  }

  contactEmail(): void {
    window.open('mailto:ghabryelcode@gmail.com?subject=Patrocínio%20NASA%20Space%20Apps%20Uberlândia', '_blank');
  }
}
