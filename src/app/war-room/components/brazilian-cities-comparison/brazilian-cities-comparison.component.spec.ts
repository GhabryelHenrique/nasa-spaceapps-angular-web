import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { BrazilianCitiesComparisonComponent } from './brazilian-cities-comparison.component';
import { CityParticipation } from '../../../shared/interfaces/local-event.interface';

/** Sedes como a plataforma as devolve: caixa irregular, acentos e outros países. */
const CITIES: CityParticipation[] = [
  { city: 'Uberlândia', country: 'Brazil', registrations: 100, eventType: 'In-Person', url: '' },
  { city: 'São Paulo', country: 'Brazil', registrations: 97, eventType: 'Virtual', url: '' },
  { city: 'ARACAJU', country: 'Brazil', registrations: 90, eventType: 'In-Person', url: '' },
  { city: 'balneário camboriú', country: 'Brazil', registrations: 48, eventType: 'Virtual', url: '' },
  { city: 'Cairo', country: 'Egypt', registrations: 500, eventType: 'In-Person', url: '' },
];

function teamsFile(locationName: string, submitted: number, notSubmitted: number) {
  return {
    data: [
      {
        locationName,
        locationId: 'id:1',
        teams: {
          totalCount: submitted + notSubmitted,
          edges: [
            ...Array.from({ length: submitted }, () => ({ node: { projectSubmitted: true } })),
            ...Array.from({ length: notSubmitted }, () => ({ node: { projectSubmitted: false } })),
          ],
        },
      },
    ],
  };
}

describe('BrazilianCitiesComparisonComponent', () => {
  let fixture: ComponentFixture<BrazilianCitiesComparisonComponent>;
  let component: BrazilianCitiesComparisonComponent;
  let httpMock: HttpTestingController;

  /** Responde aos dois GETs da edição: a sede da casa e as demais. */
  function flushTeams(year: number, home: object, others: object): void {
    httpMock.expectOne(`/assets/data/${year}/teams.json`).flush(home);
    httpMock.expectOne(`/assets/data/${year}/otherCitiesTeams.json`).flush(others);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrazilianCitiesComparisonComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(BrazilianCitiesComparisonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cities', CITIES);
    fixture.componentRef.setInput('year', 2026);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('mantém só as sedes brasileiras, ordenadas por inscritos', () => {
    flushTeams(2026, teamsFile('Uberlândia', 0, 8), { data: [] });

    expect(component.rows().map(row => row.cityName)).toEqual([
      'Uberlândia',
      'São Paulo',
      'Aracaju',
      'Balneário Camboriú',
    ]);
    expect(component.totalCities()).toBe(4);
    expect(component.totalRegistrations()).toBe(335);
  });

  it('posiciona Uberlândia por inscritos e calcula sua fatia do Brasil', () => {
    flushTeams(2026, teamsFile('Uberlândia', 0, 8), { data: [] });

    expect(component.registrationsRank()).toBe(1);
    expect(component.uberlandia()?.registrations).toBe(100);
    expect(component.registrationsShare()).toBeCloseTo(29.85, 2);
  });

  it('mede a distância para a sede vizinha no ranking', () => {
    flushTeams(2026, teamsFile('Uberlândia', 0, 8), { data: [] });

    expect(component.registrationsNeighbor()).toEqual({
      city: 'São Paulo',
      gap: 3,
      isLeading: true,
    });
  });

  it('cruza times por sede mesmo com acento e caixa divergentes', () => {
    flushTeams(2026, teamsFile('Uberlândia', 0, 8), {
      data: [
        teamsFile('Sao Paulo', 0, 11).data[0],
        teamsFile('ARACAJU', 0, 6).data[0],
      ],
    });

    const byCity = new Map(component.rows().map(row => [row.cityName, row.totalTeams]));
    expect(byCity.get('Uberlândia')).toBe(8);
    expect(byCity.get('São Paulo')).toBe(11);
    expect(byCity.get('Aracaju')).toBe(6);
    // Sede sem entrada no crawler não some do ranking; entra zerada.
    expect(byCity.get('Balneário Camboriú')).toBe(0);

    expect(component.totalTeams()).toBe(25);
    expect(component.teamsRank()).toBe(2);
  });

  it('esconde as métricas de projeto enquanto ninguém submeteu', () => {
    flushTeams(2026, teamsFile('Uberlândia', 0, 8), { data: [] });

    expect(component.hasTeams()).toBeTrue();
    expect(component.hasSubmissions()).toBeFalse();
    expect(fixture.nativeElement.querySelector('.rate-cell')).toBeNull();
    expect(fixture.nativeElement.querySelector('.registrations-cell')).not.toBeNull();
  });

  it('exibe taxa de submissão quando a edição já tem projetos', () => {
    // A instância nasce em 2026; projetos submetidos só existem em 2025.
    flushTeams(2026, teamsFile('Uberlândia', 0, 8), { data: [] });

    fixture.componentRef.setInput('year', 2025);
    fixture.detectChanges();
    flushTeams(2025, teamsFile('Uberlândia', 95, 65), {
      data: [teamsFile('Sao Paulo', 10, 10).data[0]],
    });

    expect(component.hasSubmissions()).toBeTrue();
    expect(component.totalSubmitted()).toBe(105);
    expect(component.uberlandia()?.submissionRate).toBeCloseTo(59.375, 3);
    // Média só entre sedes com time: (59.375 + 50) / 2.
    expect(component.averageSubmissionRate()).toBeCloseTo(54.6875, 3);
    expect(fixture.nativeElement.querySelector('.rate-cell')).not.toBeNull();
  });

  it('recarrega ao trocar de edição', () => {
    flushTeams(2026, teamsFile('Uberlândia', 0, 8), { data: [] });
    expect(component.totalTeams()).toBe(8);

    fixture.componentRef.setInput('year', 2025);
    fixture.detectChanges();
    flushTeams(2025, teamsFile('Uberlândia', 95, 65), { data: [] });

    expect(component.totalTeams()).toBe(160);
    expect(component.hasSubmissions()).toBeTrue();
  });

  it('mantém o ranking de inscritos quando os times falham', () => {
    httpMock.expectOne('/assets/data/2026/otherCitiesTeams.json')
      .flush({ data: [] });
    httpMock.expectOne('/assets/data/2026/teams.json')
      .error(new ProgressEvent('erro'));
    fixture.detectChanges();

    expect(component.teamsUnavailable()).toBeTrue();
    expect(component.hasTeams()).toBeFalse();
    expect(component.registrationsRank()).toBe(1);
    expect(component.rows().length).toBe(4);
  });
});
