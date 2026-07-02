import { Injectable } from '@angular/core';
import { InscritoRow, MentorRow, FeedbackRow } from '../../services/google-sheets.service';
import { TeamData } from '../../services/nasa-teams.service';

export interface LabelCount {
  label: string;
  count: number;
}

export interface InscritosExtras {
  interestAreaStats: LabelCount[];
  cumulative: { date: string; total: number }[];
  peakDay: { date: string; count: number } | null;
  under18Count: number;
  under18Pct: number;
  distinctCities: number;
  firstDate: Date | null;
  lastDate: Date | null;
}

export interface MentoresInsights {
  total: number;
  availabilityStats: LabelCount[];
  slotStats: LabelCount[];
  areaStats: LabelCount[];
  educationStats: LabelCount[];
  orgStats: LabelCount[];
  postgradCount: number;
  postgradPct: number;
  referredPct: number;
}

export interface RatingDistribution {
  name: string;
  counts: Record<string, number>;
  responses: number;
  score: number; // média ponderada na escala 1(pior)–5(melhor)
}

export interface QualitativeItem {
  text: string;
  role: string;
}

export interface FeedbackInsights {
  total: number;
  nps: { score: number; promoters: number; passives: number; detractors: number };
  overallAvg: number;
  overallDist: LabelCount[];
  ratingAverages: { label: string; avg: number }[];
  venueRatings: RatingDistribution[];
  talkRatings: RatingDistribution[];
  roleStats: LabelCount[];
  modeStats: LabelCount[];
  teamFormation: { yes: number; no: number };
  firstTimers: number;
  quotes: {
    liked: QualitativeItem[];
    toImprove: QualitativeItem[];
    mustHave: QualitativeItem[];
    final: QualitativeItem[];
  };
}

export interface TeamsInsights {
  totalTeams: number;
  submitted: number;
  submissionRate: number;
  totalMembers: number;
  avgTeamSize: number;
  challengeStats: { label: string; total: number; submitted: number }[];
}

/** Escala usada nas grades de locais e palestras, da melhor para a pior. */
export const CATEGORICAL_SCALE = ['Excelente', 'Boa', 'OK', 'Ruim', 'Muito Ruim'];

// Opções do formulário de mentores contêm vírgulas no próprio texto
// ("Produto, Inovação e Criatividade"), então o split simples por vírgula
// quebraria as respostas — o match é feito por opção conhecida.
const MENTOR_AREA_OPTIONS = [
  'Estratégia para o Hackathon e Vencedores de Edições Anteriores',
  'Linguagens, Comunicação e Storytelling (Pitch)',
  'Energia, Meio Ambiente e Ciências da Terra',
  'Desenvolvimento de Software e Ciência de Dados',
  'Inteligência Artificial e/ou Machine Learning',
  'Agricultura e Sistemas Alimentares',
  'Produto, Inovação e Criatividade',
  'Design e Experiência do Usuário',
  'Saúde e Ciências Biológicas',
  'Astronomia e Astrofísica',
  'Hardware e Protótipos',
  'Negócios e Finanças',
  'Educação e Pesquisa',
  'Engenharias',
];

const SLOT_ORDER = [
  { match: ['10h - 16h', 'sabado'], label: 'Sáb 10h–16h' },
  { match: ['16h - 22h', 'sabado'], label: 'Sáb 16h–22h' },
  { match: ['22h - 04h', 'sabado'], label: 'Sáb 22h–04h' },
  { match: ['04h - 10h', 'domingo'], label: 'Dom 04h–10h' },
  { match: ['10h - 16h', 'domingo'], label: 'Dom 10h–16h' },
  { match: ['16h - 22h', 'domingo'], label: 'Dom 16h–22h' },
];

const POSTGRAD_KEYWORDS = ['mestr', 'doutor', 'pos-doutorado', 'pos-graduacao', 'lato sensu', 'especialista'];

