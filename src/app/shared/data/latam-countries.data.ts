/** Um país latino-americano, com o nome em PT e a bandeira para a UI. */
export interface LatamCountry {
  name: string;
  flag: string;
}

/**
 * Países da América Latina, indexados pelo nome que a API do Space Apps usa no
 * campo `country` das sedes (em inglês). Precisa bater com LATAM_COUNTRIES em
 * `update_teams.py`, que decide quais sedes entram em `latamTeams.json`.
 *
 * O Caribe anglófono (Jamaica, Trinidad e Tobago…) fica de fora, como na
 * definição usual de América Latina.
 */
export const LATAM_COUNTRIES: Readonly<Record<string, LatamCountry>> = {
  'Argentina': { name: 'Argentina', flag: '🇦🇷' },
  'Bolivia': { name: 'Bolívia', flag: '🇧🇴' },
  'Brazil': { name: 'Brasil', flag: '🇧🇷' },
  'Chile': { name: 'Chile', flag: '🇨🇱' },
  'Colombia': { name: 'Colômbia', flag: '🇨🇴' },
  'Costa Rica': { name: 'Costa Rica', flag: '🇨🇷' },
  'Cuba': { name: 'Cuba', flag: '🇨🇺' },
  'Dominican Republic': { name: 'República Dominicana', flag: '🇩🇴' },
  'Ecuador': { name: 'Equador', flag: '🇪🇨' },
  'El Salvador': { name: 'El Salvador', flag: '🇸🇻' },
  'Guatemala': { name: 'Guatemala', flag: '🇬🇹' },
  'Haiti': { name: 'Haiti', flag: '🇭🇹' },
  'Honduras': { name: 'Honduras', flag: '🇭🇳' },
  'Mexico': { name: 'México', flag: '🇲🇽' },
  'Nicaragua': { name: 'Nicarágua', flag: '🇳🇮' },
  'Panama': { name: 'Panamá', flag: '🇵🇦' },
  'Paraguay': { name: 'Paraguai', flag: '🇵🇾' },
  'Peru': { name: 'Peru', flag: '🇵🇪' },
  'Puerto Rico': { name: 'Porto Rico', flag: '🇵🇷' },
  'Uruguay': { name: 'Uruguai', flag: '🇺🇾' },
  'Venezuela': { name: 'Venezuela', flag: '🇻🇪' },
};
