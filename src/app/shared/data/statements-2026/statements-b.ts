import { ChallengeStatement } from '../challenge.model';

export const STATEMENTS_2026_B: Record<string, ChallengeStatement> = {
  '2026-06': {
    background: `O sensoriamento remoto da Terra nos ajuda a obter informações a partir de uma visão aérea. Instrumentos a bordo de satélites e aeronaves geram imagens do planeta e contribuem com observações da Terra que ajudam tomadores de decisão, substituindo ou complementando seus levantamentos de campo. A fonte de energia mais comum que esses instrumentos usam vem do Sol, cuja luz é refletida por objetos e superfícies no solo de volta ao instrumento. A quantidade dessa energia varia conforme o comprimento de onda dentro do espectro eletromagnético, e podemos usar essa assinatura espectral para identificar água, rochas/minerais, vegetação etc. Os instrumentos que utilizam a energia do Sol fazem sensoriamento remoto passivo, enquanto instrumentos de radar, como os que usaremos neste desafio, fazem sensoriamento remoto ativo.

Instrumentos ativos emitem e recebem sua própria fonte de energia e, no caso do radar, operam na faixa de micro-ondas do espectro eletromagnético. Instrumentos de radar podem ser usados para estudar a estrutura de florestas, a umidade do solo, áreas úmidas, a topografia dos oceanos, o gelo marinho e muito mais. Neste desafio, vamos baixar dados de satélites SAR (radar de abertura sintética). O SAR "sintetiza" uma antena longa combinando uma sequência de aquisições feitas com sua antena real, mais curta, para fornecer dados de maior resolução espacial. Instrumentos SAR emitem um pulso de energia que interage com a superfície da Terra e é refletido de volta ao instrumento. Essa coleta pode ser feita de dia ou de noite e até com tempo nublado, o que permite obter dados críticos durante desastres como derramamentos de óleo, incêndios florestais, furacões etc.

Os dados de radar são mais sensíveis a duas coisas: rugosidade e constante dielétrica. Em outras palavras, as imagens de radar são mais do que as imagens de satélite típicas que você vê no seu aplicativo de GPS. Essa informação de rugosidade caracteriza o retroespalhamento da superfície da Terra e as diferentes polarizações, e pode nos dizer algo sobre estrutura, geometria e propriedades dos materiais. Como a água tem uma constante dielétrica alta, os dados SAR também destacam corpos d'água, inundações e umidade do solo. O SAR também consegue medir movimentos finos da superfície, na escala de centímetros, como os causados por terremotos e pela subsidência do solo.`,
    objectives: `Na superfície da Terra há uma dança sem fim de processos naturais e atividades humanas em movimento constante, mas essas mudanças costumam ser difíceis de visualizar, entender e comunicar. Áreas úmidas e várzeas estão sempre se expandindo e se retraindo; a área das florestas encolhe por causa do desmatamento e dos incêndios florestais; terras agrícolas mudam seus tipos de cultura e sua saúde; a umidade incha e encolhe os solos; geleiras e gelo marinho estão numa valsa constante; e a superfície do terreno se deforma com terremotos e com a subsidência costeira. Todas essas mudanças têm implicações importantes para ecossistemas, recursos hídricos, agricultura e infraestrutura, impactando, em última instância, as comunidades locais.

Neste desafio, os participantes vão construir uma aplicação interativa que aproveite dados de sensoriamento remoto por radar do NISAR para rastrear e visualizar um ou mais tipos de mudança na superfície, em locais ao redor do mundo. Os participantes são incentivados a criar ferramentas intuitivas e visualizações inovadoras, como mapas interativos de detecção de mudanças, animações de séries temporais ou painéis, que tornem os dados do NISAR acessíveis a um público amplo. O resultado desejado é uma solução de código aberto e fácil de usar, que traduza observações de radar complexas em insights acionáveis, ajudando cientistas, gestores de recursos, educadores, tomadores de decisão e o público a entender melhor os padrões e ritmos da superfície da Terra em diferentes intervalos de tempo.

Primeiro, escolha uma área de estudo interessante — pode ser sua cidade natal, uma área úmida tropical, uma camada de gelo, um incêndio florestal, um bairro alagado, uma erupção vulcânica etc. — onde quer que a música chame você! Segundo, baixe dados gratuitos do NISAR usando a lista de recursos fornecida. Você pode querer baixar dados complementares, como imagens ópticas ou camadas de SIG (sistemas de informação geográfica), para contextualizar as imagens SAR. Por último, apresente suas descobertas no meio digital interativo que preferir: um relatório final, vídeo, slides de apresentação, story map — quem sabe até uma dança interpretativa? Levante hipóteses sobre os fatores físicos por trás do que você vê (ou não vê) nos dados SAR. Por exemplo, se você estiver olhando para a Floresta Amazônica, por que a vegetação mudaria ao longo do tempo? Quais polarizações destacam essas mudanças em terra e no gelo? Que aplicações futuras do NISAR são possíveis?`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

- Analise dados do NISAR com diferentes polarizações e/ou diferentes frequências (de outros sensores). Baixe dados de datas diferentes para mostrar uma série temporal, e conjuntos de dados auxiliares (população, tipo de vegetação etc.) para contextualizar a área de estudo.
- Mostre como fatores humanos (agricultura, indústria etc.) estão impactando os recursos naturais da Terra.
- Foque em uma narrativa envolvente por meio de visualizações de dados. O resumo do seu projeto pode estar no meio digital que você preferir: um relatório final, vídeo, slides de apresentação, story map etc.
- Se você conhece bem sua área de estudo (por exemplo, se é sua cidade natal), pode oferecer contexto e histórias pessoais para as imagens SAR.
- Considere tornar seu resumo interativo (por exemplo, com comparadores de imagens, mapas web etc.).`
  },
  '2026-07': {
    background: `Agricultores enfrentam decisões cada vez mais complexas à medida que as temperaturas mudam, as chuvas ficam menos previsíveis e a saúde do solo piora em muitas regiões. Escassez de água, erosão, esgotamento de nutrientes e eventos climáticos extremos aumentam ainda mais a incerteza. Escolher novas culturas para incluir numa rotação pode ser difícil, porque uma cultura que melhora a saúde do solo em um lugar pode consumir água demais, introduzir doenças, entrar em conflito com os mercados locais ou ficar fora das épocas de cultivo esperadas em outro.

Este desafio se inspira, em parte, na experiência de várias gerações de agricultores — muitas famílias passaram por safras em que ferramentas melhores para acompanhar as condições em mudança poderiam ter ajudado a identificar escolhas de rotação mais saudáveis e resilientes. Hoje, os conjuntos de dados ambientais de longo prazo da NASA oferecem novas formas de entender as condições locais de cultivo, e as técnicas de IA abrem oportunidades para traduzir esses dados em insights práticos e acessíveis para os agricultores.`,
    objectives: `Você pode considerar combinar observações da Terra da NASA com informações agrícolas locais para criar um aplicativo, modelo, mapa interativo ou outra ferramenta de apoio à decisão. O objetivo é ajudar agricultores a explorar opções de rotação de culturas que possam melhorar a saúde do solo e fortalecer a resiliência às mudanças nas condições de clima e de água.

Você pode explorar conjuntos de dados da NASA como SMAP, ECOSTRESS, GPM, Landsat, MODIS, NASA POWER, GRACE e GRACE‑FO, e SRTM ou outros produtos de elevação da NASA. Com esses conjuntos de dados, você pode analisar padrões de temperatura, estresse térmico, chuva, umidade do solo, evaporação, risco de geada, precipitação extrema, estresse da vegetação e tendências hídricas de longo prazo. Você também pode considerar informações locais de solo, características das culturas e prioridades dos agricultores — como uso de água, valor como forragem, potencial de fixação de nitrogênio, redução da erosão, aumento da matéria orgânica ou adequação ao mercado.

Sua ferramenta pode destacar os períodos em que os campos costumam ficar descobertos, as estações em que as culturas atuais parecem mais vulneráveis ou as oportunidades de rotação que poderiam interromper ciclos de pragas, reduzir a demanda de água, melhorar a infiltração ou gerar renda complementar. Você pode comparar pelo menos três estratégias de rotação, incluindo a rotação atual. Para cada estratégia, você pode explicar por que ela foi sugerida, quais evidências a sustentam, que benefícios ela pode oferecer, onde há lacunas de informação e quais riscos precisariam de revisão local por agricultores ou especialistas agrícolas.

O resultado pretendido é uma ferramenta de apoio — que ajude a identificar padrões e possibilidades, mas não substitua o julgamento do agricultor nem o conhecimento agrícola local.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

## Entendendo as condições e os dados

- Explore como as mudanças de temperatura, umidade do solo, chuva, evaporação e estresse da vegetação se relacionam com a vulnerabilidade das culturas e a saúde do solo.
- Considere explicar termos científicos como evapotranspiração, anomalias de umidade do solo, índices de vegetação (por exemplo, NDVI), risco de geada e indicadores de balanço hídrico.
- Esclareça como as observações de satélite diferem das medições feitas em solo, e como combinar as duas pode melhorar a precisão.

## Superinteligência (SI), modelagem e fusão de dados

- Você pode comparar diferentes abordagens de SI ou estatísticas para identificar padrões em condições históricas de clima e solo.
- Considere como a SI poderia destacar transições sazonais, períodos de campo descoberto ou momentos em que as culturas atuais mostram estresse maior.
- Explique como o modelo interpreta a incerteza e onde o conhecimento local seria necessário para validar os resultados.
- Você pode considerar harmonizar conjuntos de dados com resoluções espaciais e temporais diferentes reduzindo a amostragem, agregando ou reamostrando os dados para uma grade de análise comum. Harmonizar a resolução pode ajudar a SI a combinar a umidade do solo do SMAP, a temperatura da superfície terrestre do ECOSTRESS, a precipitação do GPM, os índices de vegetação do Landsat/MODIS, a biomassa do GEDI e conjuntos de dados de solo em atributos coerentes, que sustentem comparações claras e explicáveis entre estratégias de rotação.

## Exploração de estratégias de rotação

- Compare cenários de rotação examinando ciclagem de nutrientes, risco de erosão, contribuição de matéria orgânica, interrupção de ciclos de pragas, uso de água, potencial de forragem ou questões de mercado.
- Você pode considerar mapear quais ideias de rotação se alinham melhor às prioridades do agricultor — como economizar água, gerar renda complementar ou melhorar a estrutura do solo.
- Inclua explicações breves sobre como culturas fixadoras de nitrogênio, plantas de cobertura, culturas de raízes profundas ou culturas tolerantes à seca contribuem para a saúde do solo a longo prazo.

## Mapeamento geoespacial e visualização

- Considere se mapas interativos poderiam ajudar os usuários a explorar tendências ao longo do tempo, como a umidade do solo de longo prazo, ondas de calor ou quedas no armazenamento de água.
- Explore formas de visualizar vulnerabilidades no nível do talhão (por exemplo, zonas de risco de erosão, pontos críticos de estresse hídrico, áreas sujeitas a geada).
- Você pode incluir complementos opcionais, como linhas do tempo, sobreposições comparando conjuntos de dados ou controles deslizantes de cenário que ajustem os padrões de chuva ou de temperatura.

## Design centrado no agricultor

- Considere como tornar a ferramenta fácil de interpretar para agricultores que talvez tenham pouca experiência técnica ou geoespacial.
- Pense em formas de permitir que os agricultores informem suas próprias prioridades ou restrições, como disponibilidade de água, limitações de equipamento ou preferências de mercado.
- Inclua lembretes de que a ferramenta foi pensada para apoiar — não substituir — o conhecimento local, e destaque onde o julgamento humano é especialmente importante.`
  },
  '2026-08': {
    background: `Riscos de incêndio são extremamente perigosos na exploração espacial! Ao descrever um alarme de fumaça que disparou durante a recente missão Artemis II, o comandante comentou: "[Se] você quer chamar a atenção de alguém bem rápido, faça o alarme de incêndio disparar na sua espaçonave quando você ainda está a umas 80 mil milhas de casa." (cerca de 130 mil km) Décadas antes, a tripulação da Apollo 13 enfrentou as consequências potencialmente fatais da explosão de um tanque de oxigênio a caminho da Lua. Da mesma forma, uma tripulação multinacional sobreviveu a um incêndio a bordo da estação espacial Mir causado pela falha de um gerador de oxigênio. Em 1967, a tripulação da Apollo 1 morreu em um teste antes do lançamento quando o fogo irrompeu em sua espaçonave cheia de oxigênio.

Em comparação com a Terra, as chamas em queda livre (ou seja, em microgravidade) costumam ser drasticamente diferentes por causa da ausência de empuxo e, portanto, de gases quentes subindo. Em vez de uma gota tremulante, a chama de uma vela vira uma esfera azul fantasmagórica, que depende da difusão para receber oxigênio.

O trabalho da NASA em segurança contra incêndio em espaçonaves se concentra em prevenção, detecção e supressão. A prevenção é feita controlando fontes de ignição e pela seleção de materiais, que depende de entender os limites de inflamabilidade. Para facilitar o uso dos trajes espaciais, espera-se que a futura Base Lunar e os rovers pressurizados tenham uma atmosfera com mais oxigênio e pressão menor que a da Terra. A inflamabilidade depende muito da concentração de oxigênio, e o fluxo de ar também é importante em microgravidade. Os estudos de inflamabilidade se concentram em materiais sólidos, como tecidos e plásticos, como os estudados nas investigações Burning and Suppression of Solids (BASS e BASS-II) e Spacecraft Fire Safety Demonstration (Saffire-I, -II e -III).

A detecção de incêndio foi testada em microgravidade nos estudos Smoke and Aerosol Measurement Experiment (SAME e SAME-R). A supressão foi estudada no Flame Extinguishment Experiment (FLEX), diluindo a atmosfera da câmara com dióxido de carbono e hélio, que suprimem o fogo.`,
    objectives: `Os resultados de experimentos de combustão em baixa gravidade, realizados por exemplo na Estação Espacial Internacional (ISS), estão sendo disponibilizados publicamente pelo banco de dados Physical Science Informatics (PSI) da NASA, mas o volume de dados pode ser esmagador. Eles podem ser difíceis de encontrar, mais difíceis de comparar e mais difíceis ainda de interpretar.

Seu desafio é construir um painel web movido a IA que resuma, classifique e interprete investigações de ciência da combustão para entregar insights fundamentais e críticos para a segurança contra incêndio. Você pode considerar permitir que os usuários:

- Identifiquem as investigações mais relevantes para as necessidades de segurança contra incêndio de ambientes habitados por tripulações, incluindo espaçonaves, estações espaciais, bases nas superfícies lunar e marciana e rovers pressurizados.*
- Extraiam dados que deem suporte à modelagem preditiva de inflamabilidade e de cenários de incêndio na exploração espacial.
- Destaquem pesquisas que orientem o desenvolvimento da próxima geração de controles e equipamentos de segurança contra incêndio.

Neste desafio, você vai ajudar a transformar dados complexos em respostas claras e a tornar o próximo grande salto mais seguro.

Seu painel também pode abordar possíveis aplicações dos dados do PSI na segurança contra incêndio aqui na Terra. Extintores de névoa d'água fina desenvolvidos para uso na ISS têm aplicações práticas aqui na Terra, e a tecnologia da NASA também levou a melhorias na detecção de fumaça em terra e nos equipamentos de bombeiros, incluindo roupas de proteção e cilindros de ar.

*A segurança contra incêndio envolvendo foguetes e propelentes geralmente está fora do escopo das pesquisas disponíveis no banco de dados PSI. As altas velocidades dentro dos motores de foguete tornam a combustão praticamente independente da gravidade — embora o lançamento de um foguete, é claro, dependa fortemente da gravidade.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

- Seu público-alvo pode incluir professores universitários, estudantes de pós-graduação, estudantes de graduação, pesquisadores aeroespaciais e engenheiros aeroespaciais.
- Considere como você poderia resumir e exibir atributos como:
  - Objetivos experimentais
  - Combustíveis, incluindo formato e tamanho das amostras ou dos queimadores
  - Outras condições de teste, como concentração de oxigênio e velocidade do fluxo de ar
  - Variáveis: em que os testes de uma mesma investigação diferiam e em que eram iguais?
  - Sensores ou tipos de medição
- Considere como resumir e exibir as semelhanças e diferenças entre investigações distintas.
- Outras investigações no PSI
  - Um dos instrumentos usados para detecção de fumaça nos estudos SAME e SAME-R foi usado, em vez disso, para detectar poeira nos estudos Dust and Aerosol Measurement Feasibility Test (DAFT e DAFT-2).
  - Embora queimasse combustíveis gasosos, o experimento Burning Rate Emulator (BRE), do projeto Advanced Combustion via Microgravity Experiments (ACME), foi um estudo da inflamabilidade de materiais em atmosferas paradas em função das propriedades dos materiais.
  - Outras investigações de combustão no banco de dados PSI (não citadas explicitamente acima) também são relevantes para a segurança contra incêndio, só que de forma menos forte ou direta.
- Hardware
  - Os seis experimentos do projeto ACME usaram chamas de combustíveis gasosos e foram todos realizados com o mesmo conjunto modular de hardware do ACME no Combustion Integrated Rack (CIR).
  - FLEX, FLEX-2 e a Cool Flames Investigation (CFI) usaram gotículas de combustível líquido em combustão e foram realizados com o Multi-user Droplet Combustion Apparatus (MDCA) no CIR.
  - BASS, BASS-II, o Smoke Point In Co-flow Experiment (SPICE) e o Structure & Liftoff In Combustion Experiment (SLICE), em conjunto, usaram combustíveis sólidos e gasosos. Cada uma dessas investigações foi realizada dentro do Microgravity Science Glovebox (MSG), usando o duto de fluxo modular, movido a ventilador, construído para o SPICE.
- Trajes espaciais e concentração de oxigênio
  - Para garantir flexibilidade, os trajes espaciais são preenchidos com 100% de oxigênio a apenas 4,3 psi (libras por polegada quadrada), enquanto a pressão da Terra ao nível do mar é de 14,7 psi.
  - Para evitar a doença descompressiva, os astronautas fazem uma pré-respiração de oxigênio 100% para expelir o nitrogênio absorvido.
  - Para reduzir a duração da pré-respiração e, assim, facilitar as excursões lunares, espera-se que a Base Lunar e o(s) rover(s) pressurizado(s) fiquem com pressão e concentração de oxigênio intermediárias entre as de um traje espacial e as da atmosfera da Terra.
  - A concentração intermediária de oxigênio usada na Lua provavelmente será de 30% ou mais, com uma pressão correspondente de 10,2 psi ou menos. Em comparação com a atmosfera da Terra, isso é um aumento de mais de 40% na concentração de oxigênio, o que torna os materiais muito mais inflamáveis.
  - Os testes em microgravidade com as maiores concentrações de oxigênio foram feitos como parte da Cool Flames Investigation with Gases (CFI-G), do ACME. Nesses testes, a câmara de combustão foi preenchida com uma mistura de nitrogênio e um gás inflamável (por exemplo, propano), enquanto uma mistura de oxigênio e nitrogênio com até 85% de oxigênio saía do queimador esférico, criando uma chama "de dentro para fora".
- Dados de gravidade parcial
  - Embora a NASA esteja fortemente focada no retorno de astronautas à superfície da Lua e na construção de uma Base Lunar como preparação para a futura exploração humana de Marte, atualmente não há dados de combustão em gravidade parcial no PSI. Esperamos que esses dados sejam adicionados no futuro, por exemplo a partir da Lunar-g Combustion Investigation (LUCI) e do experimento Flammability of Materials on the Moon (FM2).
  - A gravidade parcial foi simulada no experimento Electric-Field Effects on Laminar Diffusion Flames (E-FIELD Flames), do ACME, por meio do efeito do campo elétrico sobre os íons que ocorrem naturalmente nas chamas.
  - Os resultados em microgravidade e em gravidade normal poderiam delimitar o que acontece em níveis intermediários de gravidade.`
  },
  '2026-09': {
    background: `## Regimes de fogo

Alguns ecossistemas precisam de incêndios periódicos para manter sua função e sua estrutura. No entanto, mudanças na intensidade, na extensão e na frequência do fogo podem ter impactos negativos sobre o clima, a sociedade e a biodiversidade, além dos serviços ecossistêmicos que ela fornece. Os incêndios também podem causar perda de vidas e de propriedades, piora da saúde e risco grave para os gestores de incêndio.

Como os seres humanos modificaram os padrões globais de vegetação, ignição e clima ao longo de milênios, os incêndios, tanto em escala local quanto global, estão cada vez mais ligados à ação humana.

A atividade de queimadas envolve incêndios florestais em vegetação natural e áreas de floresta, além de queimadas antrópicas associadas à agricultura, ao desmatamento, ao descarte de resíduos e a atividades industriais. É um dos muitos fenômenos dinâmicos que podem ser detectados por sensoriamento remoto.

## Detecção e monitoramento de incêndios por satélite

Os modelos climáticos projetam que as condições meteorológicas favoráveis ao fogo vão se tornar mais comuns e mais intensas. Os satélites de Observação da Terra (EO, na sigla em inglês) oferecem soluções tecnológicas para detecção precoce, resposta rápida e avaliação pós-incêndio, medindo radiação térmica e fumaça em escalas que vão do regional ao global.

## Detectando focos de calor na superfície da Terra

Os satélites de EO fornecem informações sobre a localização, a intensidade e a evolução temporal do fogo. Sensores de satélite que operam na faixa do infravermelho termal (TIR) conseguem detectar focos de calor na superfície da Terra gerados por incêndios urbanos e florestais, erupções vulcânicas e processos industriais, como a queima de gás em flares nas operações de petróleo e gás.

No caso de incêndios ativos, a detecção e o monitoramento dependem principalmente de medições no infravermelho médio (MIR) e no infravermelho termal (TIR), onde a combustão ativa produz seu sinal mais forte. Sensores como o MODIS e o VIIRS fornecem detecção de anomalias térmicas em tempo real, permitindo a identificação precoce de focos de calor e a avaliação de áreas queimadas.

## Calendários de atividade de queimadas

Com os focos de calor detectados por satélite, é possível desenvolver calendários de atividade de fogo integrando informações históricas a dados recentes, o que permite identificar visualmente e com rapidez padrões sazonais, anomalias e tendências em cada região.

Os sensores MODIS a bordo dos satélites Terra e Aqua fornecem mais de duas décadas de observações, mas estão chegando ao fim de sua vida operacional e sendo substituídos pelos sensores VIIRS. Seus registros não podem ser comparados diretamente sem harmonização, já que o MODIS e o VIIRS têm resoluções espaciais, sensibilidades e horários de observação diferentes.

Aí está a raiz do desafio. À medida que a frequência e a intensidade dos incêndios aumentam, os gestores de emergência se beneficiam de um calendário de focos de calor atualizado e consistente, que lhes permita visualizar rapidamente, por exemplo, quais meses e anos tiveram a maior atividade de fogo, e comparar a atividade de queimadas do mês atual com a mediana histórica de uma área selecionada.

Você pode considerar harmonizar os focos de calor do NASA Earthdata FIRMS, combinando a extensa série histórica do MODIS com a continuidade e o maior detalhamento do VIIRS.

Os gestores de emergência poderiam então usar a aplicação web para monitorar regiões sensíveis, reconhecer mudanças em relação aos padrões históricos e fortalecer a previsão e a resposta a incêndios.`,
    objectives: `Seu desafio é desenvolver, em uma aplicação web, um calendário harmonizado de atividade de queimadas baseado em focos de calor ativos, combinando a extensa série histórica do MODIS com a continuidade e o maior detalhamento do VIIRS para fornecer uma série temporal consistente da atividade de focos de calor.

Este desafio pode ser abordado em duas partes. A primeira é a harmonização dos focos de calor do MODIS e do VIIRS, de modo que, ao fim dessa fase, o sensor de origem não importe mais e os padrões, tendências e anomalias passem a ser o foco.

A segunda envolve desenvolver uma aplicação web que receba como entrada os dados harmonizados de focos de calor. Com essa ferramenta visual, o usuário poderia selecionar uma região e um intervalo de datas específico e, em seguida, baixar análises e visualizações da atividade de fogo.

Um calendário de atividade de queimadas mostrando o número de focos de calor detectados do início dos anos 2000 até hoje, construído sobre o conjunto de dados harmonizado e integrado à aplicação web, daria aos gestores de emergência uma visão do histórico de fogo de uma área: quais períodos do ano têm mais incêndios, quais anos tiveram mais atividade de queimadas e como um incêndio atual se compara aos anteriores.

Além das informações numéricas, você pode considerar como rampas de cores poderiam representar semelhanças e diferenças no número de focos de calor detectados entre os meses, oferecendo uma forma acessível e intuitiva de visualizar a atividade de fogo. Um arquivo CSV para download com os focos de calor detectados durante uma busca seria outro resultado útil.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

- Seu público-alvo pode incluir equipes de alerta precoce e de resposta a emergências, cientistas, gestores de terras e bombeiros.
- Considere tornar sua aplicação web interativa — por exemplo, com um mapa em que os usuários possam desenhar a área de interesse, ou uma opção para digitar latitude e longitude.
- Considere usar rampas de cores acessíveis.
- Sua ferramenta pode representar um calendário de queimadas.
- Sua ferramenta pode se concentrar em alguns índices e números-chave e apresentá-los por meio de visualizações de dados, como:
  - Comparações históricas, incluindo anomalias em relação a médias de vários anos
  - Número de incêndios detectados e registrados`
  },
  '2026-10': {
    background: `A Terra é o nosso laboratório mais acessível para nos prepararmos para explorar a Lua e Marte. Cientistas e engenheiros já usam ambientes "análogos" terrestres — desertos, regiões polares, paisagens vulcânicas, crateras de impacto e cavernas — para estudar processos planetários e testar instrumentos, tecnologias e conceitos de exploração. No entanto, nenhum lugar da Terra reproduz perfeitamente outro ambiente planetário, e lugares diferentes podem servir como análogos úteis para características diferentes.

Enquanto a humanidade se prepara para uma exploração contínua da Lua e para a futura exploração humana de Marte, poderíamos usar dados abertos da Terra, da Lua e de Marte para buscar, de forma global e sistemática, ambientes terrestres que possam servir como análogos úteis — e talvez ainda não reconhecidos. Os participantes podem considerar dimensões como geologia e materiais de superfície, tipo de terreno e topografia, processos atmosféricos e eólicos, como tempestades de poeira, temperatura e outros extremos ambientais, água ou gelo, características biológicas e de habitabilidade, ambientes subterrâneos e condições relevantes para operações robóticas ou humanas.

O objetivo não é simplesmente redescobrir sítios análogos já conhecidos, nem encontrar um lugar que apenas se pareça com a Lua ou com Marte. Os participantes são incentivados a combinar conjuntos de dados de forma criativa para identificar e caracterizar locais em qualquer parte da Terra, explicar o que os torna análogos e o que não os torna, e mostrar como esses ambientes poderiam ajudar a fazer ciência e exploração na Lua ou em Marte. As soluções podem ir da identificação de um sítio, ambiente ou processo geofísico marcante ao desenvolvimento de mapas, métricas de similaridade, abordagens de aprendizado de máquina ou outros métodos inovadores para descobrir e comparar análogos planetários. Você pode considerar dados da Terra, da Lua e de Marte obtidos por missões da NASA e de outras agências espaciais, além de dados e imagens obtidos localmente.`,
    objectives: `Seu desafio é procurar em nosso próprio planeta lugares, ambientes e processos que possam servir como análogos e nos ajudar a explorar a Lua e Marte. Usando dados abertos da NASA sobre a Terra junto com os dados disponíveis da Lua e de Marte de outras agências espaciais e fontes abertas, identifique e caracterize um ou mais locais na Terra que possam servir como análogos úteis para locais candidatos a bases permanentes na Lua ou para futuros locais de pouso e exploração em Marte. Explore o que torna seu local na Terra análogo à Lua ou a Marte. Você pode comparar dados e imagens de geologia e materiais de superfície, terreno e topografia, temperatura e extremos ambientais, água ou gelo, poeira e processos atmosféricos, biologia e habitabilidade, cavernas ou ambientes subterrâneos, ou condições relevantes para a exploração robótica e humana. Seu análogo não precisa corresponder à Lua ou a Marte em todos os aspectos. Explique quais características ou processos oferecem uma analogia forte, onde a analogia deixa de funcionar e como estudar ou usar seu análogo terrestre poderia ajudar a preparar a exploração da Lua ou de Marte.

Seja criativo na forma de buscar, analisar e comunicar seu análogo. Você pode desenvolver um relatório escrito, um mapa interativo, uma visualização, um aplicativo, uma história, um sistema de ranking de similaridade, uma ferramenta de IA/aprendizado de máquina ou outra abordagem inovadora. Você pode investigar um único local marcante, comparar vários locais ao redor do mundo ou desenvolver um método para buscar sistematicamente na Terra análogos ainda não reconhecidos. Use dados abertos da NASA e de outras agências espaciais como sua janela para a Terra, a Lua e Marte — e mostre o que o nosso planeta pode nos ensinar sobre explorar os próximos. Você pode considerar documentar suas descobertas por escrito, para compartilhar com outros entusiastas do tema e educar o público.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

- Pense além da semelhança visual. Dois lugares podem parecer iguais, mas diferir muito em geologia, ambiente ou processos físicos. Use dados para explicar por que o local na Terra que você propõe é um análogo relevante.
- Considere diferentes dimensões de analogia, incluindo:
  - Geologia, mineralogia e materiais de superfície
  - Terreno, elevação, declividade, rugosidade, crateras e outras feições topográficas
  - Temperatura, iluminação e extremos ambientais
  - Água, gelo, permafrost e outros recursos potenciais
  - Poeira, vento, erosão e outros processos atmosféricos ou de superfície
  - Biologia, extremófilos, habitabilidade e bioassinaturas
  - Cavernas, tubos de lava, ambientes subterrâneos e outras feições do subsolo
  - Condições relevantes para pouso, mobilidade, navegação, operações robóticas, exploração humana ou construção
- Um análogo não precisa corresponder em tudo. Um local na Terra pode ser um excelente análogo geológico, mas um análogo ruim de temperatura, por exemplo. Identifique o que é semelhante, o quanto é semelhante e o que é diferente.
- Pense em processos, além de lugares. Processos da Terra como sedimentação, tempestades de poeira, atividade vulcânica, erosão, dinâmica do gelo ou alteração causada pela água podem trazer insights sobre processos que ocorrem hoje — ou que ocorreram no passado — na Lua ou em Marte.
- Olhe além dos sítios análogos já conhecidos. Lugares como a Antártida, o Deserto do Atacama, a Islândia e o Havaí já são amplamente estudados. Os conjuntos de dados globais de observação da Terra da NASA, por exemplo, podem permitir que você descubra análogos marcantes em lugares que receberam muito menos atenção.
- Explore a Terra inteira, inclusive abaixo da superfície. Regiões polares, desertos, montanhas, vulcões, crateras de impacto, salares, geleiras, cavernas, tubos de lava, minas e outros ambientes podem oferecer possibilidades interessantes.
- Use vários conjuntos de dados quando for útil. Combinar observações de terreno, temperatura, geologia, vegetação, água, gelo, aerossóis ou outras características pode revelar relações difíceis de perceber com um único conjunto de dados.
- Considere a escala. Um continente ou um deserto não precisa ser tratado como um único análogo. Uma cratera, um vale, um campo vulcânico, um sistema de cavernas ou mesmo uma pequena área dentro de uma região muito maior pode oferecer uma correspondência muito mais forte.
- Conecte seu análogo à exploração. Explique como o local ou o processo que você identificou poderia ajudar cientistas e engenheiros a entender a Lua, Marte ou ambos; testar instrumentos ou tecnologias; preparar operações robóticas ou humanas; buscar recursos ou sinais de habitabilidade; ou reduzir os riscos da exploração.
- Seja criativo na abordagem. Mapas e visualizações são bem-vindos, mas as soluções também podem usar sistemas de informação geográfica (SIG), análise estatística, métricas de similaridade, aprendizado de máquina ou IA, aplicações interativas, jogos ou outros métodos inovadores.
- Lembre-se dos limites da Terra como análogo. A Terra não consegue reproduzir condições lunares e marcianas importantes, como a gravidade reduzida, o vácuo lunar, a atmosfera rarefeita de Marte ou o ambiente de radiação desses corpos. Reconhecer essas diferenças faz parte de uma boa análise científica.
- Surpreenda a gente. Uma solução forte pode identificar um local inesperado na Terra, revelar uma conexão inesperada entre a Terra e a Lua ou Marte, ou introduzir uma nova forma de usar dados da Terra para viabilizar a exploração futura.`
  }
};
