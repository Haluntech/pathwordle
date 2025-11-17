import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'zh' | 'es' | 'fr' | 'de' | 'ja' | 'ko';

export interface Translation {
  [key: string]: string | Translation;
}

export const translations: Record<Language, Translation> = {
  en: {
    // Game Interface
    game: {
      title: 'PathWordle',
      subtitle: 'Find the path to the word',
      guess: 'Guess',
      clear: 'Clear',
      submit: 'Submit',
      reset: 'Reset',
      playAgain: 'Play Again',
      share: 'Share',
      score: 'Score',
      time: 'Time',
      attempts: 'Attempts',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      expert: 'Expert',
      daily: 'Daily',
      practice: 'Practice',
    },

    // Navigation
    nav: {
      statistics: 'Statistics',
      hints: 'Hints',
      leaderboard: 'Leaderboard',
      friends: 'Friends',
      multiplayer: 'Multiplayer',
      themes: 'Themes',
      timeChallenge: 'Time Challenge',
      themedPuzzles: 'Themed Puzzles',
      createPuzzle: 'Create Puzzle',
      learningDashboard: 'Learning Dashboard',
    },

    // Game Results
    result: {
      congratulations: 'Congratulations!',
      youWon: 'You Won!',
      betterLuck: 'Better luck next time!',
      wordRevealed: 'The word was',
      attemptsUsed: 'Attempts used',
      timeSpent: 'Time spent',
      score: 'Score',
      accuracy: 'Accuracy',
      bestStreak: 'Best streak',
      achievements: 'Achievements',
      shareResult: 'Share Result',
      playAgain: 'Play Again',
      viewStats: 'View Statistics',
      newGame: 'New Game',
    },

    // Statistics
    stats: {
      title: 'Game Statistics',
      played: 'Played',
      won: 'Won',
      winRate: 'Win Rate',
      currentStreak: 'Current Streak',
      maxStreak: 'Max Streak',
      averageGuesses: 'Average Guesses',
      totalTime: 'Total Time',
      averageTime: 'Average Time',
      bestTime: 'Best Time',
      difficulty: 'Difficulty',
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      allTime: 'All Time',
      distribution: 'Guess Distribution',
      achievements: 'Achievements',
      unlocked: 'Unlocked',
      progress: 'Progress',
    },

    // Hints
    hints: {
      title: 'Game Hints',
      noHints: 'No hints available',
      unlockHint: 'Unlock Hint',
      cost: 'Points',
      notEnoughPoints: 'Not enough points',
      hintTypes: {
        definition: 'Definition',
        synonym: 'Synonym',
        antonym: 'Antonym',
        etymology: 'Etymology',
        usage: 'Usage Example',
        funFact: 'Fun Fact'
      },
      pointBalance: 'Point Balance',
      earnPoints: 'Earn points by solving puzzles or completing challenges',
    },

    // Time Challenge
    timeChallenge: {
      title: 'Time Challenge',
      subtitle: 'Race against the clock!',
      mode: {
        daily: 'Daily Challenge',
        weekly: 'Weekly Challenge',
        speed: 'Speed Run',
        marathon: 'Marathon',
      },
      start: 'Start Challenge',
      pause: 'Pause',
      resume: 'Resume',
      quit: 'Quit',
      timeRemaining: 'Time Remaining',
      wordsFound: 'Words Found',
      targetWords: 'Target Words',
      score: 'Score',
      accuracy: 'Accuracy',
      combo: 'Combo',
      bestCombo: 'Best Combo',
      gameOver: 'Time\'s Up!',
      challengeComplete: 'Challenge Complete!',
      newRecord: 'New Record!',
      leaderboard: 'Leaderboard',
      viewLeaderboard: 'View Leaderboard',
    },

    // Themed Puzzles
    themedPuzzles: {
      title: 'Themed Puzzles',
      subtitle: 'Explore puzzles by category',
      categories: {
        technology: 'Technology',
        science: 'Science',
        nature: 'Nature',
        culture: 'Culture',
        history: 'History',
        geography: 'Geography',
        literature: 'Literature',
        food: 'Food',
        sports: 'Sports',
        music: 'Music',
      },
      difficulty: 'Difficulty',
      length: 'Word Length',
      plays: 'Plays',
      rating: 'Rating',
      play: 'Play',
      back: 'Back',
      noPuzzles: 'No puzzles available in this category',
      loadMore: 'Load More',
    },

    // Puzzle Creator
    puzzleCreator: {
      title: 'Puzzle Creator',
      subtitle: 'Create your own PathWordle puzzle',
      steps: {
        basicInfo: 'Basic Info',
        wordSelection: 'Word',
        pathDesign: 'Path',
        hintCreation: 'Hints',
        themeCustomization: 'Theme',
        testing: 'Test',
        publishing: 'Publish',
      },
      basicInfo: {
        title: 'Puzzle Title',
        description: 'Describe your puzzle concept',
        estimatedTime: 'Estimated Time (minutes)',
      },
      wordSelection: {
        targetWord: 'Target Word',
        validate: 'Validate',
        validWord: 'Valid Word',
        invalidWord: 'Invalid Word',
        commonWord: 'Common Word',
        difficulty: 'Difficulty',
        definition: 'Definition',
      },
      pathDesign: {
        title: 'Path Designer',
        createPath: 'Create a path that spells',
        clickCells: 'Click cells to add/remove them',
        undo: 'Undo',
        clear: 'Clear',
        validationErrors: 'Validation Errors',
        warnings: 'Warnings',
        suggestions: 'Suggestions',
        pathValid: 'Path is valid!',
      },
      hintCreation: {
        title: 'Create Hints',
        hintText: 'Enter the hint content',
        cost: 'Points Cost',
        freeHint: 'Free hint',
        addHint: 'Add Hint',
        currentHints: 'Current Hints',
        guidelines: 'Hint Guidelines',
        guidelinesText: 'Provide 2-4 hints for balanced difficulty',
      },
      theme: {
        category: 'Category',
        tags: 'Tags',
        addTag: 'Add Tag',
        suggestions: 'Suggested tags',
        puzzleTheme: 'Puzzle Theme',
      },
      testing: {
        title: 'Test Your Puzzle',
        subtitle: 'Run automated tests to check puzzle quality',
        runTests: 'Run Tests',
        testing: 'Testing...',
        overallScore: 'Overall Score',
        avgTime: 'Avg. Time',
        successRate: 'Success Rate',
        feedback: 'Test Feedback',
        recommendations: 'Recommendations',
      },
      publishing: {
        title: 'Ready to Publish!',
        subtitle: 'Choose how you want to share your puzzle',
        publishingMode: 'Publishing Mode',
        private: 'Private',
        public: 'Public',
        privateDesc: 'Only you can play this puzzle',
        publicDesc: 'Share with the community (requires approval)',
        publish: 'Publish',
        publishing: 'Publishing...',
        publicPublishing: 'Public Publishing',
        moderationWarning: 'Your puzzle will be submitted for moderation review. This process typically takes 24-48 hours.',
      },
      autoSave: 'Auto-save',
      saved: 'Saved',
      templates: 'Templates',
      settings: 'Settings',
      progress: 'Progress',
    },

    // Leaderboard
    leaderboard: {
      title: 'Global Leaderboard',
      subtitle: 'Top players worldwide',
      global: 'Global',
      friends: 'Friends',
      country: 'Country',
      daily: 'Daily',
      weekly: 'Weekly',
      allTime: 'All Time',
      rank: 'Rank',
      player: 'Player',
      score: 'Score',
      accuracy: 'Accuracy',
      time: 'Time',
      countryRanking: 'Country Ranking',
      autoUpdate: 'Leaderboard updates automatically every minute',
      lastUpdate: 'Last updated',
    },

    // Friends
    friends: {
      title: 'Friends',
      subtitle: 'Connect and compete with friends',
      addFriend: 'Add Friend',
      searchFriends: 'Search friends',
      friendRequests: 'Friend Requests',
      onlineFriends: 'Online Friends',
      allFriends: 'All Friends',
      pending: 'Pending',
      accept: 'Accept',
      reject: 'Reject',
      invite: 'Invite to Game',
      profile: 'View Profile',
      stats: 'View Stats',
      sendMessage: 'Send Message',
      block: 'Block',
      unblock: 'Unblock',
    },

    // Multiplayer
    multiplayer: {
      title: 'Multiplayer Battles',
      subtitle: 'Challenge other players in real-time',
      findOpponent: 'Find Opponent',
      inviteFriend: 'Invite Friend',
      createRoom: 'Create Room',
      joinRoom: 'Join Room',
      roomCode: 'Room Code',
      waitingForPlayer: 'Waiting for player...',
      opponentFound: 'Opponent found!',
      startBattle: 'Start Battle',
      yourTurn: 'Your Turn',
      opponentTurn: 'Opponent Turn',
      youWon: 'You Won!',
      opponentWon: 'Opponent Won!',
      draw: 'Draw!',
      rematch: 'Rematch',
      newOpponent: 'New Opponent',
      roomName: 'Room Name',
      maxPlayers: 'Max Players',
      gameMode: 'Game Mode',
      settings: 'Settings',
    },

    // Learning Dashboard
    learning: {
      title: 'Learning Dashboard',
      subtitle: 'Track your learning progress and insights',
      progress: 'Progress',
      insights: 'Insights',
      recommendations: 'Recommendations',
      skillAreas: 'Skill Areas',
      vocabulary: 'Vocabulary',
      patternRecognition: 'Pattern Recognition',
      logicalReasoning: 'Logical Reasoning',
      problemSolving: 'Problem Solving',
      performanceMetrics: 'Performance Metrics',
      recentActivity: 'Recent Activity',
      strengths: 'Strengths',
      improvements: 'Areas for Improvement',
      timeSpent: 'Time Spent',
      puzzlesSolved: 'Puzzles Solved',
      averageAccuracy: 'Average Accuracy',
      learningRate: 'Learning Rate',
      masteryLevel: 'Mastery Level',
    },

    // Theme Selector
    themes: {
      title: 'Theme Settings',
      subtitle: 'Customize your game appearance',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      autoMode: 'Auto Mode',
      colorblindMode: 'Colorblind Mode',
      colorblindFriendly: 'Colorblind Friendly',
      highContrast: 'High Contrast',
      fontSize: 'Font Size',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      animations: 'Animations',
      soundEffects: 'Sound Effects',
      vibration: 'Vibration',
      language: 'Language',
    },

    // Notifications
    notifications: {
      title: 'Notification Settings',
      sections: {
        general: 'General',
        generalDesc: 'Basic notification settings',
        categories: 'Categories',
        categoriesDesc: 'Choose which notifications to receive',
        quietHours: 'Quiet Hours',
        quietHoursDesc: 'Set times when notifications are muted',
        device: 'Device Settings',
        deviceDesc: 'Configure how notifications appear on your device',
        frequency: 'Frequency',
        frequencyDesc: 'Control how often you receive notifications',
        statistics: 'Statistics',
        statisticsDesc: 'View your notification activity'
      },
      demo: 'Demo',
      demoDesc: 'Test notification features with interactive demo',
      permissionRequired: 'Permission Required',
      permissionDesc: 'Enable notifications to run the demo',
      demoTitle: 'Notification Demo',
      demoDescription: 'Test all notification types with an interactive demo',
      running: 'Demo Running',
      start: 'Start Demo',
      reset: 'Reset',
      info: 'The demo will send 7 different notification types with 3-second intervals.',
      individualTests: 'Individual Tests',
      instructions: 'How it works',
      step1: 'Click "Start Demo" to begin the notification sequence',
      step2: 'Each notification will appear with a 3-second delay',
      step3: 'You can click on notifications to interact with them',
      step4: 'Test individual notifications using the buttons below',
      step5: 'Check the Statistics section to see engagement metrics',
      permission: {
        granted: 'Enabled',
        denied: 'Blocked',
        prompt: 'Not Set'
      },
      notSupported: 'Notifications Not Supported',
      notSupportedDesc: 'Your browser does not support push notifications',
      enable: 'Enable',
      subscribed: 'Subscribed',
      subscribe: 'Subscribe',
      enableAll: 'Enable All Notifications',
      enableAllDesc: 'Turn all notifications on or off',
      generalSettings: 'General Settings',
      quietHours: {
        title: 'Quiet Hours',
        description: 'Temporarily silence notifications during specific times',
        startTime: 'Start Time',
        endTime: 'End Time',
        allowUrgent: 'Allow urgent notifications',
        allowUrgentDesc: 'Still show important notifications'
      },
      device: {
        sound: 'Sound',
        soundDesc: 'Play sound for notifications',
        vibration: 'Vibration',
        vibrationDesc: 'Vibrate for notifications',
        badge: 'Badge',
        badgeDesc: 'Show badge on app icon',
        alert: 'Alert',
        alertDesc: 'Show alert dialogs',
        banner: 'Banner',
        bannerDesc: 'Show banner notifications',
        lockScreen: 'Lock Screen',
        lockScreenDesc: 'Show on lock screen'
      },
      frequency: {
        limits: 'Frequency Limits',
        maxPerDay: 'Maximum per day',
        maxPerHour: 'Maximum per hour',
        smartScheduling: 'Smart Scheduling',
        smartSchedulingDesc: 'Optimize notification timing based on your activity'
      },
      stats: {
        overview: 'Overview',
        sent: 'Sent',
        clicked: 'Clicked',
        dismissed: 'Dismissed',
        conversion: 'Conversion'
      },
      noStats: 'No notification statistics available yet',
      categories: {
        dailyChallenge: 'Daily Challenges',
        dailyChallengeDesc: 'Reminders for daily puzzles and challenges',
        achievements: 'Achievements',
        achievementsDesc: 'When you unlock new achievements',
        friendActivity: 'Friend Activity',
        friendActivityDesc: 'Friend challenges, invites, and updates',
        leaderboards: 'Leaderboards',
        leaderboardsDesc: 'Leaderboard updates and rank changes',
        puzzleRecommendations: 'Puzzle Recommendations',
        puzzleRecommendationsDesc: 'Personalized puzzle suggestions',
        socialFeatures: 'Social Features',
        socialFeaturesDesc: 'Comments, likes, and social interactions',
        updates: 'Updates',
        updatesDesc: 'App updates and feature announcements',
        reminders: 'Reminders',
        remindersDesc: 'Game reminders and notifications',
        promotions: 'Promotions',
        promotionsDesc: 'Special offers and promotions'
      }
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      tryAgain: 'Try Again',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      finish: 'Finish',
      start: 'Start',
      stop: 'Stop',
      play: 'Play',
      pause: 'Pause',
      resume: 'Resume',
      quit: 'Quit',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      done: 'Done',
      settings: 'Settings',
      help: 'Help',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms of Service',
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up',
      profile: 'Profile',
      account: 'Account',
      preferences: 'Preferences',
      notifications: 'Notifications',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      ascending: 'Ascending',
      descending: 'Descending',
      all: 'All',
      none: 'None',
      select: 'Select',
      clear: 'Clear',
      refresh: 'Refresh',
      update: 'Update',
      download: 'Download',
      upload: 'Upload',
      share: 'Share',
      copy: 'Copy',
      paste: 'Paste',
      cut: 'Cut',
      undo: 'Undo',
      redo: 'Redo',
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      link: 'Link',
      image: 'Image',
      video: 'Video',
      audio: 'Audio',
      file: 'File',
      folder: 'Folder',
      new: 'New',
      open: 'Open',
      recent: 'Recent',
      favorites: 'Favorites',
      bookmark: 'Bookmark',
      archive: 'Archive',
      remove: 'Delete',
      restore: 'Restore',
      empty: 'Empty',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      thisWeek: 'This Week',
      lastWeek: 'Last Week',
      nextWeek: 'Next Week',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      nextMonth: 'Next Month',
      thisYear: 'This Year',
      lastYear: 'Last Year',
      nextYear: 'Next Year',
      minute: 'minute',
      minutes: 'minutes',
      hour: 'hour',
      hours: 'hours',
      day: 'day',
      days: 'days',
      week: 'week',
      weeks: 'weeks',
      month: 'month',
      months: 'months',
      year: 'year',
      years: 'years',
      ago: 'ago',
      fromNow: 'from now',
      in: 'in',
      at: 'at',
      on: 'on',
      until: 'until',
      since: 'since',
      per: 'per',
      vs: 'vs',
      and: 'and',
      or: 'or',
      but: 'but',
      not: 'not',
      only: 'only',
      also: 'also',
      even: 'even',
      still: 'still',
      already: 'already',
      yet: 'yet',
      never: 'never',
      always: 'always',
      sometimes: 'sometimes',
      often: 'often',
      rarely: 'rarely',
      usually: 'usually',
      generally: 'generally',
      specifically: 'specifically',
      especially: 'especially',
      particularly: 'particularly',
      mainly: 'mainly',
      mostly: 'mostly',
      completely: 'completely',
      totally: 'totally',
      absolutely: 'absolutely',
      definitely: 'definitely',
      certainly: 'certainly',
      possibly: 'possibly',
      probably: 'probably',
      maybe: 'maybe',
      perhaps: 'perhaps',
      apparently: 'apparently',
      obviously: 'obviously',
      clearly: 'clearly',
      naturally: 'naturally',
      fortunately: 'fortunately',
      unfortunately: 'unfortunately',
      surprisingly: 'surprisingly',
      interestingly: 'interestingly',
      importantly: 'importantly',
      essentially: 'essentially',
      basically: 'basically',
      actually: 'actually',
      really: 'really',
      very: 'very',
      quite: 'quite',
      pretty: 'pretty',
      rather: 'rather',
      fairly: 'fairly',
      slightly: 'slightly',
      barely: 'barely',
      hardly: 'hardly',
      almost: 'almost',
      nearly: 'nearly',
      approximately: 'approximately',
      roughly: 'roughly',
      approximatelyMore: 'about',
      around: 'around',
      exactly: 'exactly',
      precisely: 'precisely',
      just: 'just',
      solely: 'only',
      simply: 'simply',
      merely: 'merely',
      additionally: 'also',
      too: 'too',
      as: 'as',
      like: 'like',
      such: 'such',
      for: 'for',
      with: 'with',
      without: 'without',
      through: 'through',
      during: 'during',
      before: 'before',
      after: 'after',
      between: 'between',
      among: 'among',
      within: 'within',
      outside: 'outside',
      inside: 'inside',
      above: 'above',
      below: 'below',
      under: 'under',
      over: 'over',
      across: 'across',
      along: 'along',
      against: 'against',
      toward: 'toward',
      towards: 'towards',
      backward: 'backward',
      forward: 'forward',
      upward: 'upward',
      downward: 'downward',
      sideways: 'sideways',
      left: 'left',
      right: 'right',
      up: 'up',
      down: 'down',
      north: 'north',
      south: 'south',
      east: 'east',
      west: 'west',
      northeast: 'northeast',
      northwest: 'northwest',
      southeast: 'southeast',
      southwest: 'southwest',
    },

    // Error Messages
    errors: {
      general: 'Something went wrong',
      network: 'Network error occurred',
      server: 'Server error occurred',
      unauthorized: 'You are not authorized',
      forbidden: 'Access forbidden',
      notFound: 'Page not found',
      timeout: 'Request timed out',
      invalidInput: 'Invalid input',
      requiredField: 'This field is required',
      invalidEmail: 'Invalid email address',
      invalidPassword: 'Invalid password',
      passwordsNotMatch: 'Passwords do not match',
      emailExists: 'Email already exists',
      userNotFound: 'User not found',
      invalidCredentials: 'Invalid credentials',
      sessionExpired: 'Session expired',
      accessDenied: 'Access denied',
      rateLimitExceeded: 'Too many requests. Please try again later.',
      maintenance: 'Site is under maintenance',
      offline: 'You are offline',
      fileNotFound: 'File not found',
      fileTooLarge: 'File too large',
      unsupportedFormat: 'Unsupported file format',
      quotaExceeded: 'Storage quota exceeded',
      featureNotAvailable: 'Feature not available',
      betaOnly: 'Feature only available in beta',
      premiumOnly: 'Feature requires premium subscription',
      ageRestricted: 'Age restricted content',
      countryRestricted: 'Content not available in your country',
    },

    // Success Messages
    success: {
      saved: 'Saved successfully',
      updated: 'Updated successfully',
      deleted: 'Deleted successfully',
      created: 'Created successfully',
      uploaded: 'Uploaded successfully',
      downloaded: 'Downloaded successfully',
      shared: 'Shared successfully',
      copied: 'Copied to clipboard',
      sent: 'Sent successfully',
      received: 'Received successfully',
      completed: 'Completed successfully',
      finished: 'Finished successfully',
      processed: 'Processed successfully',
      imported: 'Imported successfully',
      exported: 'Exported successfully',
      registered: 'Registered successfully',
      loggedIn: 'Logged in successfully',
      loggedOut: 'Logged out successfully',
      verified: 'Verified successfully',
      confirmed: 'Confirmed successfully',
      subscribed: 'Subscribed successfully',
      unsubscribed: 'Unsubscribed successfully',
      invited: 'Invitation sent successfully',
      accepted: 'Invitation accepted',
      rejected: 'Invitation rejected',
      blocked: 'User blocked successfully',
      unblocked: 'User unblocked successfully',
      reported: 'Report submitted successfully',
      bookmarked: 'Bookmarked successfully',
      liked: 'Liked successfully',
      unliked: 'Removed like',
      followed: 'Followed successfully',
      unfollowed: 'Unfollowed successfully',
      purchased: 'Purchase completed successfully',
      refunded: 'Refund processed successfully',
    },
  },

  zh: {
    // 中文翻译...
    game: {
      title: '路径单词',
      subtitle: '找到通往单词的路径',
      guess: '猜测',
      clear: '清除',
      submit: '提交',
      reset: '重置',
      playAgain: '再玩一次',
      share: '分享',
      score: '得分',
      time: '时间',
      attempts: '尝试次数',
      difficulty: '难度',
      easy: '简单',
      medium: '中等',
      hard: '困难',
      expert: '专家',
      daily: '每日',
      practice: '练习',
    },
  },

  es: {
    // Spanish translations...
    game: {
      title: 'PathWordle',
      subtitle: 'Encuentra el camino hacia la palabra',
      guess: 'Adivinar',
      clear: 'Limpiar',
      submit: 'Enviar',
      reset: 'Reiniciar',
      playAgain: 'Jugar de nuevo',
      share: 'Compartir',
      score: 'Puntuación',
      time: 'Tiempo',
      attempts: 'Intentos',
      difficulty: 'Dificultad',
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil',
      expert: 'Experto',
      daily: 'Diario',
      practice: 'Práctica',
    },
  },

  fr: {
    // French translations...
    game: {
      title: 'PathWordle',
      subtitle: 'Trouvez le chemin vers le mot',
      guess: 'Deviner',
      clear: 'Effacer',
      submit: 'Soumettre',
      reset: 'Réinitialiser',
      playAgain: 'Rejouer',
      share: 'Partager',
      score: 'Score',
      time: 'Temps',
      attempts: 'Tentatives',
      difficulty: 'Difficulté',
      easy: 'Facile',
      medium: 'Moyen',
      hard: 'Difficile',
      expert: 'Expert',
      daily: 'Quotidien',
      practice: 'Pratique',
    },
  },

  de: {
    // German translations...
    game: {
      title: 'PathWordle',
      subtitle: 'Finde den Weg zum Wort',
      guess: 'Raten',
      clear: 'Löschen',
      submit: 'Absenden',
      reset: 'Zurücksetzen',
      playAgain: 'Erneut spielen',
      share: 'Teilen',
      score: 'Punkte',
      time: 'Zeit',
      attempts: 'Versuche',
      difficulty: 'Schwierigkeit',
      easy: 'Einfach',
      medium: 'Mittel',
      hard: 'Schwer',
      expert: 'Experte',
      daily: 'Täglich',
      practice: 'Üben',
    },
  },

  ja: {
    // Japanese translations...
    game: {
      title: 'PathWordle',
      subtitle: '単語への道を見つけよう',
      guess: '推測',
      clear: 'クリア',
      submit: '送信',
      reset: 'リセット',
      playAgain: 'もう一度プレイ',
      share: '共有',
      score: 'スコア',
      time: '時間',
      attempts: '試行回数',
      difficulty: '難易度',
      easy: '簡単',
      medium: '中級',
      hard: '上級',
      expert: 'エキスパート',
      daily: 'デイリー',
      practice: '練習',
    },
  },

  ko: {
    // Korean translations...
    game: {
      title: 'PathWordle',
      subtitle: '단어로 가는 경로를 찾으세요',
      guess: '추측',
      clear: '지우기',
      submit: '제출',
      reset: '재설정',
      playAgain: '다시 하기',
      share: '공유',
      score: '점수',
      time: '시간',
      attempts: '시도 횟수',
      difficulty: '난이도',
      easy: '쉬움',
      medium: '보통',
      hard: '어려움',
      expert: '전문가',
      daily: '일일',
      practice: '연습',
    },
  },
};

// Default to English
const DEFAULT_LANGUAGE: Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
  translations: typeof translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = DEFAULT_LANGUAGE
}) => {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('pathwordle_language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLanguage = navigator.language.split('-')[0] as Language;
      if (translations[browserLanguage]) {
        setLanguage(browserLanguage);
      }
    }
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('pathwordle_language', language);
  }, [language]);

  // Translation function
  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return fallback || key;
          }
        }
      }
    }

    return typeof value === 'string' ? value : fallback || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper function for direct translation usage
export const translate = (key: string, language: Language = DEFAULT_LANGUAGE): string => {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key;
        }
      }
    }
  }

  return typeof value === 'string' ? value : key;
};