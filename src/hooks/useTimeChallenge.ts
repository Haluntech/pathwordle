import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  TimeChallenge,
  TimeChallengeSession,
  TimeChallengeStats,
  TimeChallengeSettings,
  DailyTimeChallenge,
  TIMER_STATES,
  PREDEFINED_CHALLENGES,
  TIME_CHALLENGE_ACHIEVEMENTS
} from '../types/timeChallenge';

interface UseTimeChallengeProps {
  playerId: string;
  challengeId?: string;
  settings?: Partial<TimeChallengeSettings>;
}

const DEFAULT_SETTINGS: TimeChallengeSettings = {
  soundEnabled: true,
  countdownStyle: 'digital',
  warningTime: 30,
  autoSubmit: false,
  showLeaderboard: true,
  difficultyPreference: 'adaptive',
  theme: 'speed'
};

export const useTimeChallenge = ({
  playerId,
  challengeId,
  settings: userSettings = {}
}: UseTimeChallengeProps) => {
  const [settings] = useState<TimeChallengeSettings>({
    ...DEFAULT_SETTINGS,
    ...userSettings
  });

  // Challenge state
  const [currentChallenge, setCurrentChallenge] = useState<TimeChallenge | null>(null);
  const [session, setSession] = useState<TimeChallengeSession | null>(null);
  const [timerState, setTimerState] = useState<string>(TIMER_STATES.READY);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [challengeStats, setChallengeStats] = useState<TimeChallengeStats | null>(null);

  // Refs for timer management
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Mock data storage (in real app, this would be API calls)
  const [availableChallenges] = useState<TimeChallenge[]>([
    {
      id: 'daily_sprint_2025_11_14',
      name: 'Daily Sprint Challenge',
      description: 'Solve 5 words in 3 minutes! Speed and accuracy are key.',
      timeLimit: 180,
      difficulty: 'medium',
      category: 'daily',
      wordPool: ['HELLO', 'WORLD', 'GAME', 'PLAY', 'THINK'],
      rewards: [
        { type: 'points', value: 100, description: 'Completion bonus', rarity: 'common' },
        { type: 'badge', value: 'daily_winner', description: 'Daily Champion Badge', rarity: 'rare' }
      ],
      isActive: true,
      participantCount: 1234,
      leaderboard: []
    },
    {
      id: 'weekly_marathon_2025_46',
      name: 'Weekly Marathon',
      description: 'Complete 10 words as fast as possible! Test your endurance.',
      timeLimit: 600,
      difficulty: 'hard',
      category: 'weekly',
      wordPool: ['PUZZLE', 'CODING', 'ALGORITHM', 'JAVASCRIPT', 'QUANTUM'],
      rewards: [
        { type: 'points', value: 500, description: 'Marathon completion', rarity: 'epic' },
        { type: 'theme', value: 'speed_master', description: 'Speed Master Theme', rarity: 'legendary' }
      ],
      isActive: true,
      participantCount: 567,
      leaderboard: []
    },
    {
      id: 'speed_demon_special',
      name: 'Speed Demon Challenge',
      description: 'Lightning round: 1 minute per word! No hints allowed!',
      timeLimit: 300,
      difficulty: 'expert',
      category: 'special',
      wordPool: ['NEUROSCIENCE', 'PHILOSOPHICAL', 'CRYPTOCURRENCY'],
      requirements: [
        { type: 'level', value: 10, description: 'Reach level 10' }
      ],
      rewards: [
        { type: 'title', value: 'Speed Demon', description: 'Exclusive Speed Demon Title', rarity: 'legendary' },
        { type: 'avatar', value: 'lightning_bolt', description: 'Lightning Bolt Avatar', rarity: 'epic' }
      ],
      isActive: true,
      participantCount: 89,
      leaderboard: []
    }
  ]);

  // Initialize challenge stats
  useEffect(() => {
    const mockStats: TimeChallengeStats = {
      totalChallenges: 15,
      completedChallenges: 12,
      averageTime: 145,
      bestTime: 87,
      totalWordsFound: 48,
      averageHintsUsed: 1.2,
      favoriteCategory: 'daily',
      currentStreak: 3,
      bestStreak: 7,
      totalPoints: 2340,
      rankHistory: [],
      achievements: [
        {
          ...TIME_CHALLENGE_ACHIEVEMENTS.SPEED_RUNNER,
          unlockedAt: '2025-11-10T15:30:00Z',
          progress: 1,
          maxProgress: 1
        },
        {
          ...TIME_CHALLENGE_ACHIEVEMENTS.CONSISTENT_PERFORMER,
          unlockedAt: '2025-11-12T09:15:00Z',
          progress: 7,
          maxProgress: 7
        }
      ]
    };
    setChallengeStats(mockStats);
  }, []);

  // Timer management
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      console.warn('Timer already running');
      return;
    }

    if (!currentChallenge) {
      console.error('Cannot start timer: No active challenge');
      return;
    }

    startTimeRef.current = Date.now() - pausedTimeRef.current;
    setTimerState(TIMER_STATES.RUNNING);

    timerRef.current = setInterval(() => {
      try {
        const elapsed = Date.now() - startTimeRef.current;
        const timeLimitMs = currentChallenge.timeLimit * 1000;
        const remaining = Math.max(0, timeLimitMs - elapsed);

        setTimeRemaining(Math.ceil(remaining / 1000));

        // Warning state when time is running out
        if (remaining <= settings.warningTime * 1000 && remaining > 0) {
          setTimerState(TIMER_STATES.WARNING);
          if (settings.soundEnabled) {
            // Play warning sound
            playSound('warning');
          }
        }

        // Timer expired
        if (remaining <= 0) {
          endChallenge(false);
        }
      } catch (error) {
        console.error('Timer error:', error);
        stopTimer();
      }
    }, 100); // Update every 100ms for smooth countdown
  }, [session?.challengeId, currentChallenge, settings, endChallenge, playSound]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    pausedTimeRef.current = Date.now() - startTimeRef.current;
    setTimerState(TIMER_STATES.PAUSED);
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    if (isPaused) {
      startTimer();
      setIsPaused(false);
    }
  }, [isPaused, startTimer]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerState(TIMER_STATES.FINISHED);
  }, []);

  // Sound effects
  const playSound = useCallback((type: 'start' | 'tick' | 'warning' | 'complete' | 'expire') => {
    if (!settings.soundEnabled) return;

    // In a real app, this would play actual sound files
    console.log(`Playing sound: ${type}`);
  }, [settings.soundEnabled]);

  // Challenge management
  const startChallenge = useCallback((challenge: TimeChallenge) => {
    // Check requirements
    if (challenge.requirements) {
      for (const req of challenge.requirements) {
        if (!checkRequirement(req)) {
          throw new Error(`Requirement not met: ${req.description}`);
        }
      }
    }

    const newSession: TimeChallengeSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      challengeId: challenge.id,
      playerId,
      startTime: new Date().toISOString(),
      timeSpent: 0,
      wordsFound: [],
      hintsUsed: 0,
      score: 0,
      completed: false,
      rewards: []
    };

    setCurrentChallenge(challenge);
    setSession(newSession);
    setTimeRemaining(challenge.timeLimit);
    setTimerState(TIMER_STATES.READY);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;

    playSound('start');
  }, [playerId, playSound]);

  const beginChallenge = useCallback(() => {
    if (!currentChallenge || !session) return;

    startTimer();
  }, [currentChallenge, session, startTimer]);

  const endChallenge = useCallback((completed: boolean, finalScore?: number) => {
    stopTimer();

    if (!session || !currentChallenge) return;

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    const updatedSession: TimeChallengeSession = {
      ...session,
      endTime: new Date().toISOString(),
      timeSpent,
      score: finalScore || calculateScore(session, timeSpent, completed),
      completed
    };

    setSession(updatedSession);
    setTimerState(completed ? TIMER_STATES.FINISHED : TIMER_STATES.EXPIRED);

    playSound(completed ? 'complete' : 'expire');

    // Update challenge stats
    updateStats(updatedSession);

    // Check for new achievements
    checkAchievements(updatedSession);
  }, [session, currentChallenge, stopTimer, playSound]);

  const submitWord = useCallback((word: string, accuracy: number) => {
    if (!session || !currentChallenge) return;

    const updatedSession: TimeChallengeSession = {
      ...session,
      wordsFound: [...session.wordsFound, word],
      score: session.score + Math.round(100 * accuracy)
    };

    setSession(updatedSession);

    // Check if challenge is completed
    if (updatedSession.wordsFound.length >= currentChallenge.wordPool.length) {
      endChallenge(true, updatedSession.score);
    }
  }, [session, currentChallenge, endChallenge]);

  const useHint = useCallback(() => {
    if (!session || !currentChallenge) return;

    const updatedSession: TimeChallengeSession = {
      ...session,
      hintsUsed: session.hintsUsed + 1,
      score: Math.max(0, session.score - 20) // Penalty for using hints
    };

    setSession(updatedSession);
  }, [session, currentChallenge]);

  // Helper functions
  const checkRequirement = useCallback((requirement: any): boolean => {
    // Mock implementation - in real app, check against player stats
    switch (requirement.type) {
      case 'level':
        return true; // Mock: player is high enough level
      case 'previous_wins':
        return true; // Mock: player has enough wins
      default:
        return true;
    }
  }, []);

  const calculateScore = useCallback((session: TimeChallengeSession, timeSpent: number, completed: boolean): number => {
    let score = 0;

    // Base points for words found
    score += session.wordsFound.length * 100;

    // Time bonus (faster = more points)
    if (completed && currentChallenge) {
      const timeBonus = Math.max(0, (currentChallenge.timeLimit - timeSpent) * 2);
      score += timeBonus;
    }

    // Hint penalty
    score -= session.hintsUsed * 20;

    // Accuracy bonus
    const accuracyBonus = session.wordsFound.length > 0 ? 50 : 0;
    score += accuracyBonus;

    return Math.max(0, score);
  }, [currentChallenge]);

  const updateStats = useCallback((session: TimeChallengeSession) => {
    if (!challengeStats) return;

    const updatedStats: TimeChallengeStats = {
      ...challengeStats,
      totalChallenges: challengeStats.totalChallenges + 1,
      completedChallenges: session.completed ? challengeStats.completedChallenges + 1 : challengeStats.completedChallenges,
      averageTime: Math.round(
        (challengeStats.averageTime * challengeStats.totalChallenges + session.timeSpent) /
        (challengeStats.totalChallenges + 1)
      ),
      bestTime: Math.min(challengeStats.bestTime || Infinity, session.timeSpent),
      totalWordsFound: challengeStats.totalWordsFound + session.wordsFound.length,
      averageHintsUsed: Math.round(
        (challengeStats.averageHintsUsed * challengeStats.totalChallenges + session.hintsUsed) /
        (challengeStats.totalChallenges + 1)
      ),
      currentStreak: session.completed ? challengeStats.currentStreak + 1 : 0,
      totalPoints: challengeStats.totalPoints + session.score
    };

    setChallengeStats(updatedStats);

    // Save to localStorage for persistence
    localStorage.setItem('timeChallengeStats', JSON.stringify(updatedStats));
  }, [challengeStats]);

  const checkAchievements = useCallback((session: TimeChallengeSession) => {
    // Mock achievement checking logic
    const newAchievements = [];

    // Speed achievement
    if (session.timeSpent < 120 && session.completed) {
      newAchievements.push(TIME_CHALLENGE_ACHIEVEMENTS.SPEED_RUNNER);
    }

    // Consistency achievement
    if (challengeStats && challengeStats.currentStreak >= 7) {
      newAchievements.push(TIME_CHALLENGE_ACHIEVEMENTS.CONSISTENT_PERFORMER);
    }

    return newAchievements;
  }, [challengeStats]);

  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Get challenge by ID
  const getChallenge = useCallback((id: string): TimeChallenge | undefined => {
    return availableChallenges.find(challenge => challenge.id === id);
  }, [availableChallenges]);

  // Get available challenges for player
  const getAvailableChallenges = useCallback((): TimeChallenge[] => {
    return availableChallenges.filter(challenge => {
      if (!challenge.isActive) return false;

      // Check requirements
      if (challenge.requirements) {
        return challenge.requirements.every(req => checkRequirement(req));
      }

      return true;
    });
  }, [availableChallenges, checkRequirement]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    // State
    currentChallenge,
    session,
    timerState,
    timeRemaining,
    isPaused,
    challengeStats,
    settings,
    availableChallenges: getAvailableChallenges(),

    // Methods
    startChallenge,
    beginChallenge,
    endChallenge,
    pauseTimer,
    resumeTimer,
    submitWord,
    useHint,
    formatTime,
    getChallenge,

    // Computed values
    timeRemainingFormatted: formatTime(timeRemaining),
    progressPercentage: currentChallenge
      ? ((currentChallenge.timeLimit - timeRemaining) / currentChallenge.timeLimit) * 100
      : 0,
    canPause: timerState === TIMER_STATES.RUNNING,
    canResume: isPaused,
    isWarning: timerState === TIMER_STATES.WARNING,
    isFinished: [TIMER_STATES.FINISHED, TIMER_STATES.EXPIRED].includes(timerState as any)
  };
};