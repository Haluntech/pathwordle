import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    landing: {
      title: "PathWordle",
      tagline: "Forge a trail of logic through the grid. Connect letters, bridge gaps, and illuminate the daily path.",
      playToday: "PLAY TODAY",
      startPlaying: "Start Playing",
      dailyChallenge: "DAILY CHALLENGE",
      wordsCompleted: "words completed",
      gamesPlayed: "Games Played",
      winRate: "Win Rate",
      currentStreak: "Current Streak",
      days: "days",
      howToPlay: "How to Play",
      howToPlaySubtitle: "Master the grid in 4 simple steps",
      step1Title: "Connect Letters",
      step1Desc: "Click adjacent letters on the 6×6 grid to build your path. You can connect horizontally, vertically, or diagonally.",
      step2Title: "Form Your Word",
      step2Desc: "Create a path that spells a 5-letter word. The letters must be connected in sequence.",
      step3Title: "Submit & Discover",
      step3Desc: "Submit your guess and get color-coded feedback. Green = correct position, Yellow = wrong position.",
      step4Title: "Master the Grid",
      step4Desc: "Use logic and strategy to guess the hidden word in 6 attempts or less. Good luck!",
      testimonials: "What Players Say",
      testimonialsSubtitle: "Join thousands of word puzzle enthusiasts",
      features: "Why PathWordle?",
      featuresSubtitle: "Features that make us different",
      readyToPlay: "Ready to Play?",
      readyToPlayDesc: "Join thousands of players already mastering the grid. Your daily word puzzle adventure awaits!",
      testimonial1Name: "Sarah Chen",
      testimonial1Role: "Word Game Enthusiast",
      testimonial1Content: "PathWordle is amazing! The path mechanic adds a whole new layer of strategy. My new daily addiction.",
      testimonial2Name: "Marcus Johnson",
      testimonial2Role: "Puzzle Lover",
      testimonial2Content: "Finally a word game that actually challenges you. The spatial thinking required is brilliant!",
      testimonial3Name: "Emma Williams",
      testimonial3Role: "Casual Gamer",
      testimonial3Content: "Perfect for my morning coffee routine. Simple to learn, hard to master. Love the daily challenges!",
      feature1Title: "Strategic Gameplay",
      feature1Desc: "Path mechanics add spatial reasoning to classic word puzzles",
      feature2Title: "Daily Challenges",
      feature2Desc: "New puzzle every day. Compete with friends worldwide",
      feature3Title: "Smart Hints",
      feature3Desc: "AI-powered suggestions when you need a helping hand",
      feature4Title: "Track Progress",
      feature4Desc: "Detailed statistics and achievements to track your journey",
      feature5Title: "Dark Mode",
      feature5Desc: "Beautiful Material Design 3 interface with light/dark themes",
      feature6Title: "Forever Free",
      feature6Desc: "No ads, no subscriptions. Just pure puzzle enjoyment"
    },
    game: {
      title: "PathWordle",
      dailyChallenge: "Daily Challenge",
      attempts: "attempts",
      guessTheWord: "6 chances to guess today's word",
      practice: "Practice Mode",
      daily: "Daily Challenge"
    },
    footer: {
      copyright: "© 2026 PathWordle. Luminous Logic Engine.",
      privacy: "Privacy",
      terms: "Terms",
      about: "About",
      support: "Support"
    }
  }
};

