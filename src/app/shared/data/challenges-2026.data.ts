/**
 * Desafios oficiais do NASA Space Apps Challenge 2026.
 *
 * Fonte: resumos ("challenge summaries") apresentados no treinamento de Local
 * Leads "Team Formation & Challenges" (14/09/2026) — ver `src/assets/desafios/`.
 * Títulos e resumos foram traduzidos para português; dificuldades e tags de tema
 * reproduzem exatamente o que a NASA exibe.
 *
 * Duas mudanças em relação a 2025: são 14 desafios (não 19) e o
 * "Crie Seu Próprio Desafio" foi arquivado — todo projeto precisa responder a
 * um dos desafios abaixo para ser elegível à avaliação global.
 */

import { ADVANCED, BEGINNER, Challenge, INTERMEDIATE } from './challenge.model';

export const CHALLENGES_2026: Challenge[] = [
  {
    id: '2026-01',
    title: 'Abandonados, mas Não Esquecidos: Contando a História dos Equipamentos Descartados da NASA na Lua e em Marte',
    excerpt: 'Desde a década de 1960, a NASA deixou equipamentos espalhados pelo sistema solar — na Lua, em Marte e no espaço profundo. De rovers e instrumentos que concluíram suas missões científicas a sondas que ainda viajam para longe da Terra, esse hardware varia muito tanto em propósito quanto em nível atual de funcionamento. Seu desafio é contar a história de parte ou de todo esse equipamento, apresentando a entusiastas do espaço em idade escolar o hardware e a ciência que ele tornou possível.',
    featuredImage: {
      url: 'assets/desafios/2026/abandoned-but-not-forgotten.jpg',
      alt: 'Modelos dos rovers Sojourner, Spirit/Opportunity e Curiosity no solo marciano'
    },
    categories: [INTERMEDIATE, BEGINNER],
    tags: ['Astrofísica', 'Planetas & Luas', 'Exploração Espacial'],
    slug: 'abandoned-but-not-forgotten-storytelling-about-nasas-discarded-equipment-on-the-moon-and-mars'
  },
  {
    id: '2026-02',
    title: 'Seja um Detetive de Tendências do Sistema Terrestre!',
    excerpt: 'Mudanças acontecem o tempo todo no sistema ambiental interconectado da Terra e, quando seguem uma direção consistente — subindo ou descendo, aumentando ou diminuindo, engrossando ou afinando —, as variáveis medidas refletem isso. Mas uma variável pode apresentar tendência em um sentido numa região e no sentido oposto em outra, mesmo quando o mesmo processo governa as duas. Seu desafio é encontrar e examinar variáveis medidas por missões da NASA ou produzidas por modelos da NASA, visualizar como elas mudam ao longo do tempo e determinar o que está mudando, onde está mudando, quanto está mudando e se essas mudanças são o que os cientistas chamam de "significativas".',
    featuredImage: {
      url: 'assets/desafios/2026/be-an-earth-system-trend-detective.jpg',
      alt: 'Globo terrestre dividido entre imagem de satélite e saída colorida de modelo climático'
    },
    categories: [ADVANCED],
    tags: ['Ciências da Terra', 'Software'],
    slug: 'be-an-earth-system-trend-detective'
  },
  {
    id: '2026-03',
    title: 'Construa um Treinador de Missões para Astronautas Mirins',
    excerpt: 'Conteúdos STEM com tema espacial costumam simplificar demais os trade-offs de engenharia que definem uma missão real, ou apresentá-los em um nível complexo demais para prender a atenção de um jovem aprendiz. Poucas ferramentas tornam esses trade-offs ao mesmo tempo tangíveis e divertidos. Seu desafio é projetar e construir um jogo ou aplicativo interativo que permita a estudantes administrar uma base lunar ou marciana, equilibrando demandas concorrentes como suporte à vida, blindagem contra radiação, energia e produção de alimentos, para que vivenciem na prática as decisões que determinam o fracasso ou o sucesso de uma missão.',
    featuredImage: {
      url: 'assets/desafios/2026/build-a-junior-astronaut-mission-trainer.jpg',
      alt: 'Silhueta de uma criança observando a Terra pela janela de uma espaçonave'
    },
    categories: [INTERMEDIATE, BEGINNER],
    tags: ['Jogos', 'Planetas & Luas', 'Software', 'Exploração Espacial', 'Sol'],
    slug: 'build-a-junior-astronaut-mission-trainer'
  },
  {
    id: '2026-04',
    title: 'Navegador de Missões Lunares CLPS',
    excerpt: 'Missões ao polo sul da Lua enfrentam restrições extremas de iluminação e comunicação, e planejá-las exige coordenação cuidadosa entre as equipes de ciência e de engenharia. Já existem ferramentas para determinar as posições do Sol e da Terra em locais candidatos a pouso, mas suas interfaces complicadas dificultam avaliar informações críticas com eficiência. Seu desafio é criar uma ferramenta ou aplicação intuitiva que permita a planejadores de missão, educadores e ao público comparar rapidamente locais e datas de pouso, visualizando as posições do Sol e da Terra em relação ao horizonte para avaliar o potencial de geração de energia e as janelas de comunicação direta com a Terra.',
    featuredImage: {
      url: 'assets/desafios/2026/clps-lunar-mission-browser.jpg',
      alt: 'Superfície craterada do polo sul da Lua'
    },
    categories: [ADVANCED, INTERMEDIATE, BEGINNER],
    tags: ['Ciências da Terra'],
    slug: 'clps-lunar-mission-browser'
  },
  {
    id: '2026-05',
    title: 'Crie um Software de Monitoramento de Saúde para Astronautas em Missões Espaciais',
    excerpt: 'Missões de longa duração expõem astronautas à radiação espacial, ao isolamento e confinamento, à gravidade alterada e a um ambiente fechado e hostil, o que pode provocar alterações imunológicas, perda óssea, eventos cardiovasculares e problemas de saúde comportamental. Em missões longas, os astronautas carregam boa parte da responsabilidade de identificar essas mudanças em si mesmos. Seu desafio é construir um software de monitoramento de saúde que reúna indicadores de saúde e permita aos astronautas avaliar o próprio estado de saúde e agir a partir dele.',
    featuredImage: {
      url: 'assets/desafios/2026/create-health-monitoring-software.jpg',
      alt: 'Astronauta se exercitando na Estação Espacial Internacional ao lado de um painel de sinais vitais'
    },
    categories: [INTERMEDIATE],
    tags: ['Software', 'Exploração Espacial'],
    slug: 'create-health-monitoring-software-for-astronauts-on-space-missions'
  },
  {
    id: '2026-06',
    title: 'Dançando com os SARs',
    excerpt: 'A superfície da Terra é uma dança infinita de processos naturais e atividades humanas, mas essas mudanças costumam ser difíceis de visualizar, entender e comunicar. Da perda de áreas úmidas a incêndios florestais, terremotos, atividades agrícolas, movimentação de geleiras e muito mais, a Terra vive uma valsa constante de mudanças na superfície. Seu desafio é construir uma aplicação interativa que use dados de sensoriamento remoto por radar da missão NISAR (NASA-ISRO Synthetic Aperture Radar) para rastrear e visualizar um ou mais tipos de mudança de superfície em locais ao redor do mundo.',
    featuredImage: {
      url: 'assets/desafios/2026/dancing-with-the-sars.jpg',
      alt: 'Imagem de radar de abertura sintética mostrando mudanças na superfície terrestre em falsas cores'
    },
    categories: [ADVANCED, INTERMEDIATE],
    tags: ['Ciências da Terra'],
    slug: 'dancing-with-the-sars'
  },
  {
    id: '2026-07',
    title: 'Virada no Campo: Adaptando Fazendas com Dados da NASA',
    excerpt: 'Agricultores no mundo todo lidam com temperaturas em transformação, mudanças nos padrões de chuva, escassez de água, eventos climáticos extremos e queda na saúde do solo. Essas pressões dificultam a escolha de rotações de culturas que protejam as lavouras, conservem água e sustentem a resiliência a longo prazo. Seu desafio é criar uma ferramenta de apoio à decisão que use observações da Terra da NASA junto com informações locais de solo, características das culturas e prioridades dos produtores, ajudando agricultores a explorar estratégias de rotação capazes de fortalecer a saúde do solo e adaptar suas fazendas às novas condições.',
    featuredImage: {
      url: 'assets/desafios/2026/field-shift-adapting-farms.jpg',
      alt: 'Agricultora examinando grãos em uma lavoura ao pôr do sol, ao lado de um pivô de irrigação'
    },
    categories: [ADVANCED, INTERMEDIATE],
    tags: ['Artes & Multimídia', 'Ciências da Terra', 'Software'],
    slug: 'field-shift-adapting-farms-with-nasa-data'
  },
  {
    id: '2026-08',
    title: 'Chama em Queda Livre: Segurança contra Incêndio com IA a partir de Dados de Combustão em Microgravidade',
    excerpt: 'Há décadas a NASA estuda como chamas e incêndios se comportam em microgravidade, acumulando no caminho um vasto acervo de dados experimentais. Esse conhecimento importa mais do que nunca enquanto nos preparamos para voltar à Lua e seguir rumo a Marte, mas o volume de resultados os torna difíceis de encontrar, comparar e entender. Seu desafio é criar um painel interativo movido a inteligência artificial que resuma, classifique e interprete esses achados para entregar insights de segurança contra incêndio para a exploração espacial humana.',
    featuredImage: {
      url: 'assets/desafios/2026/flame-in-freefall.jpg',
      alt: 'Chama esférica queimando em microgravidade durante experimento da NASA'
    },
    categories: [ADVANCED, INTERMEDIATE],
    tags: ['Exploração Espacial'],
    slug: 'flame-in-freefall-ai-powered-fire-safety-insights-from-microgravity-combustion-data'
  },
  {
    id: '2026-09',
    title: 'Harmonização dos Focos de Calor do MODIS e do VIIRS',
    excerpt: 'Entender como a atividade de queimadas se distribui pelo planeta ao longo do tempo — incluindo incêndios florestais e queimadas agrícolas intensas o bastante para serem detectadas por sensores de satélite — permite antecipar períodos críticos, orientar esforços de monitoramento e melhorar a resposta a incêndios. Os satélites rastreiam focos de calor ativos há mais de duas décadas, mas o registro está fragmentado entre sensores cujos dados não podem ser comparados diretamente, deixando os gestores de incêndio sem um retrato consistente de quando e onde as queimadas ocorreram. Seu desafio é construir uma aplicação web que harmonize esses registros em um calendário de atividade de queimadas baseado em focos de calor ativos, permitindo que equipes de alerta precoce e de resposta a emergências, cientistas e gestores de terras examinem padrões históricos de fogo, condições atípicas e períodos críticos dentro de uma área de interesse selecionada.',
    featuredImage: {
      url: 'assets/desafios/2026/harmonization-of-modis-and-viirs-hot-spots.jpg',
      alt: 'Imagem de satélite em falsas cores mostrando cicatriz de incêndio e foco de calor ativo'
    },
    categories: [ADVANCED, INTERMEDIATE],
    tags: [],
    slug: 'harmonization-of-modis-and-viirs-hot-spots'
  },
  {
    id: '2026-10',
    title: 'Identifique Locais na Terra Análogos às Futuras Bases Permanentes na Lua e em Marte',
    excerpt: 'A escolha de futuros locais de pouso e de bases lunares depende de muitos fatores, entre eles topografia, geologia, ambiente e recursos disponíveis. Lugares na Terra com características análogas às da Lua ou de Marte — o Deserto do Atacama, a Cratera Haughton, o Vale da Morte — permitem que equipes de missão testem equipamentos e métodos antes do voo; no entanto, esses sítios análogos terrestres não estão totalmente caracterizados. Seu desafio é usar dados abertos da Terra, da Lua e de Marte da NASA e de outras agências espaciais para identificar e caracterizar novos análogos terrestres para futuras bases ou locais de pouso, recorrendo a desertos, regiões polares, terrenos vulcânicos e áridos, cavernas e outros ambientes que compartilhem condições com a superfície lunar ou marciana.',
    featuredImage: {
      url: 'assets/desafios/2026/identify-earth-locations-analog.jpg',
      alt: 'Nascer da Terra visto acima do horizonte lunar'
    },
    categories: [ADVANCED, INTERMEDIATE, BEGINNER],
    tags: ['Ciências da Terra', 'Planetas & Luas', 'Software', 'Exploração Espacial'],
    slug: 'identify-earth-locations-that-analog-the-permanent-moon-base-locations-and-mars'
  },
  {
    id: '2026-11',
    title: 'Guia de Sobrevivência Interplanetário: Mapa Marciano',
    excerpt: 'A NASA explora Marte de forma robótica há décadas, estudando seu ambiente extremo, mapeando sua superfície e coletando muitos tipos de dados. Longe de casa, os primeiros astronautas da NASA a pisar em Marte vão querer o melhor mapa possível, com informações sobre os detalhes de suas rotas e destinos, atualizações sobre as condições atuais e os dados necessários para cumprir a missão com rapidez e segurança. Seu desafio é criar uma visão integrada e em camadas de um local ou rota na superfície marciana que reúna dados de múltiplas missões científicas da NASA e possa ajudar um explorador humano a planejar e executar uma caminhada marciana bem-sucedida, fazendo ciência nova e empolgante pelo caminho.',
    featuredImage: {
      url: 'assets/desafios/2026/interplanetary-survival-guide-martian-map.jpg',
      alt: 'Concepção artística de astronautas e um módulo de pouso na superfície de Marte'
    },
    categories: [INTERMEDIATE],
    tags: ['Software', 'Exploração Espacial'],
    slug: 'interplanetary-survival-guide-martian-map'
  },
  {
    id: '2026-12',
    title: 'Planeta X e SPHEREx',
    excerpt: 'Desde 2025, a missão SPHEREx da NASA vem mapeando todo o céu a cada seis meses em 102 bandas de luz infravermelha próxima, devolvendo imagens de mais de um bilhão de objetos. Cometas, asteroides, estrelas, anãs marrons e até novos planetas se revelam ao mudar de posição entre as imagens, mas ninguém consegue vasculhar sozinho todo esse volume de dados. Seu desafio é criar uma ferramenta web aberta ao público para exibir imagens do céu obtidas pela missão SPHEREx, tornando fácil para qualquer pessoa ver rapidamente como elas mudam ao longo do tempo.',
    featuredImage: {
      url: 'assets/desafios/2026/planet-x-and-spherex.jpg',
      alt: 'Concepção artística do observatório espacial SPHEREx em órbita da Terra'
    },
    categories: [ADVANCED],
    tags: ['Exploração Espacial'],
    slug: 'planet-x-and-spherex'
  },
  {
    id: '2026-13',
    title: 'Jogo de Design de Missões Espaciais',
    excerpt: 'Projetar uma missão espacial exige considerar cuidadosamente demandas concorrentes, como objetivos da missão, projeto da espaçonave, instrumentos científicos, veículos lançadores, orçamentos, energia, massa, comunicações e restrições orbitais. Para estudantes que raramente têm a chance de experimentar uma missão inteira, do conceito à operação, esses trade-offs costumam permanecer abstratos. Seu desafio é criar um jogo interativo que permita aos participantes projetar, gerenciar e simular uma missão espacial completa, tomando decisões de engenharia, administrando recursos limitados e avaliando como cada escolha molda o sucesso da missão.',
    featuredImage: {
      url: 'assets/desafios/2026/space-mission-design-game.jpg',
      alt: 'Astronauta em caminhada espacial tendo a Terra ao fundo'
    },
    categories: [INTERMEDIATE, BEGINNER],
    tags: ['Jogos'],
    slug: 'space-mission-design-game'
  },
  {
    id: '2026-14',
    title: 'A Jukebox de Informações da Terra',
    excerpt: 'O Earth Information Center (EIC) da NASA produz visualizações impressionantes do nosso planeta em transformação, mas apresentar a ciência da Terra apenas por meio de imagens limita quem consegue alcançá-la. Convidamos você a tornar essa ciência complexa acessível, envolvente e multissensorial, traduzindo o que se vê em som. Seu desafio é construir uma "Jukebox da Terra" — uma interface, script ou aplicação que combine os quadros visuais do Earth Information Center com sonificações dinâmicas geradas em tempo real.',
    featuredImage: {
      url: 'assets/desafios/2026/the-earth-information-jukebox.jpg',
      alt: 'Pessoa diante de uma instalação imersiva com projeção da Terra e vegetação luminosa'
    },
    categories: [INTERMEDIATE, BEGINNER],
    tags: ['Artes & Multimídia', 'Ciências da Terra', 'Software'],
    slug: 'the-earth-information-jukebox'
  }
];
