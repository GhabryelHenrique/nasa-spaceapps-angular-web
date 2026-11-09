/**
 * Patrocinadores da edição 2026, exibidos na faixa de patrocínio da home.
 * Para incluir um novo, basta adicionar um item aqui.
 */

export interface Sponsor2026 {
  name: string;
  /** Versão para fundo escuro (texto branco): vai direto no Deep Blue, sem placa. */
  logo: string;
  url: string;
}

export const SPONSORS_2026: Sponsor2026[] = [
  {
    name: 'Lovable',
    logo: 'assets/sponsors/lovable.svg',
    url: 'https://lovable.dev',
  },
  {
    name: 'Aimirim',
    logo: 'assets/sponsors/aimirim.png',
    url: 'https://www.aimirimsti.com.br',
  },
];
