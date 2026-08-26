# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
NASA Space Apps Challenge web app built with Angular 22 (standalone components). Portuguese/Brazilian application for promoting and managing the NASA Space Apps Challenge in Uberlândia, Brazil. Includes a public landing site and a logged-in portal (teams, invites, join requests, challenges, mentors) backed by the NestJS API in the sibling repo `../nasa-spaceapps-api`.

## Development Commands
- `npm start` - Dev server with proxy (http://localhost:4200); proxy only matters for the war-room/NASA stats pages
- `npm run start:no-proxy` or `ng serve` - Dev server without proxy
- `npm run build` - Production build (uses fileReplacements → `environment.prod.ts`)
- `npm test` - Unit tests (Karma/Jasmine)
- Backend for local dev: in `../nasa-spaceapps-api`, `docker compose up -d postgres`, `npx prisma migrate deploy && npx prisma db seed`, then `npm run start:dev` (API at http://localhost:3000, Swagger at /docs)

## Architecture

### API integration (`src/app/core/`)
- `core/api/api.models.ts` - TypeScript interfaces mirroring the NestJS API responses exactly (UserResponse, TeamResponse, InviteResponse, JoinRequestResponse, Challenge, PublicUser, ApiError)
- `core/api/*.service.ts` - Thin HTTP services: TeamsService, InvitesService, JoinRequestsService, ChallengesService, MentorService, UsersService, GamificationService. Base URL comes from `environment.apiUrl` (dev: http://localhost:3000)
- `core/auth/auth.service.ts` - Signal-based auth state (`user`, `isAuthenticated`, `role`, `isMentor`, `isParticipant`). JWT stored in `localStorage['spaceapps.token']`, user cache in `spaceapps.user`. Register chains auto-login (API returns no token on register). Session revalidated at boot via `provideAppInitializer` + `GET /auth/me`
- `core/auth/auth.interceptor.ts` - Attaches `Authorization: Bearer` only to requests targeting `environment.apiUrl`
- `core/interceptors/http-error.interceptor.ts` - Maps errors to PT strings (API messages take priority; `message` can be `string[]`). 401 outside `/auth/login` → silent logout + redirect to `/login?returnUrl=`. Components receive a plain string via `throwError`
- `core/auth/auth.guard.ts` - Functional guards: `authGuard`, `guestGuard`, `roleGuard(role)` factory
- `core/ui/toast.ts` - sweetalert2 helpers (toastSuccess/toastError/confirmDialog) in dark theme

### Features (`src/app/features/`)
- `auth/login`, `auth/register` - Reactive forms; register sends name, email, password, role, CPF (documentId + documentType 'CPF'), phone, birthDate (yyyy-MM-dd), acceptedTerms
- `portal/portal-layout` - Sub-nav shell at `/app` with role-aware tabs (participant: Início/Minha Equipe/Equipes/Convites/Perfil; mentor: Início/Equipes/Mentoria/Perfil)
- `portal/home` - Context-aware (no team → create/find CTAs + invites preview; has team → summary; mentor → assigned count)
- `portal/my-team` - Team management; leader-only panel: user search (`GET /users?search=`, min 2 chars, debounced) to invite, join-requests approve/reject, remove member, challenge selector (**replace semantics** on `POST /teams/:id/challenges`)
- `portal/teams-browse`, `portal/team-detail` - Search + request-to-join (participants without team only)
- `portal/invites` - Received invites; accepting auto-cancels other pending invites/requests (API rule)
- `portal/profile` - View + edit mode. Edit form covers all mutable fields (name, phone, birthDate, gender, institution, course, shirtSize, github/linkedin URLs, emergency contact, full address) via `PATCH /users/me` (`AuthService.updateProfile`, which refreshes the user signal). Email/CPF/role are not editable
- `portal/achievements` - Gamification page: level + XP bar, summary stats, objectives (progress bars), achievement cards (unlocked/locked). Data from `GET /gamification/me` (GamificationService). Achievements/objectives are derived server-side from real state (profile completion, team membership, leadership, challenges, mentors) — no separate storage
- `portal/mentor` - Mentor-only; lists teams, self-assign via `POST /mentor/teams/:id/assign`
- `features/_shared.scss` - Shared mixins (glass-card, form-field, buttons, feedback-states, status-chips)

### API business rules mirrored in UI
Participant belongs to max 1 team; team max 6 members; only leader invites/approves/removes/selects challenges; mentors can't join/be invited to teams. No leave-team/delete-team/cancel-invite/edit-profile in API v1. No refresh token — 401 requires re-login.

### Routing (`app.routes.ts`)
Public: `''` (landing), `desafios`, `como-se-inscrever`, `times`, `times-vencedores/:slug`, `sala-de-guerra`, `participantes`, `patrocinio`, `politica-privacidade`. Auth: `login`, `cadastro` (guestGuard). Portal: `/app/**` (authGuard; `minha-equipe`/`convites` PARTICIPANT-only, `mentor` MENTOR-only via roleGuard). All lazy `loadComponent`.

### Test users (API seed)
- `ana@spaceapps.local` / `ana12345` (PARTICIPANT, leader of "Equipe Estelar")
- `bruno@spaceapps.local` / `bruno12345` (PARTICIPANT)
- `mentor@spaceapps.local` / `mentor123` (MENTOR)

## Styling
- Dark space theme only. Design tokens are CSS custom properties in `src/styles/_variables.scss` (--nasa-blue #0960E1, --nasa-red #E43700, --bg-primary #000, gradients, shadows)
- Fonts: Fira Sans (headings), Overpass (body). Icons: Font Awesome kit (index.html)
- SCSS per component; portal pages import mixins from `features/_shared.scss`
- Global shell: `<app-header>` + `<router-outlet>` + `<app-footer>` on every route; starfield background in `styles.scss`

## Key Configuration
- `src/environments/environment.ts` - dev, `apiUrl: http://localhost:3000`
- `src/environments/environment.prod.ts` - prod apiUrl (swapped in via fileReplacements in angular.json)
- `proxy.conf.json` - proxies `/api/*` to api.spaceappschallenge.org (NASA global stats only; the local API is called directly via absolute URL + CORS)

## Important Notes
- **Inscrições 2026**: participantes se inscrevem no site da NASA (não há formulário próprio); mentores/jurados/voluntários usam um Google Form da organização local. Ambas as URLs (mais WhatsApp/Discord/Instagram) ficam centralizadas em `src/app/shared/data/registration.data.ts` — altere lá, não nos templates
- Angular 22, standalone components, signals for state; no NgModules
- No SSR (client-only build, deployed to GitHub Pages via `npm run build-deploy`)
- Portuguese-first UI; API error messages are already in Portuguese and are displayed verbatim
