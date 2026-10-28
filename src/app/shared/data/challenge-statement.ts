import { ChallengeStatement } from './challenge.model';

/**
 * Leitura da marcação dos enunciados (ver `ChallengeStatement`).
 *
 * O modal de detalhes e o carrossel do Instagram desenham a partir dos mesmos
 * blocos, então o texto só é escrito uma vez, em `statements-2026/`.
 */

export interface StatementListItem {
  text: string;
  children: string[];
}

export type StatementBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: StatementListItem[] };

export type StatementSectionId = keyof ChallengeStatement;

export interface StatementSection {
  id: StatementSectionId;
  title: string;
  blocks: StatementBlock[];
}

/** Ordem e nome das seções como aparecem no site e no carrossel. */
export const STATEMENT_SECTIONS: { id: StatementSectionId; title: string }[] = [
  { id: 'background', title: 'Contexto' },
  { id: 'objectives', title: 'Objetivos' },
  { id: 'considerations', title: 'Considerações' }
];

export function parseStatement(source: string): StatementBlock[] {
  const blocks: StatementBlock[] = [];
  let list: StatementListItem[] | null = null;

  for (const rawLine of source.split('\n')) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      list = null;
      continue;
    }

    const child = line.match(/^\s{2,}- (.*)$/);
    if (child && list?.length) {
      list[list.length - 1].children.push(child[1]);
      continue;
    }

    const item = line.match(/^- (.*)$/);
    if (item) {
      if (!list) {
        list = [];
        blocks.push({ kind: 'list', items: list });
      }
      list.push({ text: item[1], children: [] });
      continue;
    }

    list = null;
    const heading = line.match(/^## (.*)$/);
    blocks.push(heading ? { kind: 'heading', text: heading[1] } : { kind: 'paragraph', text: line.trim() });
  }

  return blocks;
}

export function statementSections(statement: ChallengeStatement): StatementSection[] {
  return STATEMENT_SECTIONS.map(section => ({
    ...section,
    blocks: parseStatement(statement[section.id])
  }));
}
