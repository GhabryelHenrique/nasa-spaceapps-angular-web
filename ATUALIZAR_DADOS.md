# Como Atualizar os Dados de Inscrições

Este guia explica como atualizar os dados de inscrições do War Room utilizando um novo arquivo Excel.

## Passo a Passo

### 1. Substituir o Arquivo Excel

Substitua o arquivo Excel em `src/assets/data/` pelo novo arquivo de inscrições.

**Importante:** O arquivo deve ter a mesma estrutura de colunas:
- Coluna 0: Timestamp (Carimbo de data/hora)
- Coluna 1: Nome e Sobrenome
- Coluna 2: Email
- Coluna 3: Telefone de Contato
- Coluna 4: CPF
- Coluna 5: Cidade onde reside
- Coluna 6: Escolaridade
- Coluna 7: Data de Nascimento
- Coluna 8: Modo de Participação
- Coluna 9: Endereço de e-mail (secundário)
- Coluna 10: Áreas de interesse
- Coluna 11: Como ficou sabendo do Hackathon
- Coluna 12: Gênero

### 2. Atualizar o Script de Conversão (se necessário)

Se o novo arquivo tiver um nome diferente, edite o arquivo `convert-excel-to-json.js` na raiz do projeto e atualize o caminho do arquivo:

```javascript
const excelFilePath = path.join(__dirname, 'src', 'assets', 'data', 'SEU_NOVO_ARQUIVO.xlsx');
```

### 3. Executar o Script de Conversão

No terminal, execute:

```bash
node convert-excel-to-json.js
```

Este script irá:
- Ler o arquivo Excel
- **Anonimizar os dados sensíveis:**
  - **Nome:** Convertido para iniciais (ex: "João Silva Santos" → "J.S.S")
  - **CPF:** Apenas os 3 primeiros dígitos mantidos (ex: "052.123.456-78" → "052.***.***-**")
  - **Email:** Removido completamente (substituído por string vazia)
- Extrair o DDD do telefone
- Gerar o arquivo `src/assets/data/registrations.json`

### 4. Verificar o Resultado

Após executar o script, você verá uma mensagem de sucesso:

```
✅ Arquivo JSON criado com sucesso: src/assets/data/registrations.json
Total de registros processados: XXXX
```

Um exemplo do primeiro registro (com dados anonimizados) será exibido.

### 5. Testar a Aplicação

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Acesse `http://localhost:4200/war-room` e verifique se:
- Os dados estão sendo carregados corretamente
- Os gráficos estão sendo exibidos
- As estatísticas estão corretas
- **Nomes e CPFs estão anonimizados**

## Privacidade e Segurança

### Dados Protegidos

O script de conversão **automaticamente protege** informações sensíveis:

1. **Nomes:** Convertidos para iniciais apenas
   - Exemplo: "Maria Costa Lima" → "M.C.L"

2. **CPF:** Apenas 3 primeiros dígitos visíveis
   - Exemplo: "123.456.789-00" → "123.***.***-**"

3. **E-mails:** Completamente removidos
   - Substituídos por string vazia

### Dados Mantidos para Análise

Os seguintes dados são mantidos para análise estatística:
- DDD (extraído do telefone)
- Cidade
- Escolaridade
- Data de Nascimento (para cálculo de faixa etária)
- Modo de Participação
- Áreas de Interesse
- Origem da inscrição
- Gênero

## Estrutura de Arquivos

```
nasa-spaceapps-angular-web/
├── convert-excel-to-json.js          # Script de conversão
├── src/
│   ├── assets/
│   │   └── data/
│   │       ├── *.xlsx                # Arquivo Excel original
│   │       └── registrations.json    # Arquivo JSON gerado (anonimizado)
│   └── app/
│       └── services/
│           └── google-sheets.service.ts  # Serviço que lê os dados
```

## Troubleshooting

### Erro: "Cannot find module 'xlsx'"

Execute:
```bash
npm install
```

### Erro: "File not found"

Verifique se o caminho do arquivo Excel em `convert-excel-to-json.js` está correto.

### Dados não aparecem no War Room

1. Limpe o cache do navegador
2. Verifique o console do navegador para erros
3. Verifique se o arquivo `registrations.json` foi gerado corretamente

## Notas Importantes

- **NUNCA** faça commit do arquivo Excel original (*.xlsx) com dados sensíveis não anonimizados
- O arquivo `registrations.json` já contém dados anonimizados e pode ser commitado com segurança
- Sempre execute o script de conversão ao atualizar o arquivo Excel
- Mantenha backups dos arquivos originais em local seguro
