# Configuração do Discord OAuth

Para que o sistema de login via Discord funcione, você precisa configurar uma aplicação Discord e atualizar as credenciais no código.

## 1. Criar Aplicação Discord

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Dê um nome para sua aplicação (ex: "NASA Space Apps Uberlândia")
4. Vá para a seção "OAuth2" > "General"

## 2. Configurar OAuth2

- **Client ID**: Copie o Client ID da sua aplicação
- **Client Secret**: Gere e copie o Client Secret
- **Redirect URIs**: Adicione as seguintes URLs:
  - `http://localhost:4200/auth/discord/callback` (para desenvolvimento)
  - `https://nasaspaceappsuberlandia.com.br/auth/discord/callback` (para produção)

## 3. Atualizar o Código

Edite o arquivo `src/app/services/discord-auth.service.ts` e substitua:

```typescript
private readonly CLIENT_ID = 'YOUR_DISCORD_CLIENT_ID';
private readonly CLIENT_SECRET = 'YOUR_DISCORD_CLIENT_SECRET';
```

Por suas credenciais reais do Discord.

## 4. Backend (Necessário)

O frontend precisa de um backend para trocar o código OAuth por tokens. Você pode implementar endpoints:

- `POST /api/discord/token` - Troca código por access_token
- `GET /api/discord/user` - Busca dados do usuário

## 5. Estrutura da Aplicação

- **Landing Page** (`/`): Página principal com informações do evento
- **Callback** (`/auth/discord/callback`): Processa retorno do Discord
- **Autenticação**: Gerenciada pelo `DiscordAuthService`

## Funcionalidades Implementadas

✅ Landing page responsiva com design espacial  
✅ Integração OAuth Discord  
✅ Serviço de autenticação  
✅ Gerenciamento de estado do usuário  
✅ Roteamento configurado  
✅ Design responsivo  

## Para Testar

1. Configure as credenciais Discord
2. Execute `npm start`
3. Acesse `http://localhost:4200`
4. Clique em "Entrar com Discord"