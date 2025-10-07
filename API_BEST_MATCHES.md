# API Best Matches

Esta API retorna todas as pessoas e times que mais dão match com um participante específico.

## Endpoint

```
GET /matchmaking/best-matches/:email
```

## Parâmetros

- **email** (path parameter): Email do participante para encontrar matches
- **limit** (query parameter, opcional): Número máximo de matches individuais (padrão: 20)
- **includeTeams** (query parameter, opcional): "true" para incluir matches de times (padrão: false)

## Exemplos de Uso

### 1. Buscar melhores matches individuais
```bash
curl "http://localhost:3000/matchmaking/best-matches/ghabryelhenrique@hotmail.com?limit=10"
```

### 2. Buscar matches individuais E de times
```bash
curl "http://localhost:3000/matchmaking/best-matches/ghabryelhenrique@hotmail.com?limit=15&includeTeams=true"
```

### 3. Usando com JavaScript/Fetch
```javascript
const response = await fetch('http://localhost:3000/matchmaking/best-matches/ghabryelhenrique@hotmail.com?limit=20&includeTeams=true');
const data = await response.json();
console.log(data);
```

## Resposta da API

```json
{
  "success": true,
  "targetParticipant": {
    "email": "ghabryelhenrique@hotmail.com",
    "fullName": "Ghabryel Henrique Ferreira e Almeida",
    "skills": ["Angular", "TypeScript", "Node.js"],
    "expertiseLevel": "expert"
  },
  "individualMatches": {
    "count": 15,
    "matches": [
      {
        "participant": {
          "email": "maria@example.com",
          "fullName": "Maria Silva",
          "skills": ["React", "Angular", "JavaScript"],
          "expertiseLevel": "advanced",
          // ... resto do perfil
        },
        "matchScore": {
          "overall": 0.85,
          "skillsCompatibility": 0.9,
          "experienceBalance": 0.8,
          "preferencesAlignment": 0.7,
          "communicationFit": 0.9
        },
        "reasoning": {
          "strengths": [
            "Shared skills: angular, javascript",
            "Complementary experience levels for knowledge sharing",
            "Common languages: Portuguese, English"
          ],
          "concerns": [],
          "suggestions": [
            "Schedule an initial meeting to discuss project approach",
            "Maria could mentor in advanced React techniques"
          ]
        }
      }
      // ... mais matches
    ]
  },
  "teamMatches": {
    "count": 5,
    "matches": [
      {
        "teamId": "team-abc-123",
        "participants": ["ghabryelhenrique@hotmail.com", "maria@example.com", "joao@example.com"],
        "matchScore": {
          "overall": 0.82,
          "skillsCompatibility": 0.85,
          "experienceBalance": 0.8,
          "preferencesAlignment": 0.75,
          "communicationFit": 0.9
        },
        "reasoning": {
          "strengths": ["Diverse skill set", "Good experience balance"],
          "concerns": [],
          "suggestions": ["Define clear project roles"]
        },
        "recommendedRoles": {
          "ghabryelhenrique@hotmail.com": "Tech Lead",
          "maria@example.com": "Frontend Developer",
          "joao@example.com": "Backend Developer"
        }
      }
      // ... mais times
    ]
  },
  "summary": {
    "totalIndividualMatches": 25,
    "averageMatchScore": 0.73,
    "topMatchScore": 0.85
  }
}
```

## Campos da Resposta

### targetParticipant
Informações básicas do participante alvo da busca.

### individualMatches
Lista de matches individuais ordenados por score de compatibilidade (maior para menor).

### teamMatches
Lista de times sugeridos que incluem o participante alvo (apenas quando `includeTeams=true`).

### matchScore
Pontuações de compatibilidade (0.0 a 1.0):
- **overall**: Score geral de compatibilidade
- **skillsCompatibility**: Compatibilidade de habilidades
- **experienceBalance**: Balanceamento de experiência
- **preferencesAlignment**: Alinhamento de preferências
- **communicationFit**: Ajuste de comunicação

### reasoning
Análise qualitativa do match:
- **strengths**: Pontos fortes da combinação
- **concerns**: Possíveis preocupações ou desafios
- **suggestions**: Sugestões para melhorar a colaboração

### summary
Estatísticas gerais dos matches encontrados.

## Códigos de Erro

- **400 Bad Request**: Email inválido
- **404 Not Found**: Perfil não encontrado para o email fornecido
- **500 Internal Server Error**: Erro interno do servidor

## Notas Importantes

1. A API calcula matches em tempo real, então pode levar alguns segundos para responder
2. Os scores são calculados com base em algoritmos de machine learning
3. O campo `includeTeams=true` pode impactar significativamente o tempo de resposta
4. Os matches são ordenados por score de compatibilidade decrescente
5. O limite máximo recomendado é de 50 matches individuais para evitar timeouts