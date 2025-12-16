# 🚀 NASA Space Apps Challenge - Uberlândia 2024/2025

Landing page e plataforma completa para divulgação e gerenciamento do NASA Space Apps Challenge em Uberlândia, Brasil.

> **Website:** [nasaspaceappsuberlandia.com.br](https://nasaspaceappsuberlandia.com.br)

## 🌟 Sobre o Projeto

Esta aplicação web foi desenvolvida para promover, gerenciar e facilitar as inscrições no maior hackathon espacial do mundo - o NASA Space Apps Challenge. A plataforma oferece uma experiência moderna e intuitiva para participantes, permitindo visualização de times, estatísticas, matchmaking para formação de equipes e muito mais.

## ✨ Funcionalidades

### 🎨 Landing Page e Interface
- Landing Page responsiva com tema espacial moderno
- Design responsivo otimizado para desktop, tablet e mobile
- Interface bilíngue (Português BR / Inglês) com i18n
- Seções de informações do evento, desafios, cronograma e patrocinadores
- Sistema de navegação com header e footer personalizados
- Mapas interativos com eventos globais

### 🔐 Autenticação e Perfis
- Sistema de autenticação por email com código de 6 dígitos
- Criação e gerenciamento de perfis de usuários
- Guards de autenticação para rotas protegidas
- Persistência de sessão com localStorage
- Dashboard personalizado para usuários autenticados

### 👥 Sistema de Times e Matchmaking
- Visualização de times registrados em Uberlândia
- Sistema de matchmaking inteligente para formar equipes
- Visualização de perfis de participantes
- Filtros e busca avançada de times
- Detalhes completos de times vencedores
- Integração com API oficial da NASA Space Apps Challenge

### 📊 War Room (Sala de Guerra)
- Dashboard de estatísticas em tempo real
- Gráficos interativos de participação por país
- Mapas de registros com Leaflet
- Comparação entre cidades brasileiras
- Comparação entre cidades do mundo
- Gráficos de desafios mais populares
- Análise de feedbacks dos participantes

### 🗺️ Mapas e Visualizações
- Mapa interativo de eventos globais (Google Maps / Leaflet)
- Mapa de registros e participação
- Visualização geográfica de times e participantes
- Integração com @angular/google-maps e Leaflet

### 📈 Análises e Relatórios
- Gráficos com Chart.js e ng2-charts
- Estatísticas de participação
- Análise de desafios mais escolhidos
- Exportação de dados com XLSX
- Comparações entre diferentes cidades

## 🛠️ Tecnologias Utilizadas

### Framework e Core
- **Angular 19.2** - Framework principal com standalone components
- **TypeScript 5.7** - Linguagem de programação
- **RxJS 7.8** - Programação reativa
- **Zone.js 0.15** - Change detection

### UI e Visualização
- **SCSS** - Pré-processador CSS
- **Chart.js 4.5** - Biblioteca de gráficos
- **ng2-charts 6.0** - Wrapper Angular para Chart.js
- **SweetAlert2 11.23** - Modais e alertas elegantes
- **Inter (Google Fonts)** - Tipografia principal

### Mapas
- **@angular/google-maps 20.2** - Google Maps para Angular
- **Leaflet 1.9** - Mapas interativos open source
- **@types/leaflet 1.9** - Definições TypeScript para Leaflet

### Internacionalização
- **@angular/localize 20.2** - Sistema de i18n
- Suporte para pt-BR (padrão) e en-US

### Ferramentas de Desenvolvimento
- **Angular CLI 19.2** - Interface de linha de comando
- **Karma + Jasmine** - Framework de testes
- **angular-cli-ghpages 2.0** - Deploy para GitHub Pages
- **XLSX 0.18** - Manipulação de planilhas Excel

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18+)
- npm (versão 8+)
- Angular CLI 19+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nasa-spaceapps-angular-web.git

# Acesse o diretório
cd nasa-spaceapps-angular-web

# Instale as dependências
npm install
```

### Executar em Desenvolvimento

```bash
# Modo desenvolvimento com proxy (recomendado)
npm start

# Modo desenvolvimento sem proxy
npm run start:no-proxy

