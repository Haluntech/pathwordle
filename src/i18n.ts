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
      tagline: "在网格中开辟一条逻辑之路。连接字母，跨越间隙，点亮每日路径。",
      playToday: "立即开始",
      startPlaying: "开始游戏",
      dailyChallenge: "每日挑战",
      wordsCompleted: "个单词已完成",
      gamesPlayed: "游戏场次",
      winRate: "胜率",
      currentStreak: "当前连胜",
      days: "天",
      howToPlay: "如何玩",
      howToPlaySubtitle: "4个简单步骤掌握网格",
      step1Title: "连接字母",
      step1Desc: "在6×6网格上点击相邻字母来构建路径。您可以水平、垂直或对角线连接。",
      step2Title: "组成单词",
      step2Desc: "创建一个拼写5字母单词的路径。字母必须按顺序连接。",
      step3Title: "提交并发现",
      step3Desc: "提交您的猜测并获得颜色编码的反馈。绿色=正确位置，黄色=错误位置。",
      step4Title: "掌握网格",
      step4Desc: "运用逻辑和策略在6次或更少的尝试中猜出隐藏的单词。祝你好运！",
      testimonials: "玩家评价",
      testimonialsSubtitle: "加入数千名单词拼图爱好者",
      features: "为什么选择PathWordle？",
      featuresSubtitle: "让我们与众不同的特色",
      readyToPlay: "准备开始？",
      readyToPlayDesc: "加入数千名已经在掌握网格的玩家。您的每日单词拼图冒险等待着你！",
      testimonial1Name: "陈莎拉",
      testimonial1Role: "单词游戏爱好者",
      testimonial1Content: "PathWordle太棒了！路径机制为策略增加了全新的层次。我现在每天都玩。",
      testimonial2Name: "马库斯·约翰逊",
      testimonial2Role: "拼图爱好者",
      testimonial2Content: "终于有一个真正具有挑战性的单词游戏了。所需的空间思维非常精彩！",
      testimonial3Name: "艾玛·威廉姆斯",
      testimonial3Role: "休闲玩家",
      testimonial3Content: "完美适合我早晨的咖啡时间。易学难精。喜欢每日挑战！",
      feature1Title: "策略玩法",
      feature1Desc: "路径机制为经典单词拼图增加了空间推理",
      feature2Title: "每日挑战",
      feature2Desc: "每天新的拼图。与全球朋友竞争",
      feature3Title: "智能提示",
      feature3Desc: "需要帮助时提供AI驱动的建议",
      feature4Title: "追踪进度",
      feature4Desc: "详细的统计数据和成就来追踪您的旅程",
      feature5Title: "深色模式",
      feature5Desc: "采用明暗主题的精美Material Design 3界面",
      feature6Title: "永久免费",
      feature6Desc: "无广告，无订阅。纯粹的拼图享受"
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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en.translation },
      zh: { translation: zh.translation }
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