// Chinese translations
const zh = {
  translation: {
    landing: {
      title: "PathWordle",
      tagline: "在网格中开辟一条逻辑之路。连接字母，架起桥梁，照亮每日之路。",
      playToday: "立即开始",
      startPlaying: "开始游戏",
      dailyChallenge: "每日挑战",
      wordsCompleted: "单词完成",
      gamesPlayed: "游戏次数",
      winRate: "胜率",
      currentStreak: "当前连胜",
      days: "天",
      howToPlay: "如何游玩",
      howToPlaySubtitle: "4个简单步骤掌握网格",
      step1Title: "连接字母",
      step1Desc: "点击6×6网格上相邻的字母来构建路径。您可以水平、垂直或对角线连接。",
      step2Title: "组成单词",
      step2Desc: "创建一个能拼出5个字母单词的路径。字母必须按顺序连接。",
      step3Title: "提交并发现",
      step3Desc: "提交您的猜测并获得颜色编码反馈。绿色=正确位置，黄色=错误位置。",
      step4Title: "掌握网格",
      step4Desc: "使用逻辑和策略在6次或更少的尝试中猜出隐藏的单词。祝您好运！",
      testimonials: "玩家评价",
      testimonialsSubtitle: "加入数千名单词谜题爱好者",
      features: "为什么选择PathWordle？",
      featuresSubtitle: "让我们与众不同的功能",
      readyToPlay: "准备好了吗？",
      readyToPlayDesc: "加入数千名已经掌握网格的玩家。您的每日单词谜题冒险在等待！",
      testimonial1Name: "陈莎拉",
      testimonial1Role: "单词游戏爱好者",
      testimonial1Content: "PathWordle太棒了！路径机制为策略增加了全新的层次。我现在的每日必修课。",
      testimonial2Name: "马库斯·约翰逊",
      testimonial2Role: "谜题爱好者",
      testimonial2Content: "终于有一个真正能挑战我的单词游戏了。所需的空间思维太精彩了！",
      testimonial3Name: "艾玛·威廉姆斯",
      testimonial3Role: "休闲玩家",
      testimonial3Content: "非常适合我的早晨咖啡时间。易学难精。我喜欢每日挑战！",
      feature1Title: "战略游戏",
      feature1Desc: "路径机制为经典单词谜题增加了空间推理",
      feature2Title: "每日挑战",
      feature2Desc: "每天新谜题。与全球朋友竞争",
      feature3Title: "智能提示",
      feature3Desc: "需要帮助时提供AI驱动的建议",
      feature4Title: "追踪进度",
      feature4Desc: "详细统计和成就来追踪您的旅程",
      feature5Title: "深色模式",
      feature5Desc: "具有明暗主题的精美Material Design 3界面",
      feature6Title: "永久免费",
      feature6Desc: "无广告，无订阅。纯粹的谜题享受"
    },
    game: {
      title: "PathWordle",
      dailyChallenge: "每日挑战",
      attempts: "次尝试",
      guessTheWord: "6次机会猜出今天的单词",
      practice: "练习模式",
      daily: "每日挑战"
    },
    footer: {
      copyright: "© 2026 PathWordle. Luminous Logic Engine.",
      privacy: "隐私",
      terms: "条款",
      about: "关于",
      support: "支持"
    }
  }
};

