# 🚀 NASA Space Apps Challenge - Uberlândia 2024

Landing page oficial para divulgação do NASA Space Apps Challenge em Uberlândia, Brasil. 

> **Website:** [nasaspaceappsuberlandia.com.br](https://nasaspaceappsuberlandia.com.br)

## 🌟 Sobre o Projeto

Esta aplicação web foi desenvolvida para promover e facilitar as inscrições no maior hackathon espacial do mundo - o NASA Space Apps Challenge. A plataforma oferece uma experiência moderna e intuitiva para participantes interessados em resolver desafios reais da NASA.

## ✨ Funcionalidades

- 🎨 **Landing Page Responsiva** - Design moderno com tema espacial
- 🔐 **Autenticação Discord** - Sistema de login exclusivo via Discord OAuth
- 📱 **Design Responsivo** - Otimizado para desktop, tablet e mobile
- ⚡ **Performance** - Construído com Angular 19 e otimizações modernas
- 🌙 **Tema Espacial** - Interface imersiva com gradientes e animações

## 🛠️ Tecnologias Utilizadas

- **Angular 19** - Framework principal
- **TypeScript** - Linguagem de programação
- **SCSS** - Pré-processador CSS
- **Discord OAuth** - Sistema de autenticação
- **RxJS** - Programação reativa
- **Angular Router** - Roteamento

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18+)
- npm ou yarn
- Angular CLI 19+

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nasa-spaceapps-angular-web.git

# Acesse o diretório
cd nasa-spaceapps-angular-web

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm start
```

A aplicação estará disponível em `http://localhost:4200/`

## 🔧 Configuração do Discord

Para configurar o sistema de login via Discord, siga as instruções no arquivo [`DISCORD_CONFIG.md`](./DISCORD_CONFIG.md).

Resumidamente, você precisa:
1. Criar uma aplicação no [Discord Developer Portal](https://discord.com/developers/applications)
2. Configurar as URLs de callback
3. Atualizar as credenciais no arquivo `src/app/services/discord-auth.service.ts`

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── landing-page/           # Componente da página principal
│   ├── auth/
│   │   └── discord-callback/   # Callback do Discord OAuth
│   ├── services/
│   │   └── discord-auth.service.ts  # Serviço de autenticação
│   ├── app.routes.ts           # Configuração de rotas
│   └── app.config.ts           # Configuração da aplicação
├── assets/                     # Recursos estáticos
└── styles.scss                 # Estilos globais
```

## 🎯 Páginas Disponíveis

- **`/`** - Landing page principal com informações do evento
- **`/auth/discord/callback`** - Processamento do login Discord

## 🎨 Design System

A aplicação utiliza um design system inspirado no espaço com:
- **Cores primárias:** Gradientes azuis e roxos (#4ecdc4, #45b7d1, #5865F2)
- **Cores secundárias:** Vermelho espacial (#ff6b6b) e tons de cinza
- **Tipografia:** Inter (Google Fonts)
- **Animações:** Transições suaves e hover effects

## 📦 Build e Deploy

```bash
# Build para produção
ng build --prod

# Build com análise de bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/nasa-spaceapps-angular-web/stats.json
```

Os arquivos de build ficam no diretório `dist/nasa-spaceapps-angular-web/`.

## 🧪 Testes

```bash
# Executar testes unitários
ng test

# Executar testes com coverage
ng test --coverage

# Executar testes e2e (configurar primeiro)
ng e2e
```

## 🚀 Features Implementadas

- ✅ Landing page responsiva
- ✅ Sistema de autenticação Discord
- ✅ Gerenciamento de estado do usuário
- ✅ Roteamento configurado
- ✅ Design system consistente
- ✅ Otimizações de performance
- ✅ Tratamento de erros

## 🔄 Roadmap

- [ ] Dashboard do usuário logado
- [ ] Sistema de formação de equipes
- [ ] Integração com API de inscrições
- [ ] Sistema de notificações
- [ ] PWA (Progressive Web App)

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

- **Website:** [nasaspaceappsuberlandia.com.br](https://nasaspaceappsuberlandia.com.br)
- **Email:** contato@nasaspaceappsuberlandia.com.br
- **Discord:** [Servidor oficial](https://discord.gg/spaceapps-uberlandia)

## 🌟 Créditos

Desenvolvido para o **NASA Space Apps Challenge 2024 - Uberlândia** 🚀

---

⭐ **Se este projeto te ajudou, deixe uma star!** ⭐
