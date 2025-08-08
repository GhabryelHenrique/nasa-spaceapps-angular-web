# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
NASA Space Apps Challenge landing page built with Angular 19. This is a Portuguese/Brazilian application for promoting and managing registrations for the NASA Space Apps Challenge in Uberlândia, Brazil. Features Discord OAuth authentication and a space-themed responsive design.

## Development Commands

### Common Commands
- `npm start` or `ng serve` - Start development server (http://localhost:4200)
- `npm run build` or `ng build` - Build for production
- `npm run watch` or `ng build --watch --configuration development` - Build with file watching for development
- `npm test` or `ng test` - Run unit tests with Karma/Jasmine

### Build Configurations
- Production build: `ng build --configuration production` (default)
- Development build: `ng build --configuration development`

## Architecture

### Application Structure
- **Landing Page**: Main component with event information and Discord login
- **Discord Authentication**: Complete OAuth flow with callback handling
- **Services**: Centralized Discord authentication service with user state management

### Key Components
- `LandingPageComponent` - Main landing page with space theme
- `DiscordCallbackComponent` - Handles Discord OAuth callback at `/auth/discord/callback`
- `DiscordAuthService` - Manages authentication state, localStorage persistence, and Discord API integration

### Routing
- `/` - Landing page
- `/auth/discord/callback` - Discord OAuth callback
- Wildcard redirects to main page

### Styling
- SCSS preprocessing enabled
- Space-themed design with gradients (blues/purples: #4ecdc4, #45b7d1, #5865F2)
- Responsive design optimized for desktop, tablet, and mobile
- Inter font from Google Fonts

## Key Configuration Files
- `angular.json` - Angular CLI configuration with SCSS support
- `app.config.ts` - Application providers (router, HTTP client, zone change detection)
- `app.routes.ts` - Route definitions
- `src/styles.scss` - Global styles

## Discord Integration
The application requires Discord OAuth setup. See `DISCORD_CONFIG.md` for detailed configuration instructions. The `DiscordAuthService` expects backend endpoints at `/api/discord/token` and `/api/discord/user` for OAuth token exchange and user data retrieval.

### Discord Service Features
- OAuth flow initiation
- Token exchange handling
- User state persistence in localStorage
- Platform-aware browser checks for SSR compatibility
- RxJS observables for reactive user state management

## Important Notes
- Uses Angular 19 with standalone components architecture
- Platform-aware service implementation for SSR compatibility
- Client credentials in `discord-auth.service.ts` need to be replaced with actual Discord app credentials
- Requires backend API for Discord OAuth token exchange
- Portuguese language interface targeting Brazilian users