// Japanese translations
const ja = {
  translation: {
    landing: {
      title: "PathWordle",
      tagline: "グリッド上に論理の道を切り拓く。文字をつなぎ、架け橋を渡り、毎日の道を照らそう。",
      playToday: "今すぐプレイ",
      startPlaying: "ゲーム開始",
      dailyChallenge: "毎日チャレンジ",
      wordsCompleted: "語完了",
      gamesPlayed: "プレイ数",
      winRate: "勝率",
      currentStreak: "現在の連勝",
      days: "日",
      howToPlay: "遊び方",
      howToPlaySubtitle: "4つの簡単なステップでマスター",
      step1Title: "文字をつなぐ",
      step1Desc: "6×6グリッド上の隣接する文字をクリックしてパスを作成。水平、垂直、斜めにつなげます。",
      step2Title: "単語を作る",
      step2Desc: "5文字の単語を綴るパスを作成。文字は順番につなげる必要があります。",
      step3Title: "提出して発見",
      step3Desc: "推測を提出して色でフィードバックを受け取ります。緑＝正しい位置、黄＝間違った位置。",
      step4Title: "グリッドをマスター",
      step4Desc: "論理と戦略を使って6回以内に隠された単語を当ててよう。頑張って！",
      testimonials: "プレイヤーの声",
      testimonialsSubtitle: "何千人もの単語パズル愛好家に参加",
      features: "なぜPathWordle？",
      featuresSubtitle: "私たちを際立たせる機能",
      readyToPlay: "プレイ準備完了？",
      readyToPlayDesc: "すでにグリッドをマスターしている何千人ものプレイヤーに参加しよう。毎日の単語パズル冒険が待っています！",
      testimonial1Name: "佐藤 Sarah",
      testimonial1Role: "単語ゲーム愛好家",
      testimonial1Content: "PathWordleは素晴らしい！パスメカニクスが戦略に全く新しい層を加えています。私の新しい日課です。",
      testimonial2Name: "マーカス・ジョンソン",
      testimonial2Role: "パズル愛好家",
      testimonial2Content: "ついに本当に挑戦してくれる単語ゲームが出た。必要とされる空間思考は Brilliant！",
      testimonial3Name: "エマ・ウィリアムズ",
      testimonial3Role: "カジュアルゲーマー",
      testimonial3Content: "朝のコヒータイムに最適。学びやすく、習得が難しい。毎日のチャレンジが大好き！",
      feature1Title: "戦略的ゲームプレイ",
      feature1Desc: "パスメカニクスがクラシック単語パズルに空間推論を追加",
      feature2Title: "毎日チャレンジ",
      feature2Desc: "毎日新しいパズル。世界中の友達と競争",
      feature3Title: "スマートヒント",
      feature3Desc: "助けが必要なときのAI駆動提案",
      feature4Title: "進度の追跡",
      feature4Desc: "旅を追跡するための詳細な統計と実績",
      feature5Title: "ダークモード",
      feature5Desc: "明るい/暗いテーマを持つ美しいMaterial Design 3インターフェース",
      feature6Title: "永久無料",
      feature6Desc: "広告なし、サブスクリプションなし。純粋なパズルの楽しさ"
    },
    game: {
      title: "PathWordle",
      dailyChallenge: "毎日チャレンジ",
      attempts: "回の試行",
      guessTheWord: "今日の単語を当てる6回のチャンス",
      practice: "練習モード",
      daily: "毎日チャレンジ"
    },
    footer: {
      copyright: "© 2026 PathWordle. Luminous Logic Engine.",
      privacy: "プライバシー",
      terms: "利用規約",
      about: "について",
      support: "サポート"
    }
  }
};

