# 🚀 Sistema de Dados em Tempo Real - NASA Space Apps Challenge

Este documento explica como funciona o sistema de dados em tempo real implementado para o war room do NASA Space Apps Challenge.

## ✨ Funcionalidades

### 📊 Dados em Tempo Real
- **Times NASA**: Busca automática dos times registrados via API GraphQL
- **Eventos Locais**: Atualização das estatísticas de participantes por cidade
- **Inscrições Google Sheets**: Dados das inscrições via planilha pública
- **Refresh Automático**: Atualização a cada 5 minutos (times) e 10 minutos (eventos)

### 🎯 Indicadores Visuais
- **Indicador LIVE**: Mostra dados atualizados em tempo real
- **Status da API**: Conectado/Carregando/Erro
- **Última Atualização**: Timestamp da última sincronização
- **Animações**: Loading states e indicadores visuais

## 🔧 Como Usar

### 1. Execução com Proxy (Recomendado)
```bash
npm start
# Inicia o servidor com proxy para contornar CORS
```

### 2. Execução sem Proxy
```bash
npm run start:no-proxy
# Inicia sem proxy (pode ter limitações de CORS)
```

### 3. Controles Manuais
No war room, você encontrará:
- **🔄 Atualizar Tudo**: Refresh completo de todos os dados
- **🚀 Times**: Refresh apenas dos times NASA
- **🌍 Eventos**: Refresh apenas dos eventos locais

## ⚙️ Configuração

### Proxy Configuration (proxy.conf.json)
```json
{
  "/api/nasa/*": {
    "target": "https://api.spaceappschallenge.org",
    "secure": true,
    "changeOrigin": true,
    "pathRewrite": { "^/api/nasa": "" }
  }
}
```

### Google Sheets Setup
1. Configure a planilha como **pública para leitura**
2. O ID da planilha já está configurado no componente
3. Estrutura esperada: 12 colunas conforme mapeamento atual

## 🔄 Fluxo de Dados

### 1. Inicialização
- Carrega dados estáticos dos arquivos JSON locais
- Inicia conexão com APIs em tempo real
- Configura refresh automático

### 2. Atualização Automática
- **Teams**: A cada 5 minutos
- **Local Events**: A cada 10 minutos
- **Google Sheets**: Conforme configurado (manual no momento)

### 3. Fallback Strategy
1. Tenta API com proxy
2. Se falhar, tenta API direta
3. Se falhar, carrega dados locais (fallback)

## 📈 Métricas Disponíveis

### Times NASA (Tempo Real)
- Total de times registrados
- Times com projetos submetidos
- Total de membros dos times
- Times de Uberlândia especificamente

### Eventos Locais (Tempo Real)
- Participantes por cidade atualizado
- Tipos de evento (presencial/virtual/híbrido)
- URLs dos eventos

### Inscrições (Google Sheets)
- Total de inscrições para Uberlândia
- Distribuição por idade, escolaridade, região
- Evolução das inscrições ao longo do tempo
- Modo de participação (presencial/remoto)

## 🛠️ Desenvolvimento

### Estrutura dos Serviços
```
services/
├── nasa-teams.service.ts     # API NASA (times + eventos)
├── google-sheets.service.ts  # Google Sheets (inscrições)
└── registration-data.service.ts # Processamento dos dados
```

### Componentes
```
war-room/
├── war-room.component.ts     # Lógica principal
├── war-room.component.html   # Template com controles
├── war-room.component.scss   # Estilos + animações
└── components/               # Subcomponentes (gráficos, mapas)
```

## 🚨 Troubleshooting

### Problema: Dados não carregam
**Solução**: Verifique o console para erros de CORS ou API

### Problema: Proxy não funciona
**Solução**: Execute `npm run start:no-proxy` e verifique se a API responde diretamente

### Problema: Google Sheets não atualiza
**Solução**: Verifique se a planilha está pública e o ID está correto

### Problema: Performance
**Solução**: Os dados são cacheados em BehaviorSubjects, refresh é otimizado

## 📊 Status da API

O sistema monitora automaticamente:
- ✅ **Conectado**: API responde normalmente
- 🔄 **Carregando**: Fazendo requisição
- ❌ **Erro**: Problema na conexão (mostra detalhes)

## 🎨 Customização

### Intervalo de Refresh
```typescript
// Em nasa-teams.service.ts
interval(5 * 60 * 1000) // 5 minutos para times
interval(10 * 60 * 1000) // 10 minutos para eventos
```

### Estilos Live Data
```scss
.live-data {
  .live-indicator {
    background: #ff4444; // Cor do indicador LIVE
    animation: pulse 2s infinite; // Animação
  }
}
```

## 🔐 Segurança

- Nenhuma credencial sensível no frontend
- Proxy configurado com headers apropriados
- Fallback para dados locais em caso de falha
- Google Sheets em modo somente leitura

## 📝 Logs

O sistema produz logs detalhados no console:
- `🚀 Times NASA atualizados: X teams`
- `🌍 Eventos locais atualizados: X eventos`
- `📁 Dados fallback carregados: X teams`
- `❌ Erro ao buscar dados: [detalhes]`

---

**Desenvolvido para NASA Space Apps Challenge Uberlândia 2025** 🌌