# Build com watch mode
npm run watch
```

A aplicação estará disponível em `http://localhost:4200/`

### Proxy de Desenvolvimento

O projeto inclui configuração de proxy (`proxy.conf.json`) para facilitar desenvolvimento com backend local. O comando `npm start` automaticamente usa esta configuração.

## 🔧 Configurações e Build

### Build para Produção

```bash
# Build padrão (produção)
npm run build

# Build específico para português
ng build --configuration pt

# Build específico para inglês
ng build --configuration en
```

Os arquivos de build ficam em `dist/nasa-spaceapps-angular-web/browser/`

### Deploy Automatizado

```bash
# Deploy completo (commit + build + GitHub Pages)
npm run deploy
```

Este comando executa:
1. Commit automático das alterações
2. Build de produção
3. Deploy para GitHub Pages

### Análise de Bundle

```bash
# Build com estatísticas
ng build --stats-json

# Análise do bundle
npx webpack-bundle-analyzer dist/nasa-spaceapps-angular-web/browser/stats.json
```

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes com coverage
ng test --coverage

# Executar testes e2e
ng e2e
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── landing-page/              # Página principal
│   │   └── components/
│   │       ├── header/            # Cabeçalho com navegação
│   │       ├── hero-section/      # Seção hero principal
│   │       ├── challenges-section/ # Seção de desafios
│   │       ├── event-info-tabs/   # Abas de informações
│   │       ├── events-map/        # Mapa de eventos
│   │       ├── sponsors-section/  # Patrocinadores
│   │       └── uberlandia-highlights/ # Destaques de Uberlândia
│   │
│   ├── components/
│   │   ├── auth/                  # Componentes de autenticação
│   │   │   └── login.component.ts
│   │   ├── dashboard/             # Dashboard do usuário
│   │   ├── profile-create/        # Criação de perfil
│   │   └── matches/               # Sistema de matches
│   │
│   ├── matchmaking/               # Sistema de matchmaking
│   │   └── matchmaking-dashboard.component.ts
│   │
│   ├── teams/                     # Visualização de times
│   │   └── teams.component.ts
│   │
│   ├── participants/              # Listagem de participantes
│   │   └── participants.component.ts
│   │
│   ├── challenges/                # Página de desafios
│   │   └── challenges.component.ts
│   │
│   ├── war-room/                  # Sala de guerra (estatísticas)
│   │   ├── war-room.component.ts
│   │   └── components/
│   │       ├── registration-map/  # Mapa de registros
│   │       ├── registration-charts/ # Gráficos de registros
│   │       ├── challenge-chart/   # Gráfico de desafios
│   │       ├── participants-by-country-chart/
│   │       ├── brazilian-cities-comparison/
│   │       ├── world-cities-comparison/
│   │       └── feedback-details/
│   │
│   ├── winner-team-detail/        # Detalhes de times vencedores
│   │   └── winner-team-detail.component.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── auth.service.ts    # Autenticação
│   │   │   └── matchmaking.service.ts
│   │   ├── teams.service.ts       # Gerenciamento de times
│   │   ├── nasa-teams.service.ts  # API NASA
│   │   ├── other-cities-teams.service.ts
│   │   ├── winner-teams.service.ts
│   │   ├── registration-data.service.ts
│   │   ├── google-sheets.service.ts
│   │   └── linkedin.service.ts
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── email-verification-modal/
│   │   │   ├── code-verification-modal/
│   │   │   └── team-preferences-modal/
│   │   ├── language-switcher/     # Alternador de idiomas
│   │   └── services/
│   │       └── matchmaking.service.ts
│   │
│   ├── core/
│   │   └── footer/                # Rodapé
│   │
│   ├── guards/
│   │   └── auth.guard.ts          # Guard de autenticação
│   │
│   ├── models/                    # Interfaces e tipos
│   │   └── auth.models.ts
│   │
│   ├── privacy-policy/            # Política de privacidade
│   │   └── privacy-policy.component.ts
│   │
│   ├── app.routes.ts              # Configuração de rotas
│   ├── app.config.ts              # Configuração da aplicação
│   └── app.component.ts           # Componente raiz
│
├── assets/                        # Recursos estáticos
│   ├── data/                      # Dados JSON
│   │   ├── teams.json             # Times de Uberlândia
│   │   ├── otherCitiesTeams.json  # Times de outras cidades
│   │   ├── registrations.json     # Dados de inscrições
│   │   ├── localEvents.json       # Eventos locais
│   │   ├── winner-teams.json      # Times vencedores
│   │   └── inscricao_nasa.xlsx    # Planilha de inscrições
│   ├── images/                    # Imagens
│   ├── awards/                    # Imagens de prêmios
│   ├── sponsors/                  # Logos de patrocinadores
│   ├── organizers/                # Organizadores
│   └── winners/                   # Times vencedores
│
├── locale/                        # Arquivos de tradução i18n
│   └── messages.en.xlf            # Traduções para inglês
│
├── environments/                  # Configurações de ambiente
│   └── environment.ts
│
├── styles.scss                    # Estilos globais
├── index.html                     # HTML principal
├── main.ts                        # Entry point
├── robots.txt                     # SEO
├── sitemap.xml                    # SEO
└── site.webmanifest              # PWA manifest