// Spanish translations
const es = {
  translation: {
    landing: {
      title: "PathWordle",
      tagline: "Abre un camino de lógica a través de la cuadrícula. Conecta letras, salva huecos e ilumina el camino diario.",
      playToday: "JUGAR HOY",
      startPlaying: "Empezar a Jugar",
      dailyChallenge: "DESAFÍO DIARIO",
      wordsCompleted: "palabras completadas",
      gamesPlayed: "Partidas Jugadas",
      winRate: "Tasa de Victorias",
      currentStreak: "Racha Actual",
      days: "días",
      howToPlay: "Cómo Jugar",
      howToPlaySubtitle: "Domina la cuadrícula en 4 simples pasos",
      step1Title: "Conecta las Letras",
      step1Desc: "Haz clic en letras adyacentes en la cuadrícula de 6×6 para construir tu camino. Puedes conectar horizontal, vertical o diagonalmente.",
      step2Title: "Forma Tu Palabra",
      step2Desc: "Crea un camino que deletree una palabra de 5 letras. Las letras deben estar conectadas en secuencia.",
      step3Title: "Envía y Descubre",
      step3Desc: "Envía tu suposición y obtén comentarios codificados por colores. Verde = posición correcta, Amarillo = posición incorrecta.",
      step4Title: "Domina la Cuadrícula",
      step4Desc: "Usa lógica y estrategia para adivinar la palabra oculta en 6 intentos o menos. ¡Buena suerte!",
      testimonials: "Lo Que Dicen los Jugadores",
      testimonialsSubtitle: "Únete a miles de entusiastas de rompecabezas",
      features: "¿Por Qué PathWordle?",
      featuresSubtitle: "Características que nos diferencian",
      readyToPlay: "¿Listo Para Jugar?",
      readyToPlayDesc: "Únete a miles de jugadores que ya dominan la cuadrícula. ¡Tu aventura diaria de rompecabezas te espera!",
      testimonial1Name: "Sara Chen",
      testimonial1Role: "Entusiasta de Juegos de Palabras",
      testimonial1Content: "¡PathWordle es increíble! El mecánico de camino añade una capa completamente nueva de estrategia. Mi nueva adicción diaria.",
      testimonial2Name: "Marcus Johnson",
      testimonial2Role: "Amante de Rompecabezas",
      testimonial2Content: "Por fin un juego de palabras que realmente te desafía. El pensamiento espacial requerido es brillante.",
      testimonial3Name: "Emma Williams",
      testimonial3Role: "Jugadora Casual",
      testimonial3Content: "Perfecto para mi rutina de café matutino. Fácil de aprender, difícil de dominar. ¡Me encantan los desafíos diarios!",
      feature1Title: "Juego Estratégico",
      feature1Desc: "Los mecánicos de camino añaden razonamiento espacial a los rompecabezas clásicos",
      feature2Title: "Desafíos Diarios",
      feature2Desc: "Nuevo rompecabezas cada día. Compite con amigos de todo el mundo",
      feature3Title: "Sugerencias Inteligentes",
      feature3Desc: "Sugerencias impulsadas por IA cuando necesitas ayuda",
      feature4Title: "Rastrea el Progreso",
      feature4Desc: "Estadísticas detalladas y logros para rastrear tu viaje",
      feature5Title: "Modo Oscuro",
      feature5Desc: "Interfaz hermosa de Material Design 3 con temas claro/oscuro",
      feature6Title: "Gratis Para Siempre",
      feature6Desc: "Sin anuncios, sin suscripciones. Solo puro disfrute de rompecabezas"
    },
    game: {
      title: "PathWordle",
      dailyChallenge: "Desafío Diario",
      attempts: "intentos",
      guessTheWord: "6 oportunidades para adivinar la palabra de hoy",
      practice: "Modo Práctica",
      daily: "Desafío Diario"
    },
    footer: {
      copyright: "© 2026 PathWordle. Luminous Logic Engine.",
      privacy: "Privacidad",
      terms: "Términos",
      about: "Acerca De",
      support: "Soporte"
    }
  }
};