@Injectable({ providedIn: 'root' })
export class WarRoomInsightsService {

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private countBy(values: string[]): LabelCount[] {
    const map = new Map<string, number>();
    values.filter(v => v !== '').forEach(v => map.set(v, (map.get(v) || 0) + 1));
    return [...map.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  // ── Inscritos ────────────────────────────────────────────────────────────

  buildInscritosExtras(rows: InscritoRow[]): InscritosExtras {
    const areaMap = new Map<string, number>();
    rows.forEach(row => {
      row.interestAreas
        .split(',')
        .map(a => a.trim())
        .filter(a => a !== '')
        .forEach(area => areaMap.set(area, (areaMap.get(area) || 0) + 1));
    });
    const interestAreaStats = [...areaMap.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const dailyMap = new Map<string, number>();
    const dates = rows.map(r => r.timestamp).filter((d): d is Date => d !== null);
    dates.forEach(date => {
      const key = date.toISOString().split('T')[0];
      dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
    });
    const daily = [...dailyMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

    let running = 0;
    const cumulative = daily.map(([date, count]) => {
      running += count;
      return { date, total: running };
    });

    const peak = daily.reduce<{ date: string; count: number } | null>(
      (best, [date, count]) => (!best || count > best.count ? { date, count } : best),
      null
    );

    const under18Count = rows.filter(row => {
      const age = this.ageFromBirthDate(row.birthDate, row.timestamp);
      return age !== null && age < 18;
    }).length;

    const cities = new Set(rows.map(r => this.normalize(r.city)).filter(c => c !== ''));

    return {
      interestAreaStats,
      cumulative,
      peakDay: peak,
      under18Count,
      under18Pct: rows.length ? Math.round((under18Count / rows.length) * 100) : 0,
      distinctCities: cities.size,
      firstDate: dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : null,
      lastDate: dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : null,
    };
  }

  private ageFromBirthDate(birthDate: string, reference: Date | null): number | null {
    const match = birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;
    const [, day, month, year] = match;
    const birth = new Date(+year, +month - 1, +day);
    if (isNaN(birth.getTime())) return null;
    const ref = reference || new Date(2025, 9, 4); // fim de semana do evento
    let age = ref.getFullYear() - birth.getFullYear();
    const monthDiff = ref.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) age--;
    return age >= 5 && age <= 100 ? age : null;
  }

  // ── Mentores ─────────────────────────────────────────────────────────────

  buildMentoresInsights(rows: MentorRow[]): MentoresInsights {
    const availabilityStats = this.countBy(rows.map(row => {
      const value = this.normalize(row.availability);
      if (value.includes('presencial')) return 'Presencial (Uberlândia)';
      if (value.includes('remoto')) return 'Remoto (Discord)';
      return value === '' ? '' : 'Outro';
    }));

    const slotCounts = new Map<string, number>();
    rows.forEach(row => {
      const value = this.normalize(row.timeSlot);
      const slot = SLOT_ORDER.find(s => s.match.every(m => value.includes(this.normalize(m))));
      if (slot) slotCounts.set(slot.label, (slotCounts.get(slot.label) || 0) + 1);
    });
    const slotStats = SLOT_ORDER
      .map(s => ({ label: s.label, count: slotCounts.get(s.label) || 0 }))
      .filter(s => s.count > 0);

    const areaStats = this.splitByKnownOptions(rows.map(r => r.areas), MENTOR_AREA_OPTIONS);

    const educationStats = this.countBy(rows.map(r => this.normalizeEducation(r.education)));

    const orgStats = this.countBy(rows.map(r => this.normalizeOrganization(r.organization)))
      .filter(o => o.label !== '—')
      .slice(0, 8);

    const postgradCount = rows.filter(row => {
      const value = this.normalize(row.education);
      return POSTGRAD_KEYWORDS.some(k => value.includes(k));
    }).length;

    const referred = rows.filter(row => {
      const value = this.normalize(row.referredBy);
      return value !== '' && value !== 'nao' && !value.startsWith('nao ') && value !== 'nao.';
    }).length;

    return {
      total: rows.length,
      availabilityStats,
      slotStats,
      areaStats,
      educationStats,
      orgStats,
      postgradCount,
      postgradPct: rows.length ? Math.round((postgradCount / rows.length) * 100) : 0,
      referredPct: rows.length ? Math.round((referred / rows.length) * 100) : 0,
    };
  }

  /**
   * Conta respostas multi-seleção cujas opções podem conter vírgulas:
   * remove da resposta cada opção conhecida encontrada e só depois trata o
   * restante como itens avulsos.
   */
  private splitByKnownOptions(values: string[], options: string[]): LabelCount[] {
    const counts = new Map<string, number>();
    let otherCount = 0;

    values.forEach(value => {
      let rest = value;
      options.forEach(option => {
        const index = this.normalize(rest).indexOf(this.normalize(option));
        if (index >= 0) {
          counts.set(option, (counts.get(option) || 0) + 1);
          // remove a opção do texto para não recontar pedaços dela
          const pattern = option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          rest = rest.replace(new RegExp(pattern, 'i'), '');
        }
      });
      const leftovers = rest.split(',').map(p => p.trim()).filter(p => p.length > 2);
      otherCount += leftovers.length;
    });

    const stats = [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
    if (otherCount > 0) stats.push({ label: 'Outras', count: otherCount });
    return stats;
  }

  private normalizeEducation(value: string): string {
    const v = this.normalize(value);
    if (v === '') return '';
    if (v.includes('fundamental')) return 'Ensino Fundamental';
    if (v.includes('medio') && (v.includes('cursando') || v.includes('andamento') || v.includes('incompleto'))) {
      return 'Cursando Ensino Médio';
    }
    if (v.includes('medio')) return 'Ensino Médio Completo';
    if (v.includes('graduando')) return 'Graduando Ensino Superior';
    if (v.includes('superior')) return 'Ensino Superior Completo';
    if (v.includes('pos-doutorado')) return 'Pós-doutorado';
    if (v.includes('doutor')) return 'Doutorado';
    if (v.includes('mestr')) return 'Mestrado';
    if (v.includes('pos') || v.includes('lato sensu') || v.includes('especialista')) return 'Pós-graduação';
    return value;
  }

  private normalizeOrganization(value: string): string {
    const v = this.normalize(value);
    if (v === '' || v === '-' || v === 'nao' || v.includes('nenhum')) return '—';
    if (v.includes('ufu') || v.includes('federal de uberlandia')) return 'UFU';
    if (v.includes('sebrae')) return 'Sebrae';
    if (v.includes('sankhya')) return 'Sankhya';
    if (v.includes('iftm')) return 'IFTM';
    return value.trim();
  }

  // ── Feedback ─────────────────────────────────────────────────────────────

  buildFeedbackInsights(rows: FeedbackRow[]): FeedbackInsights {
    const npsScores = rows.map(r => r.recommendationScore).filter((n): n is number => n !== null);
    const promoters = npsScores.filter(n => n >= 9).length;
    const passives = npsScores.filter(n => n >= 7 && n < 9).length;
    const detractors = npsScores.filter(n => n < 7).length;
    const npsScore = npsScores.length
      ? Math.round(((promoters - detractors) / npsScores.length) * 100)
      : 0;

    const overallValues = rows.map(r => r.overallSatisfaction).filter((n): n is number => n !== null);
    const overallDist = [1, 2, 3, 4, 5].map(n => ({
      label: `${n}`,
      count: overallValues.filter(v => v === n).length,
    }));

    const ratingAverages = [
      { label: 'Comunicação pré-evento', values: rows.map(r => r.communicationRating) },
      { label: 'Clareza do cronograma', values: rows.map(r => r.scheduleClarity) },
      { label: 'Suporte dos mentores', values: rows.map(r => r.mentorsSupport) },
      { label: 'Equipe de voluntários', values: rows.map(r => r.volunteersQuality) },
      { label: 'Servidor do Discord', values: rows.map(r => r.discordStructure) },
      { label: 'Diversidade dos desafios', values: rows.map(r => r.challengesDiversity) },
      { label: 'Satisfação com o projeto', values: rows.map(r => r.projectSatisfaction) },
    ].map(item => ({ label: item.label, avg: this.average(item.values) }));

    const venueRatings = this.buildRatingDistributions(rows.map(r => r.venues));
    const talkRatings = this.buildRatingDistributions(rows.map(r => r.talks));

    const teamAnswers = rows.map(r => this.normalize(r.teamFormationEasy)).filter(v => v !== '');
    const teamFormation = {
      yes: teamAnswers.filter(v => v.startsWith('sim')).length,
      no: teamAnswers.filter(v => v.startsWith('nao')).length,
    };

    const previous = rows.map(r => this.normalize(r.previousParticipation)).filter(v => v !== '');
    const firstTimers = previous.filter(v => v.includes('nao') || v.includes('primeira')).length;

    const quote = (text: string, role: string): QualitativeItem | null => {
      const trimmed = text.trim();
      if (trimmed.length < 3 || this.normalize(trimmed) === 'nao') return null;
      return { text: trimmed, role: role || 'Participante' };
    };

    return {
      total: rows.length,
      nps: { score: npsScore, promoters, passives, detractors },
      overallAvg: this.average(rows.map(r => r.overallSatisfaction)),
      overallDist,
      ratingAverages,
      venueRatings,
      talkRatings,
      roleStats: this.countBy(rows.map(r => r.role)),
      modeStats: this.countBy(rows.map(r => r.participationMode)),
      teamFormation,
      firstTimers,
      quotes: {
        liked: rows.map(r => quote(r.liked, r.role)).filter((q): q is QualitativeItem => q !== null),
        toImprove: rows.map(r => quote(r.toImprove, r.role)).filter((q): q is QualitativeItem => q !== null),
        mustHave: rows.map(r => quote(r.mustHave, r.role)).filter((q): q is QualitativeItem => q !== null),
        final: rows.map(r => quote(r.finalComments, r.role)).filter((q): q is QualitativeItem => q !== null),
      },
    };
  }

  private average(values: (number | null)[]): number {
    const valid = values.filter((n): n is number => n !== null && n > 0);
    if (!valid.length) return 0;
    return Math.round((valid.reduce((sum, n) => sum + n, 0) / valid.length) * 10) / 10;
  }

  private buildRatingDistributions(maps: Record<string, string>[]): RatingDistribution[] {
    const names = new Set<string>();
    maps.forEach(m => Object.keys(m).forEach(name => names.add(name)));

    return [...names].map(name => {
      const counts: Record<string, number> = {};
      CATEGORICAL_SCALE.forEach(scale => (counts[scale] = 0));
      let responses = 0;
      let weighted = 0;

      maps.forEach(m => {
        const raw = (m[name] || '').trim();
        if (raw === '') return;
        const scale = this.matchScale(raw);
        if (!scale) return;
        counts[scale]++;
        responses++;
        weighted += 5 - CATEGORICAL_SCALE.indexOf(scale); // Excelente=5 … Muito Ruim=1
      });

      return {
        name,
        counts,
        responses,
        score: responses ? Math.round((weighted / responses) * 10) / 10 : 0,
      };
    }).sort((a, b) => b.score - a.score);
  }

  private matchScale(value: string): string | null {
    const v = this.normalize(value);
    if (v.includes('excelente')) return 'Excelente';
    if (v.includes('boa') || v === 'bom') return 'Boa';
    if (v === 'ok') return 'OK';
    if (v.includes('muito ruim')) return 'Muito Ruim';
    if (v.includes('ruim')) return 'Ruim';
    return null;
  }

  // ── Times ────────────────────────────────────────────────────────────────

  buildTeamsInsights(teams: TeamData[]): TeamsInsights {
    const submitted = teams.filter(t => t.projectSubmitted).length;
    const totalMembers = teams.reduce((sum, t) => sum + (t.memberships?.length || 0), 0);

    const challengeMap = new Map<string, { total: number; submitted: number }>();
    teams.forEach(team => {
      const title = team.challengeDetails?.title || 'Sem desafio';
      const entry = challengeMap.get(title) || { total: 0, submitted: 0 };
      entry.total++;
      if (team.projectSubmitted) entry.submitted++;
      challengeMap.set(title, entry);
    });

    const challengeStats = [...challengeMap.entries()]
      .map(([label, { total, submitted: sub }]) => ({ label, total, submitted: sub }))
      .sort((a, b) => b.total - a.total);

    return {
      totalTeams: teams.length,
      submitted,
      submissionRate: teams.length ? Math.round((submitted / teams.length) * 100) : 0,
      totalMembers,
      avgTeamSize: teams.length ? Math.round((totalMembers / teams.length) * 10) / 10 : 0,
      challengeStats,
    };
  }
}
