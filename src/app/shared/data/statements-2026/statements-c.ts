import { ChallengeStatement } from '../challenge.model';

export const STATEMENTS_2026_C: Record<string, ChallengeStatement> = {
  '2026-11': {
    background: `Exploradores humanos conseguem fazer ciência e realizar outras atividades que sistemas robóticos não conseguem. Como se viu no sobrevoo lunar da recente missão Artemis II, os astronautas usam seu pensamento crítico para fazer conexões, resolver problemas rapidamente e dar contexto a observações e medições científicas em tempo real. É por isso que a NASA envia humanos aos ambientes extremos do espaço, onde podemos aprender mais sobre o nosso sistema solar e como ele se formou, e fazer ciência que não conseguimos fazer na Terra. Hoje, a exploração humana está focada na superfície lunar, com mais missões Artemis a caminho e o planejamento da construção em fases de uma Base Lunar em andamento. Parte do papel das missões científicas da NASA é abrir caminho para que humanos visitem novos destinos no futuro. Cada nova missão robótica a Marte representou um desafio de engenharia enormemente complexo. Enviar humanos será o maior desafio — e a maior conquista — até agora, e nos tornarmos uma espécie interplanetária vai exigir todo o nosso conhecimento, imaginação e trabalho duro.

Os dados das missões atuais e passadas da NASA a Marte formam um retrato detalhado do planeta, mas ainda não estão combinados em camadas da forma necessária para planejar missões humanas específicas. Ferramentas como o Mars Trek, do Jet Propulsion Laboratory (JPL), e o USGS-NASA Planetary Geologic Mapping Program permitem sobrepor diferentes dados a um mapa global de Marte, mas foram feitas para visões regionais e globais, e não para as áreas hiperlocalizadas que os astronautas terão como alvo em cada caminhada espacial ou excursão pela superfície.`,
    objectives: `Seu desafio é criar um mapa, ferramenta ou interface que um astronauta em Marte possa usar durante uma missão de exploração da superfície, usando dados e ferramentas da NASA. Você pode começar definindo alguns objetivos científicos para a sua missão e o local que o astronauta vai explorar. Por exemplo, se você escolher como objetivo científico aprender mais sobre as formações em boxwork — um fenômeno geológico que o rover Curiosity estudou em 2025 —, vai querer escolher um local onde essas formações sejam abundantes, como a região do Monte Sharp, onde o Curiosity as observou.

Você pode começar por um local que um dos rovers da NASA em Marte ou outra missão já tenha explorado extensivamente, para ter bastante dados e imagens com que trabalhar, ou pode se desafiar focando em uma área que ainda não foi estudada tão de perto.

Você pode considerar incluir pelo menos três tipos de dados — ópticos, térmicos, espectrais, topográficos, geofísicos, atmosféricos, de radiação e químicos são alguns exemplos —, sobrepostos ou combinados de forma a oferecer um contexto útil para navegar pelo local escolhido.

A prioridade número um da NASA é sempre a segurança dos astronautas, então pense em quais informações podem ajudar uma tripulação a se deslocar com segurança por um ambiente novo. Por exemplo, o ambiente de radiação em Marte é diferente do da Terra, da órbita terrestre e da Lua, então você pode incluir dados de clima espacial. Os astronautas vão fazer ciência na superfície de Marte usando trajes espaciais e possivelmente carregando equipamentos científicos e outros suprimentos. Pense em como isso pode afetar a mobilidade deles e, se possível, inclua um mapa de rota que mostre por onde o astronauta vai passar para cumprir seus objetivos científicos, evitando obstáculos significativos, como grandes formações rochosas.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

- Você pode imaginar seu mapa como uma tela usada dentro da espaçonave ou do habitat da tripulação para planejar a rota, como um aplicativo de tablet que eles levam consigo, como um heads-up display (HUD) projetado no visor do capacete do traje espacial ou em outro formato que você imaginar.
- Seu mapa pode ser um retrato estático, um produto digital interativo ou uma ferramenta ou sistema que gere mapas de diferentes locais ou com diferentes tipos de dados.
- Para se inspirar, veja como missões da NASA a destinos além de Marte — a Terra, a Lua, outros planetas do nosso sistema solar e exoplanetas de outros sistemas — criaram esse tipo de mapa.
- Você pode usar dados de um período específico do passado, dados e condições previstos para um período futuro ou nenhum período específico, por exemplo se estiver focando em informações mais estáveis, como topografia e geologia.
- Experimente olhar imagens feitas pelas missões da NASA na superfície de Marte para visualizar como seria executar sua missão usando o seu mapa. Pense em como incluir essas imagens em primeira pessoa no mapa, para que o astronauta saiba o que esperar quando chegar ao destino.
- Pense se a sua missão pode usar rovers ou outros sistemas robóticos para ajudar a transportar a tripulação e suas ferramentas, ou se os astronautas podem trabalhar em duplas para fazer mais ciência.`
  },
  '2026-12': {
    background: `Asteroides e cometas orbitam o Sol. Estrelas próximas marcham pelo céu enquanto orbitam a Galáxia. A Terra também orbita o Sol, o que faz com que objetos próximos de nós mudem de posição aparente. Observar esses movimentos nos ajuda a descobrir novos objetos astronômicos e também a medir as distâncias até eles. Por exemplo, o planeta anão Plutão foi descoberto quando um astrônomo comparou duas imagens do céu feitas em momentos diferentes e percebeu que um ponto de luz havia se deslocado entre elas.

Mais recentemente, astrônomos montaram buscas massivas por objetos próximos usando esse processo, com a ajuda do público. Centenas de milhares de voluntários usaram essa técnica para descobrir asteroides, cometas, estrelas e anãs marrons — bolas de gás massivas demais para serem consideradas planetas, mas sem massa suficiente para queimar como estrelas. Na verdade, a maioria dos cometas e anãs marrons conhecidos foi descoberta por voluntários dessa forma, em projetos como o backyardworlds.org.

Desde maio de 2025, a nova missão SPHEREx da NASA vem enviando dados únicos que podem render novas descobertas. A SPHEREx está mapeando o céu inteiro uma vez a cada seis meses em 102 bandas de luz infravermelha próxima, o que a torna especialmente sensível a objetos ricos em hidrogênio, água, dióxido de carbono, monóxido de carbono e muitas outras moléculas. Haverá dados demais para qualquer pessoa — ou mesmo qualquer código de computador — compreender por completo. Serão imagens de mais de um bilhão de objetos — incluindo anãs marrons, quasares, cometas, asteroides, estrelas, supernovas e galáxias —, que muitas vezes se sobrepõem ou variam de brilho. Precisamos das suas novas ferramentas criativas para aproveitar ao máximo esse tesouro e ajudar o maior número possível de pessoas a contribuir com descobertas.`,
    objectives: `Seu desafio é criar uma ferramenta web aberta ao público para exibir imagens do céu obtidas pela missão SPHEREx, tornando fácil para qualquer pessoa ver rapidamente como elas mudam ao longo do tempo. Os usuários vão inserir as coordenadas de um trecho do céu (ascensão reta e declinação). Sua ferramenta vai exibir uma série de imagens desse trecho como um pequeno vídeo, facilitando a identificação de objetos em movimento.

Teste sua ferramenta com a Estrela de Barnard, Epsilon Indi B (um par de anãs marrons orbitando uma estrela), WISE 0855 (uma anã marrom de movimento rápido, ascensão reta 08h55m10.831s, declinação -7d14m42.53s) e as estrelas variáveis RW Aurigae e R Draconis.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

- Novos dados da SPHEREx estão chegando rápido! Garanta que a sua ferramenta seja fácil de atualizar com as últimas liberações de dados.
- Pense de forma criativa em como exibir essas 102 bandas infravermelhas para que os usuários possam aproveitá-las e fazer novas descobertas! Por exemplo, pode fazer sentido somar separadamente todos os dados obtidos por cada um dos seis conjuntos de detectores para melhorar a relação sinal-ruído das imagens exibidas. Pontos extras se a sua ferramenta conseguir gerar espectros na hora.
- Pode ajudar os usuários a descobrir objetos em movimento se eles tiverem a opção de somar ou subtrair imagens feitas em momentos diferentes.
- Deixe os usuários escolherem o campo de visão! Campos de visão maiores permitem acompanhar fontes que se movem mais rápido, ao custo de tempos maiores de transferência de dados.
- Os usuários podem se beneficiar da opção de sobrepor dados astronômicos de outros telescópios, como os da missão Gaia ou da missão WISE.
- Se você permitir consultar a ferramenta incluindo as coordenadas na URL, os usuários vão poder incorporá-la facilmente em outros sites e projetos.
- Pode ser útil exibir metadados, como os sinalizadores de contaminação.
- Procure ferramentas públicas que possam ajudar a lidar com dados astronômicos, como as Astrophy tools, e a exibi-los, como a ferramenta Aladin, desenvolvida pelo Centro de Dados Astronômicos de Estrasburgo (CDS).`
  },
  '2026-13': {
    background: `Missões espaciais são sistemas complexos em que objetivos científicos, requisitos de engenharia, recursos disponíveis e restrições operacionais precisam funcionar em conjunto. Projetar uma missão envolve decisões sobre a espaçonave, os instrumentos científicos, o veículo lançador, a órbita, a energia, a massa, as comunicações, o orçamento e a vida útil da missão. Uma decisão que melhora um aspecto da missão pode criar limitações em outro. Por exemplo, adicionar um instrumento mais capaz pode aumentar o valor científico, mas também aumentar a massa, o consumo de energia, o volume de dados e o custo. Entender esses trade-offs é essencial para desenvolver missões espaciais bem-sucedidas.

No entanto, aprender a projetar missões espaciais costuma se limitar a exercícios teóricos, porque estudantes e aspirantes a engenheiros raramente têm acesso a um ambiente em que possam experimentar uma missão inteira, do conceito à operação. As ferramentas existentes costumam focar em temas isolados, como mecânica orbital, projeto de espaçonaves ou lançamentos de foguetes, sem mostrar como esses elementos interagem como um sistema completo. Isso deixa uma lacuna entre aprender conceitos espaciais isolados e entender como as equipes de missão tomam decisões de engenharia integradas.

Um jogo interativo pode ajudar a preencher essa lacuna, permitindo que os participantes experimentem, tomem decisões, esbarrem em restrições e aprendam tanto com missões bem-sucedidas quanto com as malsucedidas. Os jogadores poderiam projetar missões individualmente ou colaborar em equipes de até quatro pessoas, com cada participante contribuindo para a estratégia da missão e trabalhando em conjunto para alcançar o melhor resultado possível. Abordagens possíveis incluem planejamento de missão, configuração da espaçonave, seleção de instrumentos, gestão de recursos, escolha de órbita, planejamento de lançamento, comunicações e simulação da missão. Você é incentivado a desenvolver alternativas criativas que tornem a experiência envolvente, preservando os trade-offs fundamentais do projeto de missões espaciais do mundo real.`,
    objectives: `Seu desafio é criar um Jogo de Design de Missões Espaciais interativo que permita aos participantes vivenciar o processo de projetar e gerenciar uma missão espacial completa. Você pode considerar permitir que o jogador participe individualmente ou colabore com uma equipe de até quatro pessoas, com os participantes trabalhando juntos para tomar decisões estratégicas e alcançar o maior desempenho possível da missão.

O jogo poderia permitir que os participantes definam um objetivo de missão, estabeleçam os requisitos da missão, projetem uma espaçonave, selecionem instrumentos científicos, escolham um veículo lançador e uma órbita e administrem restrições-chave como orçamento, massa, energia, comunicações, dados e vida útil da missão. Os jogadores se beneficiam de ver como suas decisões afetam outras partes da missão e de entender os trade-offs envolvidos no projeto de missões espaciais do mundo real.

Uma solução forte pode incluir um jogo ou simulação interativa funcional, com uma interface clara, um sistema de configuração da missão, mecanismos de gestão de recursos, colaboração ou modo multijogador para até quatro participantes e um sistema de simulação e avaliação da missão. O jogo poderia dar feedback sobre o desempenho da missão e recompensar decisões de engenharia eficazes, gestão eficiente de recursos, colaboração bem-sucedida e o cumprimento dos objetivos da missão. Os participantes são incentivados a desenvolver mecânicas de jogo, visualizações, sistemas de pontuação e cenários de missão criativos, que tornem a experiência envolvente e exijam que os jogadores resolvam problemas, façam trade-offs e colaborem para alcançar o sucesso da missão.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

## Design e experiência do jogo

- O jogo poderia ser acessível a participantes com diferentes níveis de conhecimento sobre ciência e engenharia espacial.
- O jogo poderia oferecer tanto o modo individual quanto o modo em equipe, permitindo que até quatro participantes colaborem na mesma missão.
- Os membros da equipe poderiam ter responsabilidades diferentes, como planejamento da missão, projeto da espaçonave, ciência, comunicações ou gestão de recursos.
- Objetivos e feedback claros ajudam os participantes a entender por que uma missão dá certo ou fracassa.
- Pense em tornar o jogo interativo, permitindo que os participantes modifiquem o projeto da missão e o simulem várias vezes.
- Um sistema de pontuação poderia recompensar o sucesso da missão, o valor científico, o uso eficiente de recursos e a boa tomada de decisão.
- O jogo poderia incluir diferentes níveis de dificuldade, tipos de missão ou cenários.

## Projeto da missão

- Os participantes poderiam começar definindo um objetivo de missão antes de tomar decisões sobre a espaçonave e a engenharia.
- Pense em dar uma consequência a cada decisão de projeto importante. Por exemplo, aumentar o número de instrumentos poderia ampliar as capacidades científicas, mas também aumentar a massa, o consumo de energia, o custo e a geração de dados.
- Pense em mostrar que raramente existe uma única solução perfeita. Diferentes combinações de espaçonave, instrumentos, órbitas e veículos lançadores poderiam alcançar o mesmo objetivo de missão.
- Pense em incluir restrições realistas, como orçamento limitado, massa da espaçonave, energia disponível, capacidade de comunicação e vida útil da missão.

## Espaçonave e carga útil

- A espaçonave poderia incluir componentes como estrutura, sistemas de energia, baterias, comunicações, computadores de bordo, controle de atitude e instrumentos científicos.
- Os instrumentos científicos poderiam ter características diferentes, incluindo massa, consumo de energia, custo, geração de dados e valor científico.
- Pense em permitir que os participantes escolham entre componentes simples e avançados para a espaçonave, dependendo do nível de dificuldade.

## Órbita e lançamento

- O jogo poderia oferecer várias opções de órbita e explicar suas características básicas.
- Os participantes poderiam considerar como a órbita escolhida afeta a cobertura, as oportunidades de observação, as comunicações, a vida útil da missão e outros requisitos da missão.
- Os veículos lançadores poderiam ter diferentes capacidades de carga útil, custos e capacidades orbitais.
- Pense em incluir uma verificação de que a massa da espaçonave e a órbita escolhida são compatíveis com o veículo lançador selecionado.

## Gestão de recursos

- O jogo deve exibir com clareza os principais recursos disponíveis para a equipe da missão.
- Recursos importantes poderiam incluir:
  - Massa: a massa total da espaçonave e da carga útil.
  - Energia: a energia disponível para operar os sistemas e instrumentos da espaçonave.
  - Orçamento: os recursos financeiros disponíveis para desenvolver e operar a missão.
  - Dados: a quantidade de informação gerada pelos instrumentos científicos.
  - Comunicações: a capacidade da espaçonave de transmitir dados para as estações em solo.
  - Tempo: o desenvolvimento planejado e a vida útil operacional da missão.
- Você pode considerar identificar quais recursos são mais críticos para a sua missão específica.

## Colaboração

- No modo em equipe, até quatro participantes poderiam trabalhar juntos na mesma missão.
- Pense em dar aos membros da equipe papéis ou responsabilidades diferentes, pedindo que tomem as decisões coletivamente.
- O jogo poderia incluir situações em que os membros da equipe precisam negociar entre prioridades concorrentes.
- O resultado final da missão poderia depender de quão bem a equipe coordena suas decisões.

## Valor educacional

- Conceitos científicos e de engenharia funcionam melhor quando explicados em termos simples, em vez de pressupor conhecimento avançado.
- Conceitos complexos como altitude orbital, capacidade de carga útil, consumo de energia, taxa de dados e comunicações poderiam ser apresentados pelo próprio jogo.
- Pense em incluir explicações curtas, tutoriais, indicadores visuais ou recursos de aprendizagem opcionais.
- Pense em ensinar aos participantes por que uma determinada decisão afeta o desempenho da missão, em vez de simplesmente indicar se a decisão está certa ou errada.

Você pode considerar adicionar recursos como:

- Vários cenários de missão com objetivos diferentes
- Eventos aleatórios ou restrições inesperadas na missão
- Diferentes níveis de dificuldade
- Modelos de espaçonave realistas ou simplificados
- Visualizações interativas da espaçonave
- Painéis da missão mostrando o consumo de recursos em tempo real
- Rankings ou classificações de missões
- Relatórios de missão gerados ao fim de cada simulação
- A possibilidade de salvar, compartilhar e comparar projetos de missão
- Missões cooperativas para equipes de até quatro participantes
- Cenários competitivos em que equipes diferentes projetam missões para resolver o mesmo objetivo
- Um modo sandbox que permita aos participantes experimentar sem restrições predefinidas
- Uma análise pós-missão explicando por que a missão deu certo ou fracassou`
  },
  '2026-14': {
    background: `O EIC da NASA oferece visualizações extraordinárias que acompanham como o nosso planeta está mudando, das variações das temperaturas globais à evolução das correntes oceânicas. No entanto, essa informação vital é apresentada predominantemente em formato visual. Esse cenário cria uma lacuna significativa: depender exclusivamente da visão limita a acessibilidade para usuários cegos e com baixa visão e restringe as formas como o público pode interagir com a ciência da Terra, que é complexa.

A sonificação — o processo de traduzir dados em som — oferece uma forma poderosa de preencher essa lacuna. Converter elementos visuais em áudio abre caminhos multissensoriais para vivenciar os dados da Terra. O processamento auditivo pode revelar padrões sutis nos dados que passariam despercebidos a olho nu e pode criar uma conexão emocional mais profunda com o nosso planeta. Os participantes podem priorizar a criação de um ambiente interativo em que a tradução da imagem para o som seja exploratória, misturando dados científicos com expressão artística.

Para isso, os participantes precisam de uma forma de conectar as imagens à geração de áudio. Você pode considerar construir uma interface ou algoritmo de "jukebox" que analise os quadros visuais do EIC e toque uma paisagem sonora correspondente. As soluções possíveis incluem usar visão computacional para mapear espectros de cores em acordes musicais, aplicar algoritmos para traduzir a densidade de pixels em ritmo ou escrever conjuntos de regras artísticas que controlem os parâmetros de um sintetizador com base em formas visuais. Esses são apenas exemplos, e incentivamos você a desenvolver suas próprias alternativas criativas, que misturem desenvolvimento de software, processamento de dados e engenharia de áudio.`,
    objectives: `Seu desafio é criar uma experiência de "Jukebox da Terra" que gere sonificações dinâmicas a partir dos quadros visuais do EIC da NASA. O resultado desejado é um projeto em que as pessoas possam selecionar ou vivenciar uma visualização específica do EIC junto com a paisagem sonora correspondente. Você pode considerar desenvolver uma ferramenta interativa que traduza ativamente os dados visuais em som, ou pode optar por enviar uma coleção curada de arquivos de áudio originais gerados, que contem a história sonora dos dados.

Ao construir seu projeto, você pode explorar diversos métodos e tecnologias para processar os dados visuais. Você pode usar técnicas de visão computacional para analisar paletas de cores, formas ou densidades de pixels nas imagens do EIC e mapear esses elementos em parâmetros de áudio como altura, andamento ou instrumentação. Você pode empregar algoritmos de aprendizado de máquina, frameworks de síntese de áudio de código aberto ou conjuntos de regras artísticas próprios, guiados pelos dados, para gerar as paisagens sonoras. O método exato de tradução fica inteiramente a seu critério — incentivamos você a buscar paisagens sonoras que equilibrem a interpretação dos dados com resultados artísticos e agradáveis musicalmente.

A entrega final pode assumir várias formas, de acordo com as habilidades da sua equipe. Você pode considerar desenvolver uma jukebox interativa na web, uma aplicação desktop independente, um endpoint de API no backend ou uma playlist envolvente de arquivos de áudio originais gerados, acompanhada de uma explicação do processo criativo usado para produzi-los. Pense em como o seu público vai vivenciar os dados visuais e em como a sua abordagem pode transmitir melhor, por meio do som, a complexidade do nosso planeta em transformação. Ao misturar desenvolvimento de software, engenharia de áudio e criatividade artística, você pode criar uma experiência multissensorial única.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

## Entendendo os conceitos

- Sonificação: o uso de áudio não verbal para transmitir informações ou tornar dados perceptíveis.
- Quadros visuais: muitas visualizações do EIC são sequências animadas ou imagens. Você pode explorar a extração de imagens individuais (quadros) dessas sequências para servir de base para a geração de áudio.

## Projetando a sua experiência de "Jukebox"

- Sua entrega final pode assumir várias formas, de uma interface de usuário (UI) interativa programada a uma galeria digital ou playlist cuidadosamente curada com seus arquivos de áudio originais gerados, combinados com as imagens.
- Se você optar por construir uma ferramenta interativa, pode considerar a experiência do usuário (UX) e quão intuitivo é selecionar uma visualização e iniciar o áudio.
- A acessibilidade é um tema central deste desafio. Você pode explorar recursos que apoiem usuários cegos e com baixa visão, como compatibilidade com leitores de tela, feedback tátil ou textos descritivos detalhados acompanhando o áudio.

## Abordagens para a tradução dos dados

- Você pode explorar o mapeamento de elementos visuais — espectros de cores, brilho, formas geométricas ou densidade espacial de pixels — em parâmetros de áudio como altura, ritmo, andamento, volume ou instrumentação.
- Considere o equilíbrio entre a tradução estrita dos dados e a musicalidade. Uma tradução direta de pixel para som pode resultar em ruído caótico; você pode aplicar conjuntos de regras artísticas, escalas musicais ou harmonias para tornar o áudio envolvente e agradável de ouvir.
- Você pode explorar diversas disciplinas, desde escrever algoritmos de visão computacional e modelos de aprendizado de máquina próprios até usar sintetizadores de áudio e estações de trabalho de áudio digital (DAWs).

## Contando a história

- Documentar o seu processo pode ajudar outras pessoas a entender a sua visão. Você pode compartilhar o "porquê" das suas escolhas artísticas ou explicar os algoritmos e scripts usados para gerar os sons.
- Pense no impacto emocional dos dados de ciência da Terra. Você pode considerar como as suas paisagens sonoras podem refletir a urgência das mudanças climáticas ou a beleza dos sistemas interconectados do nosso planeta.`
  }
};