// French translations
const fr = {
  translation: {
    landing: {
      title: "PathWordle",
      tagline: "Frayer un chemin de logique à travers la grille. Connectez les lettres, comblez les lacunes et illuminez le chemin quotidien.",
      playToday: "JOUER MAINTENANT",
      startPlaying: "Commencer à Jouer",
      dailyChallenge: "DÉFI QUOTIDIEN",
      wordsCompleted: "mots complétés",
      gamesPlayed: "Parties Jouées",
      winRate: "Taux de Réussite",
      currentStreak: "Série Actuelle",
      days: "jours",
      howToPlay: "Comment Jouer",
      howToPlaySubtitle: "Maîtrisez la grille en 4 étapes simples",
      step1Title: "Connectez les Lettres",
      step1Desc: "Cliquez sur les lettres adjacentes sur la grille 6×6 pour construire votre chemin. Vous pouvez connecter horizontalement, verticalement ou en diagonale.",
      step2Title: "Formez Votre Mot",
      step2Desc: "Créez un chemin qui épelle un mot de 5 lettres. Les lettres doivent être connectées en séquence.",
      step3Title: "Soumettez et Découvrez",
      step3Desc: "Soumettez votre supposition et obtenez un retour codé par couleur. Vert = bonne position, Jaune = mauvaise position.",
      step4Title: "Maîtrisez la Grille",
      step4Desc: "Utilisez la logique et la stratégie pour deviner le mot caché en 6 tentatives ou moins. Bonne chance!",
      testimonials: "Ce Que Disent les Joueurs",
      testimonialsSubtitle: "Rejoignez des milliers de passionnés de puzzles de mots",
      features: "Pourquoi PathWordle?",
      featuresSubtitle: "Fonctionnalités qui nous différencient",
      readyToPlay: "Prêt à Jouer?",
      readyToPlayDesc: "Rejoignez des milliers de joueurs maîtrisant déjà la grille. Votre aventure quotidienne de puzzles de mots vous attend!",
      testimonial1Name: "Sarah Chen",
      testimonial1Role: "Passionnée de Jeux de Mots",
      testimonial1Content: "PathWordle est incroyable! Le mécanisme de chemin ajoute une toute nouvelle couche de stratégie. Ma nouvelle addiction quotidienne.",
      testimonial2Name: "Marcus Johnson",
      testimonial2Role: "Amateur de Puzzles",
      testimonial2Content: "Enfin un jeu de mots qui vous défie réellement. La pensée spatiale requise est brillante!",
      testimonial3Name: "Emma Williams",
      testimonial3Role: "Joueuse Occasionnelle",
      testimonial3Content: "Parfait pour ma routine de café du matin. Simple à apprendre, difficile à maîtriser. J'adore les défis quotidiens!",
      feature1Title: "Jeu Stratégique",
      feature1Desc: "Les mécanismes de chemin ajoutent un raisonnement spatial aux puzzles de mots classiques",
      feature2Title: "Défis Quotidiens",
      feature2Desc: "Nouveau puzzle chaque jour. Compétissez avec des amis du monde entier",
      feature3Title: "Suggestions Intelligentes",
      feature3Desc: "Suggestions alimentées par l'IA quand vous avez besoin d'aide",
      feature4Title: "Suivre les Progrès",
      feature4Desc: "Statistiques détaillées et réalisations pour suivre votre parcours",
      feature5Title: "Mode Sombre",
      feature5Desc: "Interface magnifique Material Design 3 avec thèmes clair/sombre",
      feature6Title: "Gratuit Pour Toujours",
      feature6Desc: "Pas de pub, pas d'abonnements. Juste du pur plaisir de puzzle"
    },
    game: {
      title: "PathWordle",
      dailyChallenge: "Défi Quotidien",
      attempts: "tentatives",
      guessTheWord: "6 chances pour deviner le mot d'aujourd'hui",
      practice: "Mode Pratique",
      daily: "Défi Quotidien"
    },
    footer: {
      copyright: "© 2026 PathWordle. Luminous Logic Engine.",
      privacy: "Confidentialité",
      terms: "Conditions",
      about: "À Propos",
      support: "Support"
    }
  }
};