angular.json                       # Configuração Angular CLI
proxy.conf.json                   # Configuração de proxy
tsconfig.json                      # Configuração TypeScript
package.json                       # Dependências
```

## 🎯 Rotas Disponíveis

| Rota | Componente | Descrição | Autenticação |
|------|-----------|-----------|--------------|
| `/` | LandingPageComponent | Página inicial | Não |
| `/login` | LoginComponent | Login com email | Não |
| `/dashboard` | DashboardComponent | Dashboard do usuário | Sim ✓ |
| `/profile/create` | ProfileCreateComponent | Criar perfil | Sim ✓ |
| `/matches` | MatchesComponent | Matches de equipe | Sim ✓ |
| `/desafios` | ChallengesComponent | Lista de desafios | Não |
| `/times` | TeamsComponent | Times registrados | Não |
| `/times-vencedores/:slug` | WinnerTeamDetailComponent | Detalhes do time vencedor | Não |
| `/sala-de-guerra` | WarRoomComponent | Estatísticas e análises | Não |
| `/matchmaking` | MatchmakingDashboardComponent | Dashboard de matchmaking | Não |
| `/participantes` | ParticipantsComponent | Lista de participantes | Não |
| `/politica-privacidade` | PrivacyPolicyComponent | Política de privacidade | Não |

## 🎨 Design System

### Paleta de Cores
- **Primárias:** Gradientes azuis e roxos (#4ecdc4, #45b7d1, #5865F2)
- **Secundárias:** Vermelho espacial (#ff6b6b) e tons de cinza
- **Tema:** Inspirado no espaço com efeitos de gradiente e partículas

### Tipografia
- **Fonte Principal:** Inter (Google Fonts)
- **Fallback:** system-ui, -apple-system, sans-serif

### Componentes
- Animações suaves com transições CSS
- Hover effects em cards e botões
- Modais responsivos com SweetAlert2
- Cards informativos com glass morphism
- Gráficos interativos com Chart.js

## 🌍 Internacionalização (i18n)

O projeto suporta múltiplos idiomas usando @angular/localize:

### Idiomas Disponíveis
- **pt-BR** (Português Brasil) - Idioma padrão
- **en-US** (Inglês) - Tradução completa

### Extrair Textos para Tradução

```bash
ng extract-i18n --output-path src/locale
```

### Build com Idioma Específico

```bash
# Português (padrão)
ng build --configuration pt

# Inglês
ng build --configuration en
```

### Servir com Idioma Específico

```bash
# Português
ng serve --configuration pt

# Inglês
ng serve --configuration en
```

## 🔌 Integração com APIs

### API da NASA Space Apps Challenge
- Endpoint: `https://api.spaceappschallenge.org/graphql`
- Queries GraphQL para times, desafios e eventos
- Autenticação via access token

### API Backend Local
O projeto está configurado para se comunicar com um backend local:
- Auth endpoints: `/api/registration/*`
- Matchmaking endpoints: `/api/matchmaking/*`
- Proxy configurado em `proxy.conf.json`

