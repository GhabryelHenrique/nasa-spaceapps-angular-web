import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackRow } from '../../../services/google-sheets.service';

interface FeedbackCategory {
  category: string;
  icon: string;
  color: string;
  items: string[];
  count: number;
}

interface FeedbackInsight {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
  actionItems: string[];
}

interface WordCloud {
  word: string;
  count: number;
  weight: number;
}

@Component({
  selector: 'app-feedback-details',
  imports: [CommonModule],
  templateUrl: './feedback-details.component.html',
  styleUrl: './feedback-details.component.scss'
})
export class FeedbackDetailsComponent implements OnChanges {
  @Input() feedbackData: FeedbackRow[] = [];

  positiveCategories: FeedbackCategory[] = [];
  improvementCategories: FeedbackCategory[] = [];
  highlightsCategories: FeedbackCategory[] = [];

  insights: FeedbackInsight[] = [];
  actionPlan: FeedbackInsight[] = [];

  positiveWordCloud: WordCloud[] = [];
  improvementWordCloud: WordCloud[] = [];

  selectedTab: 'overview' | 'positive' | 'improvements' | 'highlights' | 'insights' = 'overview';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feedbackData'] && this.feedbackData.length > 0) {
      this.analyzeFeedback();
      this.generateInsights();
      this.generateWordClouds();
    }
  }

  private analyzeFeedback(): void {
    // Analisa aspectos positivos
    this.positiveCategories = this.categorizeResponses(
      this.feedbackData.map(f => f.positiveAspects).filter(a => a && a.trim() !== ''),
      [
        { keywords: ['organização', 'organizad', 'estrutura', 'planejamento'], category: 'Organização', icon: '🎯', color: '#4CAF50' },
        { keywords: ['equipe', 'staff', 'voluntário', 'atendimento', 'suporte', 'apoio'], category: 'Equipe', icon: '👥', color: '#2196F3' },
        { keywords: ['comida', 'aliment', 'lanche', 'café', 'refeição'], category: 'Alimentação', icon: '🍕', color: '#FF9800' },
        { keywords: ['local', 'espaço', 'infraestrutura', 'ambiente', 'instalações'], category: 'Local/Infraestrutura', icon: '🏢', color: '#9C27B0' },
        { keywords: ['comunicação', 'informação', 'aviso', 'clareza'], category: 'Comunicação', icon: '💬', color: '#00BCD4' },
        { keywords: ['atividade', 'dinâmica', 'workshop', 'palestra', 'conteúdo'], category: 'Atividades', icon: '🎪', color: '#E91E63' },
        { keywords: ['networking', 'conexão', 'conhecer', 'pessoas', 'interação'], category: 'Networking', icon: '🤝', color: '#3F51B5' }
      ]
    );

    // Analisa sugestões de melhoria
    this.improvementCategories = this.categorizeResponses(
      this.feedbackData.map(f => f.improvementSuggestions).filter(s => s && s.trim() !== ''),
      [
        { keywords: ['tempo', 'horário', 'duração', 'prazo'], category: 'Gestão de Tempo', icon: '⏰', color: '#FF5722' },
        { keywords: ['comida', 'aliment', 'lanche', 'café', 'refeição', 'bebida'], category: 'Alimentação', icon: '🍕', color: '#FF9800' },
        { keywords: ['comunicação', 'informação', 'aviso', 'divulgação'], category: 'Comunicação', icon: '📢', color: '#00BCD4' },
        { keywords: ['espaço', 'sala', 'ambiente', 'climatização', 'ar condicionado', 'temperatura'], category: 'Infraestrutura', icon: '🏗️', color: '#607D8B' },
        { keywords: ['wifi', 'internet', 'conexão', 'rede'], category: 'Conectividade', icon: '📡', color: '#9E9E9E' },
        { keywords: ['atividade', 'conteúdo', 'workshop', 'palestra', 'mentoria'], category: 'Programação', icon: '📚', color: '#795548' },
        { keywords: ['organização', 'planejamento', 'coordenação'], category: 'Organização', icon: '📋', color: '#FF5722' }
      ]
    );

    // Analisa destaques
    this.highlightsCategories = this.categorizeResponses(
      this.feedbackData.map(f => f.highlights).filter(h => h && h.trim() !== ''),
      [
        { keywords: ['palestra', 'speaker', 'apresentação'], category: 'Palestras', icon: '🎤', color: '#4CAF50' },
        { keywords: ['workshop', 'oficina', 'atividade prática'], category: 'Workshops', icon: '🛠️', color: '#2196F3' },
        { keywords: ['networking', 'conhecer', 'pessoas', 'conexões'], category: 'Networking', icon: '🤝', color: '#9C27B0' },
        { keywords: ['projeto', 'desafio', 'hackathon', 'desenvolvimento'], category: 'Desenvolvimento de Projetos', icon: '🚀', color: '#FF9800' },
        { keywords: ['mentoria', 'mentor', 'orientação'], category: 'Mentoria', icon: '👨‍🏫', color: '#00BCD4' },
        { keywords: ['premiação', 'prêmio', 'reconhecimento'], category: 'Premiação', icon: '🏆', color: '#FFC107' }
      ]
    );
  }

  private categorizeResponses(
    responses: string[],
    categoryDefinitions: Array<{ keywords: string[], category: string, icon: string, color: string }>
  ): FeedbackCategory[] {
    const categorized: Map<string, FeedbackCategory> = new Map();
    const uncategorized: string[] = [];

    // Inicializa categorias
    categoryDefinitions.forEach(def => {
      categorized.set(def.category, {
        category: def.category,
        icon: def.icon,
        color: def.color,
        items: [],
        count: 0
      });
    });

    // Categoriza cada resposta
    responses.forEach(response => {
      let foundCategory = false;
      const lowerResponse = response.toLowerCase();

      for (const def of categoryDefinitions) {
        if (def.keywords.some(keyword => lowerResponse.includes(keyword))) {
          const cat = categorized.get(def.category)!;
          cat.items.push(response);
          cat.count++;
          foundCategory = true;
          break;
        }
      }

      if (!foundCategory && response.trim().length > 10) {
        uncategorized.push(response);
      }
    });

    // Adiciona categoria "Outros" se houver itens não categorizados
    if (uncategorized.length > 0) {
      categorized.set('Outros', {
        category: 'Outros',
        icon: '📝',
        color: '#9E9E9E',
        items: uncategorized,
        count: uncategorized.length
      });
    }

    // Retorna apenas categorias com itens, ordenadas por contagem
    return Array.from(categorized.values())
      .filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  private generateInsights(): void {
    this.insights = [];
    this.actionPlan = [];

    // Análise de pontos fortes
    const strongPoints = this.positiveCategories.slice(0, 3);
    if (strongPoints.length > 0) {
      this.insights.push({
        title: '✅ Pontos Fortes Identificados',
        description: `Os participantes destacaram positivamente: ${strongPoints.map(p => p.category).join(', ')}. Mantenha esses aspectos nas próximas edições.`,
        priority: 'low',
        icon: '🌟',
        actionItems: strongPoints.map(p => `Documentar melhores práticas em ${p.category}`)
      });
    }

    // Análise de melhorias críticas
    const criticalImprovements = this.improvementCategories.filter(c => c.count >= this.feedbackData.length * 0.3);
    if (criticalImprovements.length > 0) {
      this.insights.push({
        title: '⚠️ Melhorias Prioritárias',
        description: `Mais de 30% dos participantes sugeriram melhorias em: ${criticalImprovements.map(i => i.category).join(', ')}.`,
        priority: 'high',
        icon: '🎯',
        actionItems: criticalImprovements.map(i => `Criar plano de ação para ${i.category}`)
      });

      // Adiciona ao plano de ação
      criticalImprovements.forEach(improvement => {
        this.actionPlan.push({
          title: `Melhorar ${improvement.category}`,
          description: `${improvement.count} participantes (${Math.round(improvement.count / this.feedbackData.length * 100)}%) mencionaram este aspecto.`,
          priority: 'high',
          icon: improvement.icon,
          actionItems: this.generateActionItemsFor(improvement.category, improvement.items.slice(0, 5))
        });
      });
    }

    // Análise de satisfação vs recomendação
    const wouldRecommend = this.feedbackData.filter(f =>
      f.recommendation?.toLowerCase().includes('sim') ||
      f.recommendation?.toLowerCase().includes('certeza')
    ).length;
    const recommendationRate = Math.round((wouldRecommend / this.feedbackData.length) * 100);

    this.insights.push({
      title: '📊 Taxa de Recomendação',
      description: `${recommendationRate}% dos participantes recomendariam o evento. ${recommendationRate >= 80 ? 'Excelente resultado!' : recommendationRate >= 60 ? 'Bom resultado, mas há espaço para melhorias.' : 'Atenção: taxa abaixo do esperado.'}`,
      priority: recommendationRate < 70 ? 'high' : 'medium',
      icon: recommendationRate >= 80 ? '🎉' : '📈',
      actionItems: recommendationRate < 80 ? [
        'Analisar correlação entre problemas e baixa recomendação',
        'Implementar melhorias sugeridas',
        'Fazer follow-up com participantes insatisfeitos'
      ] : ['Manter padrão de qualidade', 'Compartilhar feedbacks positivos com equipe']
    });

  }

  private generateActionItemsFor(category: string, examples: string[]): string[] {
    const actions: string[] = [];
    const lowerCategory = category.toLowerCase();

    if (lowerCategory.includes('tempo') || lowerCategory.includes('horário')) {
      actions.push(
        'Revisar cronograma com buffer entre atividades',
        'Comunicar horários com antecedência',
        'Considerar estender ou reduzir duração baseado no feedback'
      );
    } else if (lowerCategory.includes('aliment') || lowerCategory.includes('comida')) {
      actions.push(
        'Avaliar qualidade e variedade da alimentação',
        'Considerar restrições alimentares e opções vegetarianas/veganas',
        'Aumentar frequência ou quantidade de lanches'
      );
    } else if (lowerCategory.includes('comunicação')) {
      actions.push(
        'Melhorar canais de comunicação antes e durante o evento',
        'Criar guia do participante mais detalhado',
        'Aumentar sinalização física no local'
      );
    } else if (lowerCategory.includes('infraestrutura') || lowerCategory.includes('espaço')) {
      actions.push(
        'Avaliar capacidade e conforto do espaço',
        'Melhorar climatização e iluminação',
        'Considerar layout mais adequado para atividades'
      );
    } else if (lowerCategory.includes('conectividade') || lowerCategory.includes('wifi')) {
      actions.push(
        'Contratar link de internet com maior capacidade',
        'Ter rede backup redundante',
        'Distribuir melhor pontos de acesso WiFi'
      );
    } else {
      actions.push(
        `Analisar feedbacks específicos sobre ${category}`,
        `Criar comitê para melhorias em ${category}`,
        `Buscar benchmarks de outros eventos`
      );
    }

    return actions;
  }

  private generateWordClouds(): void {
    // Gera word cloud de aspectos positivos
    this.positiveWordCloud = this.extractWordCloud(
      this.feedbackData.map(f => f.positiveAspects).filter(a => a && a.trim() !== '')
    );

    // Gera word cloud de sugestões de melhoria
    this.improvementWordCloud = this.extractWordCloud(
      this.feedbackData.map(f => f.improvementSuggestions).filter(s => s && s.trim() !== '')
    );
  }

  private extractWordCloud(texts: string[]): WordCloud[] {
    // Lista de stopwords em português
    const stopwords = new Set([
      'a', 'o', 'e', 'de', 'da', 'do', 'em', 'um', 'uma', 'os', 'as', 'dos', 'das',
      'para', 'com', 'por', 'no', 'na', 'ao', 'à', 'é', 'ser', 'ter', 'que', 'foi',
      'mais', 'muito', 'já', 'também', 'só', 'ou', 'quando', 'onde', 'como', 'mas',
      'se', 'não', 'ele', 'ela', 'seu', 'sua', 'meu', 'minha', 'esse', 'essa', 'este',
      'esta', 'isso', 'aquele', 'aquela', 'me', 'te', 'nos', 'vos', 'lhe', 'lhes'
    ]);

    const wordCount = new Map<string, number>();

    texts.forEach(text => {
      const words = text
        .toLowerCase()
        .replace(/[^\w\sáéíóúâêîôûãõàèìòùç]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopwords.has(word));

      words.forEach(word => {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      });
    });

    // Converte para array e ordena
    const wordArray = Array.from(wordCount.entries())
      .map(([word, count]) => ({ word, count, weight: 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);

    // Calcula pesos relativos
    const maxCount = wordArray[0]?.count || 1;
    wordArray.forEach(item => {
      item.weight = (item.count / maxCount) * 100;
    });

    return wordArray;
  }

  selectTab(tab: 'overview' | 'positive' | 'improvements' | 'highlights' | 'insights'): void {
    this.selectedTab = tab;
  }

  getPriorityClass(priority: 'high' | 'medium' | 'low'): string {
    return `priority-${priority}`;
  }

  getPriorityLabel(priority: 'high' | 'medium' | 'low'): string {
    const labels = {
      high: 'Alta Prioridade',
      medium: 'Prioridade Média',
      low: 'Baixa Prioridade'
    };
    return labels[priority];
  }
}