// German translations
const de = {
  translation: {
    landing: {
      title: "PathWordle",
      tagline: "Bahnen Sie einen Pfad der Logik durch das Raster. Verbinden Sie Buchstaben, überbrücken Sie Lücken und erhellen Sie den täglichen Pfad.",
      playToday: "HEUTE SPIELEN",
      startPlaying: "Spiel Beginnen",
      dailyChallenge: "TÄGLICHE HERAUSFORDERUNG",
      wordsCompleted: "Wörter abgeschlossen",
      gamesPlayed: "Spiele Gespielt",
      winRate: "Gewinnrate",
      currentStreak: "Aktuelle Serie",
      days: "Tage",
      howToPlay: "Wie Man Spielt",
      howToPlaySubtitle: "Meistern Sie das Raster in 4 einfachen Schritten",
      step1Title: "Buchstaben Verbinden",
      step1Desc: "Klicken Sie auf angrenzende Buchstaben im 6×6-Raster, um Ihren Pfad zu bauen. Sie können horizontal, vertikal oder diagonal verbinden.",
      step2Title: "Bilden Sie Ihr Wort",
      step2Desc: "Erstellen Sie einen Pfad, der ein 5-Buchstaben-Wort buchstabiert. Die Buchstaben müssen in Folge verbunden sein.",
      step3Title: "Einreichen & Entdecken",
      step3Desc: "Reichen Sie Ihre Vermutung ein und erhalten Sie farbcodiertes Feedback. Grün = richtige Position, Gelb = falsche Position.",
      step4Title: "Meistern Sie Das Raster",
      step4Desc: "Nutzen Sie Logik und Strategie, um das versteckte Wort in 6 Versuchen oder weniger zu erraten. Viel Glück!",
      testimonials: "Was Spieler Sagen",
      testimonialsSubtitle: "Schließen Sie sich Tausenden von Worträtsel-Enthusiasten an",
      features: "Warum PathWordle?",
      featuresSubtitle: "Funktionen, die uns unterschiedlich machen",
      readyToPlay: "Bereit Zum Spielen?",
      readyToPlayDesc: "Schließen Sie sich Tausenden von Spielern an, die das Raster bereits meistern. Ihr tägliches Worträtsel-Abenteuer wartet!",
      testimonial1Name: "Sarah Chen",
      testimonial1Role: "Wortspiel-Enthusiastin",
      testimonial1Content: "PathWordle ist erstaunlich! Der Pfad-Mechanismus fügt eine völlig neue Strategieebene hinzu. Meine neue tägliche Sucht.",
      testimonial2Name: "Marcus Johnson",
      testimonial2Role: "Rätsel-Liebhaber",
      testimonial2Content: "Endlich ein Wortspiel, das wirklich herausfordert. Das erforderliche räumliche Denken ist brillant!",
      testimonial3Name: "Emma Williams",
      testimonial3Role: "Gelegenheitsspielerin",
      testimonial3Content: "Perfekt für meine morgendliche Kaffeepause. Einfach zu lernen, schwer zu meistern. Liebe die täglichen Herausforderungen!",
      feature1Title: "Strategisches Gameplay",
      feature1Desc: "Pfad-Mechaniken fügen räumliches Denken zu klassischen Worträtseln hinzu",
      feature2Title: "Tägliche Herausforderungen",
      feature2Desc: "Jeden Tag ein neues Rätsel. Konkurrieren Sie mit Freunden weltweit",
      feature3Title: "Smarte Hinweise",
      feature3Desc: "KI-gestützte Vorschläge, wenn Sie Hilfe brauchen",
      feature4Title: "Fortschritt Verfolgen",
      feature4Desc: "Detaillierte Statistiken und Erfolge zur Verfolgung Ihrer Reise",
      feature5Title: "Dunkler Modus",
      feature5Desc: "Wunderschöne Material Design 3-Oberfläche mit hellen/dunklen Themen",
      feature6Title: "Für Immer Kostenlos",
      feature6Desc: "Keine Werbung, keine Abonnements. Nur reiner Rätsel-Spaß"
    },
    game: {
      title: "PathWordle",
      dailyChallenge: "Tägliche Herausforderung",
      attempts: "Versuche",
      guessTheWord: "6 Chancen, das heutige Wort zu erraten",
      practice: "Praxis-Modus",
      daily: "Tägliche Herausforderung"
    },
    footer: {
      copyright: "© 2026 PathWordle. Luminous Logic Engine.",
      privacy: "Datenschutz",
      terms: "Nutzungsbedingungen",
      about: "Über Uns",
      support: "Support"
    }
  }
};