### Dados Locais (JSON)
Para desenvolvimento e fallback, usa dados em JSON:
- `assets/data/teams.json` - Times de Uberlândia
- `assets/data/otherCitiesTeams.json` - Times globais
- `assets/data/registrations.json` - Dados de registros
- `assets/data/winner-teams.json` - Times vencedores

## 🚀 Features Implementadas

### Core
- ✅ Landing page responsiva com múltiplas seções
- ✅ Sistema de roteamento completo
- ✅ Design system consistente e tema espacial
- ✅ Suporte a i18n (pt-BR / en-US)
- ✅ SEO otimizado (robots.txt, sitemap.xml)
- ✅ PWA manifest configurado

### Autenticação e Usuários
- ✅ Sistema de autenticação por email + código
- ✅ Gerenciamento de estado do usuário
- ✅ Guards de autenticação
- ✅ Persistência de sessão
- ✅ Dashboard personalizado
- ✅ Criação de perfis

### Times e Matchmaking
- ✅ Visualização de times registrados
- ✅ Sistema de matchmaking inteligente
- ✅ Filtros e busca avançada
- ✅ Integração com API NASA
- ✅ Detalhes de times vencedores
- ✅ Visualização de participantes

### Estatísticas e Análises
- ✅ War Room com dashboard completo
- ✅ Gráficos interativos (Chart.js)
- ✅ Mapas de registros (Leaflet)
- ✅ Comparações entre cidades
- ✅ Análise de feedbacks
- ✅ Estatísticas de desafios

### Deploy e Otimização
- ✅ Build otimizado para produção
- ✅ Deploy automatizado para GitHub Pages
- ✅ Proxy de desenvolvimento
- ✅ Tratamento de erros
- ✅ Performance otimizada

## 🔄 Roadmap

### Próximas Features
- [ ] Sistema de notificações em tempo real
- [ ] Chat entre membros de equipes
- [ ] Sistema de avaliação de projetos
- [ ] Gamificação com badges e conquistas
- [ ] PWA completo com offline support
- [ ] Integração com LinkedIn API
- [ ] Sistema de recomendação de equipes
- [ ] Analytics avançado

### Melhorias Planejadas
- [ ] Testes E2E completos
- [ ] Documentação de componentes com Storybook
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento de erros (Sentry)
- [ ] Performance monitoring
- [ ] Acessibilidade (WCAG 2.1)

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Diretrizes de Contribuição
- Siga o style guide do Angular
- Escreva testes para novas features
- Mantenha o código documentado
- Use commits semânticos
- Atualize a documentação quando necessário

## 📊 Configuração de Budgets

O projeto está configurado com budgets generosos para suportar todas as bibliotecas:

- **Initial Bundle:** Warning em 50MB, Error em 100MB
- **Component Styles:** Warning em 10MB, Error em 20MB

## 🔒 Segurança

- Autenticação baseada em email com códigos temporários
- Guards de rota para proteção de páginas
- Validação de dados no frontend e backend
- Política de privacidade implementada
- CORS configurado adequadamente

## 📝 Variáveis de Ambiente

Configure o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato e Links

- **Website:** [nasaspaceappsuberlandia.com.br](https://nasaspaceappsuberlandia.com.br)
- **Email:** contato@nasaspaceappsuberlandia.com.br
- **GitHub:** [github.com/seu-usuario/nasa-spaceapps-angular-web](https://github.com/seu-usuario/nasa-spaceapps-angular-web)

## 🙏 Agradecimentos

- **NASA** - Pelo Space Apps Challenge
- **Equipe de Uberlândia** - Organizadores e voluntários
- **Participantes** - Pela energia e criatividade
- **Patrocinadores** - Pelo apoio ao evento

## 🌟 Créditos

Desenvolvido com ❤️ para o **NASA Space Apps Challenge 2024/2025 - Uberlândia** 🚀

### Tecnologias Utilizadas
- Angular Team - Framework incrível
- NASA - API e recursos oficiais
- OpenStreetMap - Mapas open source
- Chart.js - Visualizações de dados
- SweetAlert2 - UX aprimorada

---

⭐ **Se este projeto te ajudou, deixe uma estrela!** ⭐

**#SpaceApps #NASA #Uberlândia #Hackathon #Angular #OpenSource**
