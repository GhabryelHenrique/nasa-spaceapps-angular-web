export interface Challenge {
  id: string;
  title: string;
  excerpt: string;
  featuredImage: {
    url: string;
    alt: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    color: string;
  }>;
  skills: string[];
  slug: string;
}

export const CHALLENGES_DATA: Challenge[] = [
  {
    id: "aWQ6MzEzMTk=",
    title: "Celebração Animada dos Dados da Terra!",
    excerpt: "O satélite de observação diária da Terra mais antigo da NASA – Terra – acabou de completar 25 anos, e com cinco instrumentos operando continuamente a bordo (a maioria capturando imagens simultaneamente), o Terra acumulou MUITOS dados ao longo dos anos (mais de 9.000 dias e contando!). Estes dados têm o potencial de esclarecer tudo, desde processos científicos até eventos únicos, ajudando a resolver problemas que afetam os humanos. Seu desafio é usar dados de qualquer um ou todos os cinco instrumentos do Terra para criar um produto animado que mostre uma história de ciência da Terra e enfatize os impactos em você, sua comunidade e/ou o meio ambiente.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_9_Image.2e16d0ba.fill-300x250.jpg",
      alt: "NASA Space Apps 2025_Challenge 9"
    },
    categories: [
      { id: 1, name: "Iniciante/Jovem", slug: "beginneryouth", color: "#07173F" },
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Animação", "Artes & Multimídia", "Análise de Dados", "Gestão de Dados", "Visualização de Dados", "Ciências da Terra", "Flora & Fauna", "Satélites Artificiais", "Narrativa", "Videografia/Fotografia", "Clima"],
    slug: "animation-celebration-of-terra-data"
  },
  {
    id: "aWQ6MzEzMTI=",
    title: "Um Mundo Distante: Caçando Exoplanetas com IA",
    excerpt: "Dados de várias missões espaciais de pesquisa de exoplanetas permitiram a descoberta de milhares de novos planetas fora do nosso sistema solar, mas a maioria destes exoplanetas foi identificada manualmente. Com avanços em inteligência artificial e aprendizado de máquina (IA/ML), é possível analisar automaticamente grandes conjuntos de dados coletados por essas missões para identificar exoplanetas. Seu desafio é criar um modelo de IA/ML treinado em um ou mais dos conjuntos de dados de exoplanetas de código aberto oferecidos pela NASA e que possa analisar novos dados para identificar exoplanetas com precisão.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_2_Image.2e16d0ba.fill-300x250.jpg",
      alt: "Space Apps 2025__Challenge 2"
    },
    categories: [
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Inteligência Artificial & Aprendizado de Máquina", "Programação", "Análise de Dados", "Gestão de Dados", "Visualização de Dados", "Objetos Extrasolares", "Planetas & Luas", "Software", "Exploração Espacial"],
    slug: "a-world-away-hunting-for-exoplanets-with-ai"
  },
  {
    id: "aWQ6MzEzMjY=",
    title: "BloomWatch: Uma Aplicação de Observação da Terra para Fenologia Global de Floração",
    excerpt: "Testemunhe o pulso da vida em nosso planeta! De estação para estação e de ano para ano, a vegetação da Terra está constantemente mudando, fornecendo informações críticas sobre espécies de plantas, culturas, efeitos sazonais, fontes de pólen e mudanças na fenologia das plantas (a relação entre mudanças sazonais e fenômenos climáticos e biológicos nas plantas). Seu desafio é aproveitar o poder das observações terrestres da NASA para criar uma ferramenta visual dinâmica que exiba e/ou detecte eventos de floração de plantas ao redor do globo—assim como os polinizadores fazem—e que avance soluções para monitoramento, previsão ou gestão da vegetação.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_17_option_2.2e16d0ba.fill-300x250.jpg",
      alt: "NASA Space Apps 2025_Challenge 17"
    },
    categories: [
      { id: 1, name: "Iniciante/Jovem", slug: "beginneryouth", color: "#07173F" },
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Animação", "Artes & Multimídia", "Negócios & Economia", "Análise de Dados", "Visualização de Dados", "Ciências da Terra", "Flora & Fauna", "Previsão", "Realidade Virtual", "Redação & Comunicações"],
    slug: "bloomwatch-an-earth-observation-application-for-global-flowering-phenology"
  },
  {
    id: "aWQ6MzEzMTM=",
    title: "Construa um Motor de Conhecimento de Biologia Espacial",
    excerpt: "Permita uma nova era de exploração espacial humana! A NASA tem realizado experimentos de biologia no espaço há décadas, gerando uma quantidade tremenda de informações que precisarão ser consideradas conforme os humanos se preparam para revisitar a Lua e explorar Marte. Embora esse conhecimento esteja publicamente disponível, pode ser difícil para usuários potenciais encontrar informações que se relacionem aos seus interesses específicos. Seu desafio é construir um painel dinâmico que aproveite inteligência artificial (IA), grafos de conhecimento e/ou outras ferramentas para resumir um conjunto de publicações de biociências da NASA e permite aos usuários explorar os impactos e resultados dos experimentos que essas publicações descrevem.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_3_image_2.2e16d0ba.fill-300x250.jpg",
      alt: "Space Apps 2025__Challenge 3"
    },
    categories: [
      { id: 1, name: "Iniciante/Jovem", slug: "beginneryouth", color: "#07173F" },
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Inteligência Artificial & Aprendizado de Máquina", "Gestão de Dados", "Educação", "Flora & Fauna", "Software", "Redação & Comunicações"],
    slug: "build-a-space-biology-knowledge-engine"
  },
  {
    id: "aWQ6MzEzMjA=",
    title: "Comercializando a Órbita Terrestre Baixa (LEO)",
    excerpt: "À medida que a comercialização do espaço acelera rapidamente, o futuro dos negócios na órbita terrestre baixa (LEO) possui um potencial incrível, mas também apresenta desafios operacionais, regulamentares e ambientais significativos. Esta nova fronteira econômica convida abordagens inovadoras e sustentáveis para promover a viabilidade a longo prazo e a execução responsável. Seu desafio é conceitualizar e projetar um modelo de negócio escalável e sustentável, acompanhado por um protótipo, que explore as oportunidades únicas que a LEO oferece enquanto aborda as complexidades de operar no espaço.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_10_Image.2e16d0ba.fill-300x250.jpg",
      alt: "NASA Space Apps 2025_Challenge 10"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Negócios & Economia", "Design", "Órbita Terrestre", "Ergonomia & Fatores Humanos", "Habitats", "Hardware", "Satélites Artificiais"],
    slug: "commercializing-low-earth-orbit-leo"
  },
  {
    id: "aWQ6MzEzMzA=",
    title: "Crie Seu Próprio Desafio",
    excerpt: "Você tem uma ideia que não se encaixa exatamente em nenhum dos nossos desafios? Procurando experiência para iniciantes? Este é o seu momento de sonhar grande e Criar Seu Próprio Desafio! Seja criando um aplicativo, obra de arte, história, lição, ferramenta ou explorando uma forma inovadora de usar dados da NASA, você define o desafio. Observe que, embora alguns Eventos Locais possam oferecer prêmios para projetos 'Crie Seu Próprio Desafio', este desafio não é elegível para Avaliação Global, e os projetos não se qualificam para Prêmios Globais.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Astronaut_Woody_Hoburg_takes_an_ou.2e16d0ba.fill-300x250.jpg",
      alt: "Astronaut Woody Hoburg takes an out-of-this-world space-selfie"
    },
    categories: [
      { id: 1, name: "Iniciante/Jovem", slug: "beginneryouth", color: "#07173F" }
    ],
    skills: [],
    slug: "create-your-own-challenge"
  },
  {
    id: "aWQ6MzEzMTc=",
    title: "Caminhos de Dados para Cidades Saudáveis e Assentamentos Humanos",
    excerpt: "As mudanças climáticas trazem novas complexidades a considerar para manter o bem-estar da sociedade e do meio ambiente nas cidades. Recursos naturais, ecossistemas e infraestrutura existente devem ser monitorados para garantir que a qualidade de vida humana permaneça alta. Seu desafio é demonstrar como um planejador urbano pode usar dados de observação da Terra da NASA para desenvolver estratégias inteligentes para o crescimento da cidade que mantenham tanto o bem-estar das pessoas quanto do meio ambiente.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_7_Image_1.2e16d0ba.fill-300x250.jpg",
      alt: "NASA Space Apps 2025_Challenge 7"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Negócios & Economia", "Análise de Dados", "Design", "Ciências da Terra", "Ergonomia & Fatores Humanos", "Habitats", "Poluição", "Resíduos & Recursos"],
    slug: "data-pathways-to-healthy-cities-and-human-settlements"
  },
  {
    id: "aWQ6MzEzMjU=",
    title: "Mergulho Profundo: Histórias de Dados Imersivas do Oceano ao Céu",
    excerpt: "Observações de satélite revelam insights sobre nosso planeta natal dinâmico para cientistas, mas pessoas sem formação em sensoriamento remoto frequentemente acham difícil acessar as histórias dentro desses conjuntos de dados. A política de dados abertos da NASA torna essas observações disponíveis para todos—cientistas e não-cientistas. Seu desafio é construir uma experiência curta e imersiva de realidade virtual (VR) que aproveite os conjuntos de dados e visualizações de observação da Terra da NASA para dar vida às histórias sobre os oceanos do nosso planeta, conectando uma audiência ampla a esses dados, sua beleza e seu impacto. Usando visuais, áudio espacial e até elementos interativos, sua experiência VR pode permitir aos usuários mergulhar mais profundamente na história oceânica em desenvolvimento da Terra.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_16_option_3.2e16d0ba.fill-300x250.jpg",
      alt: "NASA Space Apps 2025_Challenge 16"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Animação", "Artes & Multimídia", "Análise de Dados", "Gestão de Dados", "Visualização de Dados", "Ciências da Terra", "Habitats", "Satélites", "Exploração Espacial", "Narrativa", "Realidade Virtual", "Redação & Comunicações"],
    slug: "deep-dive-immersive-data-stories-from-ocean-to-sky"
  },
  {
    id: "aWQ6MzEzMTQ=",
    title: "Aumente Seus Olhos!",
    excerpt: "Enquanto a tela do seu celular pode exibir cerca de três milhões de pixels de informação e seu olho pode receber mais de dez milhões de pixels, as imagens da NASA do espaço são ainda maiores! As missões espaciais da NASA continuam a expandir os limites do que é tecnologicamente possível, fornecendo imagens e vídeos de alta resolução da Terra, outros planetas e do espaço com bilhões ou até trilhões de pixels. Seu desafio é criar uma plataforma que permita aos usuários ampliar e reduzir nesses enormes conjuntos de dados de imagem, rotular características conhecidas e descobrir novos padrões.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_4_Image.2e16d0ba.fill-300x250.jpg",
      alt: "NASA Space Apps 2025_Challenge 4"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" }
    ],
    skills: ["Programação", "Análise de Dados", "Gestão de Dados", "Visualização de Dados", "Objetos Extrasolares", "Software", "Exploração Espacial", "Videografia/Fotografia", "Desenvolvimento Web"],
    slug: "embiggen-your-eyes"
  },
  {
    id: "aWQ6MzEzMjQ=",
    title: "De EarthData à Ação: Computação em Nuvem com Dados de Observação da Terra para Prever Céus Mais Limpos e Seguros",
    excerpt: "A missão TEMPO (Tropospheric Emissions: Monitoring of Pollution) da NASA está revolucionando o monitoramento da qualidade do ar na América do Norte, permitindo melhores previsões e reduzindo a exposição a poluentes. Seu desafio é desenvolver um aplicativo baseado na web que preveja a qualidade do ar integrando dados TEMPO em tempo real com medições de qualidade do ar baseadas em solo e dados meteorológicos, notificando usuários sobre má qualidade do ar e ajudando a melhorar decisões de saúde pública. As equipes são encorajadas a utilizar novas tecnologias que permitam escalonamento contínuo de computação de dispositivos locais para sistemas em nuvem, melhorando a colaboração e simplificando a eficiência do trabalho.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_15_Image.2e16d0ba.fill-300x250.png",
      alt: "NASA Space Apps 2025_Challenge 15"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Inteligência Artificial & Aprendizado de Máquina", "Negócios & Economia", "Análise de Dados", "Ciências da Terra", "Previsão", "Poluição", "Clima", "Desenvolvimento Web"],
    slug: "from-earthdata-to-action-cloud-computing-with-earth-observation-data-for-predicting-cleaner-safer-skies"
  },
  {
    id: "aWQ6MzEzMTY=",
    title: "Aplicativos do 25º Aniversário da Estação Espacial Internacional",
    excerpt: "As tripulações a bordo da Estação Espacial Internacional têm muitas oportunidades únicas! Elas testemunham vistas espetaculares da Terra da cúpula da estação—conhecida como 'a janela para o mundo'. Elas também experimentam a ausência de gravidade e saem da estação em caminhadas espaciais, para as quais devem treinar extensivamente no Laboratório de Flutuabilidade Neutra (NBL) no Sonny Carter Training Facility em Houston, Texas. Seu desafio é criar uma ferramenta visual que não apenas ajude estudantes e o público a entender duas das experiências sensoriais mais proeminentes na estação (visão e ausência de gravidade) através das lentes da cúpula e do NBL, mas também os informe como essas experiências únicas beneficiam os humanos na Terra.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_6_Iss_cupola.2e16d0ba.fill-300x250.jpg",
      alt: "NASA Space Apps 2025_Challenge 6"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Design", "Órbita Terrestre", "Educação", "Ergonomia & Fatores Humanos", "Jogos", "Design Gráfico", "Habitats", "Satélites Artificiais", "Exploração Espacial"],
    slug: "international-space-station-25th-anniversary-apps"
  },
  {
    id: "aWQ6MzEzMTE=",
    title: "Loucura de Meteoros",
    excerpt: "Um asteroide próximo à Terra recém-identificado, 'Impactor-2025', representa uma ameaça potencial à Terra, mas temos as ferramentas para permitir que o público e os tomadores de decisão entendam e mitiguem seus riscos? Os conjuntos de dados da NASA incluem informações sobre asteroides conhecidos e o United States Geological Survey fornece informações críticas que poderiam permitir modelar os efeitos de impactos de asteroides, mas esses dados precisam ser integrados para permitir visualização e tomada de decisão eficazes. Seu desafio é desenvolver uma ferramenta de visualização e simulação interativa que use dados reais para ajudar os usuários a modelar cenários de impacto de asteroides, prever consequências e avaliar estratégias de mitigação potenciais.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_1_Image.2e16d0ba.fill-300x250.jpg",
      alt: "Space Apps 2025_Challenge 1"
    },
    categories: [
      { id: 1, name: "Iniciante/Jovem", slug: "beginneryouth", color: "#07173F" },
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Astrofísica", "Programação", "Análise de Dados", "Visualização de Dados", "Resposta a Desastres", "Objetos Extrasolares", "Previsão", "Exploração Espacial", "Estatística"],
    slug: "meteor-madness"
  },
  {
    id: "aWQ6MzEzMjc=",
    title: "Navegadores da Fazenda NASA: Usando Exploração de Dados NASA na Agricultura",
    excerpt: "A comunidade agrícola enfrenta o desafio de integrar tecnologia e dados para melhorar práticas de agricultura sustentável. Simular atividades agrícolas chave como fertilização, irrigação e gestão de gado usando imagens de satélite da NASA do mundo real e dados climáticos pode permitir melhor compreensão dos impactos dessas variáveis na produção de culturas. Seu desafio é criar um jogo educacional envolvente que utilize efetivamente os conjuntos de dados abertos da NASA para simular cenários de agricultura e permite aos jogadores aprender como esses dados podem informar métodos agrícolas inovadores e sustentáveis.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_18_Image.2e16d0ba.fill-300x250.png",
      alt: "NASA Space Apps 2025_Challenge 18"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Agricultura", "Negócios & Economia", "Análise de Dados", "Visualização de Dados", "Ciências da Terra", "Educação", "Flora & Fauna", "Jogos", "Poluição", "Narrativa"],
    slug: "nasa-farm-navigators-using-nasa-data-exploration-in-agriculture"
  },
  {
    id: "aWQ6MzEzMjI=",
    title: "Tubarões do Espaço",
    excerpt: "O oceano da Terra é um dos habitats mais poderosos em nosso universo, sustentando uma gama de vida que mantém ecossistemas e habitabilidade em todo o globo. É comum medir a atividade fotossintética no oceano do espaço, mas muito mais desafiador rastrear predadores de topo. Seu desafio é criar uma estrutura matemática para identificar tubarões e prever seus habitats de forrageamento usando dados de satélite da NASA, e também sugerir um novo modelo conceitual de uma etiqueta (um pequeno dispositivo eletrônico que pode ser anexado a um animal para rastrear e estudar seu movimento) que possa medir não apenas onde os tubarões estão, mas o que eles estão comendo, e transmitir esses dados em tempo real de volta aos usuários para permitir o desenvolvimento de modelos preditivos.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_13_Image.2e16d0ba.fill-300x250.png",
      alt: "NASA Space Apps 2025_Challenge 13"
    },
    categories: [
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Animação", "Análise de Dados", "Visualização de Dados", "Design", "Ciências da Terra", "Flora & Fauna", "Previsão", "Hardware"],
    slug: "sharks-from-space"
  },
  {
    id: "aWQ6MzEzMTg=",
    title: "SpaceTrash Hack: Revolucionando a Reciclagem em Marte",
    excerpt: "Durante uma missão hipotética de três anos para Marte e volta, uma tripulação de oito pessoas acumularia 12.600 kg de resíduos inorgânicos, ou lixo, incluindo vários materiais de embalagem, têxteis e materiais estruturais. Este cenário cria uma necessidade premente de reciclar materiais disponíveis, em vez de executar os processos caros e ineficientes de transportar recursos adicionais da Terra e/ou enviar lixo de volta à Terra. Conforme os humanos se preparam para explorar mundos desconhecidos no futuro, seu desafio é projetar sistemas sustentáveis que poderiam gerenciar, reutilizar ou reciclar resíduos inorgânicos ('lixo') que são trazidos para e/ou acumulados na superfície de Marte.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_8_Image.2e16d0ba.fill-300x250.png",
      alt: "NASA Space Apps 2025_Challenge 8"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Design", "Ergonomia & Fatores Humanos", "Habitats", "Planetas & Luas", "Exploração Espacial", "Resíduos & Recursos"],
    slug: "spacetrash-hack-revolutionizing-recycling-on-mars"
  },
  {
    id: "aWQ6MzEzMjM=",
    title: "Histórias Estelares: Clima Espacial Através dos Olhos dos Terráqueos",
    excerpt: "Embora o Sol esteja a 150 milhões de quilômetros de distância do nosso planeta, a atividade solar pode impactar significativamente nossas vidas diárias. O 'clima espacial'—as variações que ocorrem no ambiente espacial entre o Sol e a Terra—pode impactar tecnologias no espaço e na Terra. Seu desafio é escrever e ilustrar uma história digital infantil que explique o que é o clima espacial e os impactos variados que tem em diferentes pessoas como agricultores, pilotos, astronautas, operadores de rede elétrica e o público geral. Você pode contar a história da perspectiva de uma pessoa impactada pelo clima espacial ou do ponto de vista de uma erupção solar ou ejeção de massa coronal (CME) conforme se aproxima da Terra.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_14_Image.2e16d0ba.fill-300x250.png",
      alt: "NASA Space Apps 2025_Challenge 14"
    },
    categories: [
      { id: 1, name: "Iniciante/Jovem", slug: "beginneryouth", color: "#07173F" },
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Animação", "Artes & Multimídia", "Resposta a Desastres", "Educação", "Clima Espacial", "Narrativa", "Sol", "Clima"],
    slug: "stellar-stories-space-weather-through-the-eyes-of-earthlings"
  },
  {
    id: "aWQ6MzEzMjE=",
    title: "Através do Espelho do Radar: Revelando Processos da Terra com SAR",
    excerpt: "Como Alice no País das Maravilhas, vamos viajar pela toca do coelho... para revelar um mundo que se parece com nosso planeta Terra... mas não exatamente! Usando radar de abertura sintética (SAR), podemos imagear o mundo emitindo pulsos de radar em direção à Terra e registrando a energia que é refletida de volta após os sinais interagirem com a superfície da Terra. Seu desafio é baixar dados SAR de múltiplas frequências ou múltiplas polarizações para uma área de estudo interessante de sua escolha—por exemplo, sua cidade natal, uma zona úmida tropical, manto de gelo, incêndio florestal, bairro inundado, erupção vulcânica, etc.—e usar esses dados para desenvolver hipóteses sobre os impulsores físicos operando lá.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_11_Image.2e16d0ba.fill-300x250.jpg",
      alt: "NASA Space Apps 2025_Challenge 11"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" },
      { id: 3, name: "Avançado", slug: "advanced", color: "#8B0A03" }
    ],
    skills: ["Animação", "Análise de Dados", "Visualização de Dados", "Ciências da Terra", "Satélites Artificiais", "Narrativa"],
    slug: "through-the-radar-looking-glass-revealing-earth-processes-with-sar"
  },
  {
    id: "aWQ6MzEzMjg=",
    title: "Vai Chover no Meu Desfile?",
    excerpt: "Se você está planejando um evento ao ar livre—como férias, ou uma caminhada em uma trilha, ou pesca em um lago—seria bom saber as chances de tempo adverso para o horário e local que você está considerando. Existem muitos tipos de dados de observação da Terra que podem fornecer informações sobre condições meteorológicas para um local e dia específicos do ano. Seu desafio é construir um aplicativo com uma interface personalizada que permite aos usuários conduzir uma consulta customizada para lhes dizer a probabilidade de condições 'muito quentes', 'muito frias', 'muito ventosas', 'muito molhadas' ou 'muito desconfortáveis' para o local e horário que especificam.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_19_Option_3.2e16d0ba.fill-300x250.jpg",
      alt: "NASA Space Apps 2025_Challenge 19"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" }
    ],
    skills: ["Programação", "Análise de Dados", "Visualização de Dados", "Previsão", "Software", "Clima", "Desenvolvimento Web"],
    slug: "will-it-rain-on-my-parade"
  },
  {
    id: "aWQ6MzEzMTU=",
    title: "Sua Casa no Espaço: O Criador de Layout de Habitat",
    excerpt: "Habitats espaciais são 'casas no espaço' que mantêm os membros da tripulação saudáveis e capazes de executar sua missão. Seja localizado em uma superfície planetária ou no espaço, os habitats devem suportar funções críticas como gestão de resíduos, controle térmico, suporte à vida, comunicações, energia, armazenamento, armazenamento e preparo de alimentos, cuidados médicos, sono e exercício. Conceitos de habitat espacial podem envolver uma variedade diversa de materiais, geometrias e layouts. Seu desafio é criar uma ferramenta visual que permita aos usuários definir a forma/volume de um habitat espacial e explorar possíveis opções de layout.",
    featuredImage: {
      url: "https://assets.spaceappschallenge.org/media/images/Challenge_5_Image.2e16d0ba.fill-300x250.png",
      alt: "NASA Space Apps 2025_Challenge 5"
    },
    categories: [
      { id: 2, name: "Intermediário", slug: "intermediate", color: "#FF580A" }
    ],
    skills: ["Design", "Órbita Terrestre", "Ergonomia & Fatores Humanos", "Jogos", "Design Gráfico", "Habitats", "Satélites Artificiais", "Exploração Espacial", "Resíduos & Recursos"],
    slug: "your-home-in-space-the-habitat-layout-creator"
  }
];