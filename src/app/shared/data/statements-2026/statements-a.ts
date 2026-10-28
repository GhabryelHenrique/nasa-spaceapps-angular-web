import { ChallengeStatement } from '../challenge.model';

export const STATEMENTS_2026_A: Record<string, ChallengeStatement> = {
  '2026-01': {
    background: `Há mais de meio século, a humanidade envia máquinas incríveis para a Lua, para Marte e para outros corpos celestes. Quando suas missões terminam, sondas, rovers, módulos de pouso, estágios de descida e instrumentos científicos ficam para trás, parados — ou voando — em silêncio, como monumentos à exploração humana. As agências espaciais conhecem a história dessas máquinas, mas os entusiastas do espaço em idade escolar costumam ouvir falar apenas das missões ativas, em andamento. Há aqui uma oportunidade real de inspirar a próxima geração com as histórias ricas e pouco contadas desses artefatos fora da Terra e da ciência pioneira que abriu caminho para as conquistas de hoje e para a exploração de amanhã.

Para responder a este desafio, os participantes vão querer saber que tipos de equipamento estão hoje na Lua, em Marte e em outros lugares — rovers antigos, estágios de descida, cargas científicas — e as missões específicas que eles tornaram possíveis. A prioridade é traduzir dados históricos e científicos complexos em uma narrativa envolvente.

Quem quer aprender sobre missões espaciais do passado muitas vezes precisa encarar sites técnicos densos ou livros de história que não têm a centelha de imaginação e de narrativa necessária para prender a atenção de um público mais jovem ou mais casual. Projetos possíveis incluem um mapa interativo da Lua com "rovers fantasmas" clicáveis, uma graphic novel digital contada do ponto de vista de um módulo de pouso adormecido em Marte ou uma série de podcasts em áudio que narra os últimos dias de um instrumento no espaço profundo. Incentivamos você a pensar fora da caixa e a desenvolver suas próprias alternativas criativas!`,
    objectives: `O objetivo deste desafio é criar uma ferramenta educacional ou uma narrativa envolvente, guiada por uma história, que ensine entusiastas do espaço em idade escolar e o público casual sobre o hardware deixado na Lua, em Marte e em outros lugares. Seu projeto pode trazer (de volta) à vida esses artefatos silenciosos ou ainda ativos, explicando o que são, por que foram enviados ao espaço e as descobertas científicas que fizeram e continuam fazendo.

Seu projeto final pode assumir muitas formas, e aceitamos uma variedade de formatos e tecnologias. Por exemplo, você pode desenvolver uma experiência web interativa usando HTML, CSS ou JavaScript; prototipar um videogame educativo na engine de sua preferência; escrever e ilustrar um livro infantil digital; produzir um vídeo curto de animação; projetar uma linha do tempo interativa em 3D; ou seguir uma abordagem completamente diferente!`,
    considerations: `Seja qual for o meio ou a tecnologia que você escolher, um foco forte na narrativa vai fazer bem ao seu projeto. Considere entrelaçar fatos históricos reais e dados das missões na sua história, mostrando ao público como essas missões funcionavam em vez de apenas listar fatos sobre elas. A ideia é traçar uma conexão clara e empolgante entre a engenharia do hardware e o conhecimento científico que a humanidade obteve com ele. Ao fim da sua história, o público pode sair sentindo uma conexão pessoal com esses exploradores robóticos esquecidos e inspirado pela ciência que eles realizaram. A precisão é importante do começo ao fim!

Você pode (mas não é obrigado a) considerar o seguinte:

- Para qual faixa etária a sua história foi pensada?
- Quão acessível é o formato que você escolheu?
- Você quer focar em missões e equipamentos específicos ou contar uma história mais ampla sobre a exploração da NASA?
- Quais perspectivas você quer destacar?`
  },
  '2026-02': {
    background: `Instrumentos a bordo de satélites observam muitos aspectos diferentes do sistema terrestre: na terra, na atmosfera e nos oceanos. Modelos globais também usam dados de instrumentos de satélite e outros tipos de dados para examinar e analisar o sistema terrestre. Um motivo importante para isso é observar e caracterizar mudanças no sistema terrestre. Mudanças — especialmente as que seguem uma direção específica ao longo do tempo, ou seja, uma tendência — indicam tanto os processos que as causam quanto os processos que vão reagir a elas.

Um fator que complica esse trabalho é a enorme variedade de variáveis que podem ser estudadas. Outro é que as mudanças em uma variável podem seguir uma direção em uma região e a direção oposta em outra, mesmo quando as duas tendências são causadas pelo mesmo processo! Por isso, o problema tem duas partes importantes: encontrar variáveis que apresentam tendência, das mais simples, como temperatura e chuva, às mais complexas, como evaporação ou vazão de rios; e analisar tendências em regiões específicas da terra, do oceano ou até de camadas da atmosfera.

Instrumentos como o Moderate Resolution Imaging Spectroradiometer (MODIS), o Ozone Monitoring Instrument (OMI), o Atmospheric Infrared Sounder (AIRS) e o Global Precipitation Measurement (GPM) fornecem variáveis que podem ser analisadas. Modelos globais — com destaque para o Modern Era Retrospective analysis for Research and Applications, Version 2 (MERRA-2) e o Global Land Data Assimilation System (GLDAS) — fornecem muitas outras. Encontrar e analisar tendências significativas e relacioná-las aos processos que as causam é um dos usos mais importantes dos dados de ciências da Terra da NASA.`,
    objectives: `Uma resposta bem-sucedida a este desafio vai reunir vários elementos importantes.

O primeiro é identificar variáveis de ciências da Terra de interesse que possam ser investigadas em busca de possíveis tendências. Como observado no Contexto, a NASA e outras agências espaciais oferecem inúmeras variáveis, algumas conhecidas e outras mais especializadas, usadas por ramos específicos da ciência.

O segundo é obter as variáveis para uma região específica, já que a maioria das tendências nos dados não é global — embora algumas possam ser!

O terceiro é gerar e visualizar uma série temporal da variável e da região de interesse ao longo de um período longo o bastante para permitir uma análise estatística.

O elemento final do desafio é fazer uma análise estatística básica dessa série temporal, indicando a taxa de mudança ao longo do tempo, e testar a significância da tendência com métodos como o teste t, o teste de Mann-Kendall ou intervalos de confiança.

Os sites de dados oferecem ferramentas que geram séries temporais, e pacotes de análise estatística fornecem testes básicos de significância. Uma resposta que faça tanto a visualização quanto a análise cumpre o escopo completo deste desafio.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

## Público

- Este desafio envolve dados científicos e análise estatística, então o público provável são estudantes do ensino médio e da universidade, além de pessoas do público em geral que tenham alguma formação científica.
- Oferecer definições simples das variáveis ajudaria muito esses usuários.
- A ideia é ajudar os usuários a se tornarem detetives de dados — encontrando variáveis de interesse e, em seguida, determinando se essas variáveis mostram uma tendência e se essa tendência é significativa.

## Abordagem

- Os usuários poderiam responder a uma pequena série de perguntas sobre o que ou onde gostariam de investigar, e as respostas permitiriam buscar variáveis relacionadas. Seria muito útil oferecer alguns exemplos de demonstração que o usuário pudesse assistir e que o ajudassem a entender como a ferramenta funciona.
- Embora não seja obrigatório, a superinteligência (SI) pode ser útil aqui para identificar dados com potencial de mostrar tendências em áreas específicas, com base em reportagens e artigos científicos ou nas características de uma região, como um deserto, uma floresta tropical, um estuário de maré ou a atmosfera sobre uma grande cidade.

## Trabalhando com os dados

- Os dados de ciências da Terra estão disponíveis em várias resoluções temporais diferentes — horária, a cada 3 horas, diária e mensal. Para este desafio, os dados diários e mensais provavelmente são os mais fáceis de processar.
- Encontrar uma tendência é interessante mesmo que ela não atinja o nível de significância. Às vezes, tudo de que uma tendência precisa para se tornar significativa é um período mais longo de dados.
- Considere procurar ferramentas públicas para plotar dados hidrológicos oferecidas por organizações externas, como o Consortium of Universities for the Advancement of Hydrologic Science, Inc. (CUAHSI).

A análise de tendências com dados de ciências da Terra pode ser complexa. As tendências podem ser não lineares, e algumas não ficam evidentes a menos que ciclos regulares, como o ciclo sazonal, sejam removidos. Análises de tendência mais complexas estão além do escopo previsto para este desafio; detectar e analisar tendências lineares já seria um ótimo começo.`
  },
  '2026-03': {
    background: `Enquanto a NASA trabalha para estabelecer uma presença sustentada na Lua e estender a exploração humana rumo a Marte, um dos desafios mais persistentes não é apenas construir o hardware — é fazer o público entender o que a sobrevivência realmente exige nesses ambientes. Astronautas em um posto avançado lunar ou marciano precisam equilibrar demandas concorrentes: a energia limitada tem de ser dividida entre suporte à vida, comunicações e ciência; a exposição à radiação tem de ser pesada contra os objetivos da missão; e toda decisão tem um custo em recursos que se acumula ao longo do tempo. São os mesmos tipos de trade-offs que os planejadores de missão da própria NASA enfrentam diariamente, com base em dados reais — atividade solar e risco de radiação do Space Weather Database (DONKI), dosimetria de radiação de astronautas e pesquisa biológica do Open Science Data Repository (OSDR) e dados ambientais das missões Artemis e das missões na superfície de Marte.

A lacuna está na tradução. O conteúdo de educação espacial para crianças muitas vezes é abstrato demais (por exemplo, pôsteres e fatos gerais) para transmitir trade-offs reais, ou pressupõe uma formação técnica avançada demais para que um público jovem se envolva de verdade. Como resultado, muitos estudantes nunca têm contato com a lógica real de tomada de decisão por trás de uma missão — só com os seus resultados. Conteúdos puramente educativos costumam ter dificuldade para prender a atenção; conteúdos puramente voltados ao entretenimento podem perder a precisão.

Os participantes podem priorizar o design de mecânicas — e não só do visual — que reflitam restrições reais: uma escolha que economiza energia hoje pode custar oxigênio amanhã. Basear a jogabilidade em dados abertos reais da NASA, em vez de estatísticas inventadas, é incentivado. Abordagens possíveis incluem gerenciamento de recursos no estilo sobrevivência, árvores de decisão narrativas ou simuladores de controle de missão em formato de painel — mas os participantes são incentivados a explorar o formato que melhor ensine o trade-off por trás de tudo, em vez de seguir um único modelo.`,
    objectives: `Seu desafio é projetar e construir um jogo ou aplicativo interativo que permita a crianças de 7 a 12 anos administrar um posto avançado lunar ou marciano, tomando decisões reais sobre suporte à vida, blindagem contra radiação, orçamento de energia, produção de alimentos e atraso nas comunicações, e vivenciando como essas escolhas se desenrolam ao longo de uma missão simulada.

Pense em como sua ferramenta pode transformar restrições reais de missão em jogabilidade: como é trocar reservas de oxigênio por uma oportunidade extra de pesquisa, ou reforçar a blindagem contra um evento de radiação ao custo do fornecimento de energia desta noite? Como você vai representar recursos concorrentes de modo que nenhuma escolha saia de graça e que cada decisão ensine algo verdadeiro sobre o que astronautas e planejadores de missão realmente enfrentam?

Você é incentivado a basear sua simulação em dados abertos reais da NASA sempre que possível — por exemplo, usando o DONKI para refletir a atividade solar e o risco de radiação reais, o OSDR para resultados reais de pesquisas sobre a saúde de astronautas e pesquisas biológicas, ou dados das missões Artemis e das missões na superfície de Marte para definir as condições ambientais do local escolhido. Incorporar conjuntos de dados da NASA, ao vivo ou de arquivo, em vez de números inventados, vai deixar a experiência mais autêntica e dar aos jogadores uma janela genuína para como as decisões críticas de uma missão são tomadas.

O formato é livre: você pode construir um jogo de sobrevivência com gerenciamento de recursos, um simulador de decisões guiado por narrativa, uma experiência no estilo painel de controle de missão ou algo totalmente diferente — no navegador, no celular ou no desktop. O objetivo é um protótipo funcional que demonstre a mecânica de trade-off com clareza suficiente para que um jogador jovem saia entendendo uma restrição real da sobrevivência no espaço profundo, e não apenas tendo jogado um jogo divertido. Interpretações criativas de "posto avançado", "local" ou "missão" para além da Lua e de Marte são bem-vindas, desde que o objetivo educacional de fundo — ensinar trade-offs reais de engenharia por meio do jogo — continue no centro.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

## Público e acessibilidade

- Seu público-alvo são crianças de 7 a 12 anos, mas considere se a sua ferramenta pode se adaptar para envolver também irmãos mais velhos, pais ou turmas em sala de aula.
- Prefira linguagem simples a jargões; quando um termo científico for inevitável — dose de radiação, microgravidade, sol (o dia marciano) — explique-o brevemente no contexto em vez de pressupor conhecimento prévio.
- Uma barreira de entrada baixa faz diferença — uma experiência jogável no navegador, sem download nem cadastro, vai alcançar mais participantes durante a avaliação e mais estudantes depois.

## Base em dados reais

- Sempre que possível, use as APIs públicas e os conjuntos de dados abertos da NASA em vez de inventar números que pareçam plausíveis — mesmo uma pequena quantidade de dados reais (uma leitura real de radiação, uma foto real de Marte, um resultado real sobre a saúde de astronautas) torna a experiência muito mais crível do que uma totalmente simulada.
- Atribua claramente as fontes de dados dentro da própria ferramenta, para que os jogadores entendam que estão lidando com ciência real da NASA, e não apenas com um jogo temático.
- Se chamadas a APIs ao vivo não forem viáveis no tempo de desenvolvimento, um conjunto de dados reais selecionado e embutido diretamente na ferramenta é uma alternativa razoável e honesta — só não apresente dados estáticos como se fossem ao vivo.

## Armadilhas de jogabilidade e design a evitar

- Evite criar uma escolha "segura" que não tenha custo — o valor educacional vem do fato de toda decisão envolver um trade-off genuíno, refletindo o planejamento real de missões.
- Não deixe o acabamento visual substituir a precisão das mecânicas — um jogo simples que ensina uma restrição real vale mais do que um jogo bonito que não ensina.
- Evite sobrecarregar jogadores jovens com sistemas demais para acompanhar ao mesmo tempo; dois ou três recursos centrais — suporte à vida, energia, blindagem — costumam ser mais eficazes do que cinco ou seis.

## O que faria uma solução se destacar

- Ferramentas que permitam aos jogadores ver as consequências reais da sua escolha no jogo — ligando uma decisão de blindagem contra radiação aos dados atuais de clima espacial.
- Rejogabilidade — mecânicas ou eventos que variam entre as partidas incentivam as crianças a testar estratégias diferentes e a aprender com o fracasso sem que isso pareça um castigo.
- Acompanhar o protótipo funcional de uma breve explicação sobre quais conjuntos de dados da NASA foram usados e por quê, tornando a ciência rastreável e verificável pelos jurados.`
  },
  '2026-04': {
    background: `O programa Commercial Lunar Payload Services (CLPS) da NASA e outras missões lunares dependem de uma escolha cuidadosa de locais e datas de pouso que equilibre as necessidades das equipes de ciência e de engenharia. Um dos maiores desafios nesse processo é entender o ambiente local de iluminação e de comunicação em um possível local de pouso. A posição do Sol determina a energia disponível para os painéis solares e as condições térmicas dos equipamentos, enquanto a posição da Terra determina se a comunicação direta é possível sem satélites de retransmissão.

Esse desafio é especialmente agudo no polo sul da Lua, onde muitas missões futuras estão planejadas por causa da presença de gelo de água e de outros recursos de grande valor científico. A geometria do polo sul cria variações extremas na iluminação solar e na visibilidade da Terra ao longo de diferentes dias e estações lunares. Pequenas mudanças no local ou na data de pouso podem afetar drasticamente tanto o potencial de geração de energia quanto as janelas de comunicação, o que torna crítica a avaliação rápida dos locais.

Na prática, o desenvolvimento de uma missão raramente segue um cronograma fixo. Dificuldades no desenvolvimento do hardware, atrasos no lançamento ou outros fatores muitas vezes obrigam os planejadores de missão a reconsiderar a data e o local de pouso originais. Quando isso acontece, os engenheiros precisam avaliar rapidamente locais alternativos na mesma região, ou datas alternativas no mesmo local, para entender como essas mudanças afetam a viabilidade da missão. Uma ferramenta que permita comparar vários cenários de forma rápida e intuitiva aceleraria esse processo de decisão e ajudaria as equipes a identificar alternativas viáveis quando as restrições mudam.

As ferramentas que fornecem essas informações — como o Quickmap da NASA, o Moon Trek e o JPL Horizons System — foram feitas para análises detalhadas e muitas vezes são difíceis de usar com eficiência por não especialistas que precisam comparar cenários rapidamente. Avaliar cada combinação de local e data significa navegar por várias interfaces e interpretar dados brutos. Isso deixa uma lacuna entre os dados técnicos disponíveis e as ferramentas acessíveis necessárias para apoiar um planejamento de missão ágil. Uma interface intuitiva que traduza dados complexos de efemérides e de topografia em visualizações claras e comparáveis pode ajudar a preencher essa lacuna.`,
    objectives: `Seu desafio é criar uma ferramenta ou aplicação que permita avaliar rapidamente opções de locais de pouso lunar. Sua solução pode incluir:

- Seleção e comparação interativa de locais: você pode permitir que os usuários escolham em uma lista selecionada de locais de pouso notáveis — como os das missões Apollo, alvos de futuras missões do CLPS, alvos de outras missões lunares comerciais ou locais de pouso de programas lunares de outros países —, além de poderem inserir coordenadas lunares personalizadas. Você também pode permitir a comparação lado a lado ou sequencial de vários locais, para ajudar os usuários a avaliar os trade-offs rapidamente.
- Flexibilidade de data e hora: você pode permitir que os usuários escolham datas e horários de pouso e oferecer ferramentas para explorar como as condições mudam ao longo de diferentes dias ou estações lunares. Isso permite entender como ajustes no cronograma da missão afetam sua viabilidade.
- Visualização das posições do Sol e da Terra: mostre as posições do Sol e da Terra em relação ao horizonte em um local de pouso selecionado, na data escolhida. Você pode mostrar quanto tempo falta para o pôr do sol ou para o ocaso da Terra (Earthset), já que isso afeta diretamente as operações da missão e as janelas de geração de energia.
- Avaliação de energia e comunicação: você pode destacar métricas-chave, como o ângulo de elevação solar (que afeta a eficiência da geração de energia), a duração da luz solar e as janelas de visibilidade da Terra. Essas métricas ajudam os planejadores de missão a avaliar rapidamente se uma combinação de local e data é viável.
- Múltiplas abordagens de visualização: você pode explorar mapas 2D, visualizações 3D da superfície ou outras representações criativas que ajudem os usuários a entender as relações espaciais entre o local de pouso, o Sol e a Terra.
- Dinâmica temporal: você pode criar animações ou visões em linha do tempo que mostrem como as posições do Sol e da Terra mudam ao longo de um dia lunar ou de vários dias, ajudando os usuários a entender a duração e o momento das janelas operacionais.
- Acessibilidade para diferentes níveis de conhecimento: sua ferramenta pode atender planejadores de missão que buscam informações técnicas detalhadas para decidir rapidamente, assim como educadores e o público em geral curiosos para entender por que a Lua apresenta desafios de engenharia tão particulares.

Você é incentivado a ser criativo na forma de apresentar essas informações. Sua solução pode ser uma aplicação web, um aplicativo para celular, uma visualização interativa, um jogo educativo ou outro formato completamente diferente — desde que torne a avaliação rápida de locais clara e eficiente.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

## Abordagem técnica

- Os dados de efemérides — as posições e os movimentos dos corpos celestes — podem ser calculados com ferramentas como o JPL Horizons System, ou você pode usar conjuntos de dados pré-calculados.
- Dados de topografia lunar de fontes como o Lunar Orbiter Laser Altimeter (LOLA) podem ajudar a criar visualizações realistas da superfície e cálculos precisos do horizonte.
- Considere como lidar com a ausência de atmosfera na Lua ao calcular as posições em relação ao horizonte. Sem refração atmosférica, o horizonte é determinado pelo terreno local e pela borda da esfera lunar vista a partir do local de pouso.
- O ângulo de elevação solar é uma métrica-chave para a geração de energia, e você pode calculá-lo e exibi-lo com destaque.

## Experiência do usuário

- Sua interface pode priorizar a comparação rápida de cenários, permitindo que planejadores de missão avaliem várias combinações de local e data com eficiência.
- Considere como comunicar com clareza o tempo restante até o pôr do sol ou o ocaso da Terra (Earthset), já que essa é uma informação operacional crítica.
- Pense em como tornar evidentes as diferenças extremas entre as condições lunares e terrestres — elas podem ser impactantes quando bem visualizadas.
- Você pode incluir recursos que ajudem os usuários a entender por que pequenas mudanças de local ou de data têm grande impacto na viabilidade da missão.

## Dados e precisão

- Considere levar em conta a topografia real da Lua, já que a elevação do terreno pode afetar significativamente as posições em relação ao horizonte e as janelas de visibilidade.
- Considere se sua ferramenta vai levar em conta fatores como a libração da Terra (oscilação) ou as variações orbitais da Lua.
- O terreno do polo sul é particularmente complexo, e você pode pensar em como representar encostas íngremes e crateras profundas que criam condições extremas de sombra.

## Engajamento e impacto

- Sua solução pode apoiar os planejadores de missão na coordenação entre as equipes de ciência e de engenharia durante o desenvolvimento da missão.
- Ela pode ajudar as equipes a reagir rapidamente quando mudanças de cronograma ou dificuldades no desenvolvimento do hardware exigirem ajustes na data ou no local de pouso.
- Ela também pode servir como ferramenta educacional para ajudar estudantes e o público a entender os desafios da exploração lunar e por que o planejamento de missões é tão complexo.`
  },
  '2026-05': {
    background: `Com o aumento dos investimentos em tecnologia de espaçonaves e em pesquisa, as missões espaciais ficaram mais ambiciosas. O programa Artemis da NASA realizou recentemente um sobrevoo lunar tripulado, e a NASA e outras organizações planejam enviar humanos a Marte no futuro. Com missões cada vez mais longas, os astronautas vão ficar mais expostos ao ambiente hostil do espaço, o que traz riscos à saúde física e mental.

O Human Research Program da NASA mapeou os cinco perigos do voo espacial humano: radiação espacial, isolamento e confinamento, distância da Terra, campos gravitacionais e ambientes fechados hostis. Esses perigos podem contribuir para problemas de saúde como alterações no sistema imunológico, perda de densidade óssea, eventos cardiovasculares, nutrição inadequada, condições de saúde comportamental, entre outros. Os astronautas precisam ser capazes de avaliar a própria saúde durante uma missão, para prevenir e tratar os problemas que possam surgir. Alguns indicadores de saúde úteis são pressão arterial, frequência cardíaca, glicemia, temperatura corporal, horas de sono por dia e humor.`,
    objectives: `Seu desafio é criar uma ferramenta visual que ajude os astronautas a avaliar a própria saúde durante missões espaciais e ofereça orientações sobre tratamentos e melhorias de saúde. Você pode coletar dados do usuário por qualquer tipo de entrada — texto digitado, cliques do mouse ou imagens da câmera, por exemplo. Qualquer tipo de dado pode ser usado, desde que represente um indicador de saúde, como níveis de glicemia em mg/dL ou imagens de ultrassom.

Você pode usar os recursos do Human Research Program da NASA, junto com os recursos públicos de outras agências espaciais, para entender como os perigos do voo espacial afetam a saúde humana e para decidir quais indicadores são úteis e como eles podem apoiar uma avaliação rápida. Quais medições podem ser feitas no espaço? Por que um exame é necessário? Como os perigos do voo espacial afetam esses indicadores de saúde? Quando um resultado pode exigir a atenção da tripulação ou dos médicos de voo em solo? Que ações podem ser tomadas para prevenir uma condição de saúde crítica? Vale a pena considerar essas perguntas enquanto você desenvolve sua solução.

O design da interface do usuário tem papel importante na apresentação clara de métricas e diagnósticos. Você pode aproveitar animações e interatividade para apresentar as informações. Por exemplo, o software pode exibir uma figura humana em que cada parte do corpo é clicável e mostra informações sobre sua função e seu estado de saúde.`,
    considerations: `Você pode (mas não é obrigado a) considerar o seguinte:

- Sua ferramenta pode oferecer informações de saúde para astronautas em diferentes ambientes, como uma espaçonave, uma estação espacial, um rover ou uma base em outro planeta ou lua.
- Sua ferramenta pode pedir aos astronautas que façam medições ou realizem ações específicas de tempos em tempos, como parte da rotina da missão.
- Sua ferramenta pode incluir os seguintes recursos:
  - Um sistema de gamificação para ajudar os astronautas a se engajar em tarefas que beneficiem sua saúde
  - Gráficos dinâmicos que mostrem como os indicadores de saúde do astronauta mudam ao longo do tempo
  - Códigos de cores que ajudem o astronauta a interpretar o estado de um indicador de saúde num relance
- Não presuma que os astronautas sabem tudo sobre como avaliar a própria saúde. Sua ferramenta pode oferecer instruções e explicações simples sobre medições, indicadores de saúde e riscos.`
  }
};