// Korean translations
const ko = {
  translation: {
    landing: {
      title: "PathWordle",
      tagline: "그리드를 통해 논리의 길을 여세요. 문자를 연결하고, 격차를 메우며, 매일의 경로를 밝히세요.",
      playToday: "지금 시작",
      startPlaying: "게임 시작",
      dailyChallenge: "일일 챌린지",
      wordsCompleted: "단어 완료",
      gamesPlayed: "플레이 횟수",
      winRate: "승률",
      currentStreak: "현재 연승",
      days: "일",
      howToPlay: "플레이 방법",
      howToPlaySubtitle: "4가지 간단한 단계로 마스터하세요",
      step1Title: "문자 연결",
      step1Desc: "6×6 그리드에서 인접한 문자를 클릭하여 경로를 만드세요. 수평, 수직 또는 대각선으로 연결할 수 있습니다.",
      step2Title: "단어 만들기",
      step2Desc: "5글자 단어를 철자하는 경로를 만드세요. 문자는 순서대로 연결되어야 합니다.",
      step3Title: "제출 및 발견",
      step3Desc: "추측을 제출하고 색상으로 코딩된 피드백을 받으세요. 녹색 = 올바른 위치, 노란색 = 잘못된 위치.",
      step4Title: "그리드 마스터",
      step4Desc: "논리와 전략을 사용하여 번 이하의 시도에서 숨겨진 단어를 맞추세요. 행운을 빕니다!",
      testimonials: "플레이어들의 의견",
      testimonialsSubtitle: "수천 명의 단어 퍼즐 애호가가들과 함께하세요",
      features: "왜 PathWordle인가요?",
      featuresSubtitle: "우리를 독특하게 만드는 기능",
      readyToPlay: "플레이 준비되셨나요?",
      readyToPlayDesc: "이미 그리드를 마스터한 수천 명의 플레이어와 함께하세요. 매일 단어 퍼즐 모험이 기다리고 있습니다!",
      testimonial1Name: "사라 첸",
      testimonial1Role: "단어 게임 애호가",
      testimonial1Content: "PathWordle은 정말 놀랍습니다! 경로 메카닉이 전략에 완전히 새로운 차원을 추가합니다. 제 새로운 일상 루틴.",
      testimonial2Name: "마커스 존슨",
      testimonial2Role: "퍼즐 애호가",
      testimonial2Content: "드디어 정말로 도전하는 단어 게임이 나왔습니다. 필요한 공간적 사고는 훌륭합니다!",
      testimonial3Name: "엠마 윌리엄스",
      testimonial3Role: "캐주얼 게이머",
      testimonial3Content: "아침 커피 루틴에 완벽합니다. 배우기 쉽고 마스터하기 어렵습니다. 일일 챌린지를 사랑합니다!",
      feature1Title: "전략적 게임플레이",
      feature1Desc: "경로 메카닉이 클래식 단어 퍼즐에 공간적 추론을 추가",
      feature2Title: "일일 챌린지",
      feature2Desc: "매일 새로운 퍼즐. 전 세계 친구들과 경쟁",
      feature3Title: "스마트 힌트",
      feature3Desc: "도움이 필요할 때 AI 기반 제안",
      feature4Title: "진행률 추적",
      feature4Desc: "여정을 추적하는 상세한 통계 및 성취",
      feature5Title: "다크 모드",
      feature5Desc: "밝은/어두운 테마가 있는 아름다운 Material Design 3 인터페이스",
      feature6Title: "영구 무료",
      feature6Desc: "광고 없음, 구독 없음. 순수한 퍼즐 즐거움"
    },
    game: {
      title: "PathWordle",
      dailyChallenge: "일일 챌린지",
      attempts: "시도",
      guessTheWord: "오늘의 단어를 맞출 6번의 기회",
      practice: "연습 모드",
      daily: "일일 챌린지"
    },
    footer: {
      copyright: "© 2026 PathWordle. Luminous Logic Engine.",
      privacy: "개인정보",
      terms: "약관",
      about: "소개",
      support: "지원"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en.translation },
      zh: { translation: zh.translation },
      ja: { translation: ja.translation },
      es: { translation: es.translation },
      fr: { translation: fr.translation },
      de: { translation: de.translation },
      ko: { translation: ko.translation }
    },
    fallbackLng: 'en',
    lng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
