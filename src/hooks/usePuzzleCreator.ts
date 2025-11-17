import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  CustomPuzzle,
  PuzzleCreationSession,
  CreationStep,
  PuzzleTemplate,
  PathDefinition,
  Coordinate,
  CustomHint,
  PuzzleTestingResult,
  CommunityStats,
  PuzzleEditorSettings,
  CreationTools,
  GridEditorTool,
  PathValidatorTool,
  WordCheckerTool,
  HintGeneratorTool,
  DifficultyAnalyzerTool,
  ValidationError,
  DEFAULT_EDITOR_SETTINGS,
  PUZZLE_TEMPLATES,
  PuzzleCategory,
  DEFAULT_KEYBOARD_SHORTCUTS
} from '../types/puzzleCreator';

interface UsePuzzleCreatorProps {
  creatorId: string;
  creatorName: string;
  initialPuzzle?: Partial<CustomPuzzle>;
  templateId?: string;
}

export const usePuzzleCreator = ({
  creatorId,
  creatorName,
  initialPuzzle,
  templateId
}: UsePuzzleCreatorProps) => {
  // State
  const [session, setSession] = useState<PuzzleCreationSession | null>(null);
  const [currentStep, setCurrentStep] = useState<CreationStep>('basic_info');
  const [puzzleData, setPuzzleData] = useState<Partial<CustomPuzzle>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PuzzleTemplate | null>(null);
  const [editorSettings, setEditorSettings] = useState<PuzzleEditorSettings>(DEFAULT_EDITOR_SETTINGS);

  // Creation tools state
  const [tools, setTools] = useState<CreationTools>({
    gridEditor: {
      selectedTool: 'draw',
      grid: { width: 5, height: 5 },
      path: [],
      history: [],
      canUndo: false,
      canRedo: false
    },
    pathValidator: {
      isValid: false,
      errors: [],
      warnings: [],
      suggestions: []
    },
    wordChecker: {
      isValid: false,
      isCommon: false,
      difficulty: 5
    },
    hintGenerator: {
      generatedHints: [],
      selectedHints: []
    },
    difficultyAnalyzer: {
      overallDifficulty: 5,
      factors: [],
      suggestedDifficulty: 'medium',
      adjustments: []
    }
  });

  // Additional state
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<PuzzleTestingResult | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Refs
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session
  useEffect(() => {
    const initializeSession = () => {
      let initialData: Partial<CustomPuzzle> = {
        creatorId,
        creatorName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
        isApproved: false,
        tags: [],
        difficulty: 'medium',
        likes: 0,
        dislikes: 0,
        plays: 0,
        completions: 0,
        averageRating: 0,
        totalRatings: 0,
        reports: [],
        moderationStatus: 'pending',
        language: 'en',
        estimatedTime: 5
      };

      // Apply initial puzzle data if provided
      if (initialPuzzle) {
        initialData = { ...initialData, ...initialPuzzle };
      }

      // Apply template if provided
      if (templateId) {
        const template = PUZZLE_TEMPLATES.find(t => t.id === templateId);
        if (template) {
          setSelectedTemplate(template);
          initialData = {
            ...initialData,
            category: template.category,
            difficulty: template.difficulty,
            tags: [...template.tags],
            pathDefinition: {
              type: 'linear',
              grid: template.gridTemplate,
              path: template.pathTemplate || []
            }
          };

          // Initialize grid editor with template
          setTools(prev => ({
            ...prev,
            gridEditor: {
              ...prev.gridEditor,
              grid: template.gridTemplate,
              path: template.pathTemplate || []
            }
          }));
        }
      }

      const newSession: PuzzleCreationSession = {
        id: `session_${Date.now()}_${creatorId}`,
        creatorId,
        title: initialData.title || 'Untitled Puzzle',
        currentStep: 'basic_info',
        progress: 0,
        data: initialData,
        lastSaved: new Date().toISOString(),
        isAutoSave: true
      };

      setSession(newSession);
      setPuzzleData(initialData);
    };

    initializeSession();

    // Setup auto-save
    if (editorSettings.autoSave) {
      autoSaveIntervalRef.current = setInterval(() => {
        autoSave();
      }, editorSettings.autoSaveInterval * 60 * 1000);
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      if (sessionSaveTimeoutRef.current) {
        clearTimeout(sessionSaveTimeoutRef.current);
      }
    };
  }, [creatorId, creatorName, initialPuzzle, templateId, editorSettings.autoSave, editorSettings.autoSaveInterval]);

  // Calculate progress
  const calculateProgress = useCallback((): number => {
    const steps: CreationStep[] = ['basic_info', 'word_selection', 'path_design', 'hint_creation', 'theme_customization', 'testing'];
    const completedSteps = steps.filter(step => {
      switch (step) {
        case 'basic_info':
          return !!(puzzleData.title && puzzleData.description);
        case 'word_selection':
          return !!puzzleData.targetWord;
        case 'path_design':
          return !!(puzzleData.pathDefinition && puzzleData.pathDefinition.path.length > 0);
        case 'hint_creation':
          return !!(puzzleData.hints && puzzleData.hints.length > 0);
        case 'theme_customization':
          return !!(puzzleData.category && puzzleData.tags && puzzleData.tags.length > 0);
        case 'testing':
          return !!testResults;
        default:
          return false;
      }
    });

    return Math.round((completedSteps.length / steps.length) * 100);
  }, [puzzleData, testResults]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!session || isSaving) return;

    setIsSaving(true);
    try {
      const updatedData = { ...puzzleData, updatedAt: new Date().toISOString() };
      const updatedSession = {
        ...session,
        data: updatedData,
        lastSaved: new Date().toISOString(),
        progress: calculateProgress()
      };

      // Save to localStorage
      localStorage.setItem(`puzzle_session_${session.id}`, JSON.stringify(updatedSession));
      localStorage.setItem(`puzzle_data_${session.id}`, JSON.stringify(updatedData));

      setPuzzleData(updatedData);
      setSession(updatedSession);
      setLastSaveTime(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [session, puzzleData, isSaving, calculateProgress]);

  // Step navigation
  const goToStep = useCallback((step: CreationStep) => {
    setCurrentStep(step);
    if (session) {
      const updatedSession = { ...session, currentStep: step, progress: calculateProgress() };
      setSession(updatedSession);
    }
  }, [session, calculateProgress]);

  const nextStep = useCallback(() => {
    const steps: CreationStep[] = ['basic_info', 'word_selection', 'path_design', 'hint_creation', 'theme_customization', 'testing', 'publishing'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1]);
    }
  }, [currentStep, goToStep]);

  const previousStep = useCallback(() => {
    const steps: CreationStep[] = ['basic_info', 'word_selection', 'path_design', 'hint_creation', 'theme_customization', 'testing', 'publishing'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1]);
    }
  }, [currentStep, goToStep]);

  // Puzzle data updates
  const updatePuzzleData = useCallback((updates: Partial<CustomPuzzle>) => {
    const updatedData = { ...puzzleData, ...updates, updatedAt: new Date().toISOString() };
    setPuzzleData(updatedData);

    // Debounced save
    if (sessionSaveTimeoutRef.current) {
      clearTimeout(sessionSaveTimeoutRef.current);
    }
    sessionSaveTimeoutRef.current = setTimeout(() => {
      if (session && editorSettings.autoSave) {
        autoSave();
      }
    }, 1000);
  }, [puzzleData, session, editorSettings.autoSave, autoSave]);

  // Word validation
  const validateWord = useCallback(async (word: string): Promise<WordCheckerTool> => {
    const cleanWord = word.toUpperCase().trim();

    if (cleanWord.length < 3) {
      return {
        isValid: false,
        isCommon: false,
        difficulty: 1
      };
    }

    if (cleanWord.length > 15) {
      return {
        isValid: false,
        isCommon: false,
        difficulty: 10
      };
    }

    // Mock word validation - in real implementation, this would call a dictionary API
    const commonWords = ['HELLO', 'WORLD', 'GAME', 'PLAY', 'WORD', 'PUZZLE', 'PATH', 'FUN', 'LEARN', 'CREATE'];
    const isCommon = commonWords.includes(cleanWord);
    const difficulty = Math.min(Math.max(Math.floor(cleanWord.length / 2), 1), 10);

    const result: WordCheckerTool = {
      isValid: true,
      isCommon,
      difficulty,
      definition: `Definition for ${cleanWord}`, // Mock definition
      synonyms: [`SYNONYM1_${cleanWord}`, `SYNONYM2_${cleanWord}`],
      frequency: isCommon ? 8 : 3
    };

    setTools(prev => ({ ...prev, wordChecker: result }));
    return result;
  }, []);

  // Path validation
  const validatePath = useCallback((path: Coordinate[], targetWord: string): PathValidatorTool => {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: PathSuggestion[] = [];

    // Basic validation
    if (path.length === 0) {
      errors.push({
        type: 'invalid_path',
        message: 'Path cannot be empty',
        severity: 'error'
      });
    }

    if (path.length !== targetWord.length) {
      errors.push({
        type: 'invalid_path',
        message: `Path length (${path.length}) must match word length (${targetWord.length})`,
        severity: 'error'
      });
    }

    // Check for duplicate coordinates
    const coordinateSet = new Set(path.map(coord => `${coord.x},${coord.y}`));
    if (coordinateSet.size !== path.length) {
      errors.push({
        type: 'path_conflict',
        message: 'Path contains duplicate coordinates',
        severity: 'error'
      });
    }

    // Check path connectivity
    for (let i = 1; i < path.length; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      const distance = Math.abs(prev.x - curr.x) + Math.abs(prev.y - curr.y);

      if (distance !== 1) {
        errors.push({
          type: 'invalid_path',
          message: `Path coordinates at position ${i} are not adjacent`,
          severity: 'error',
          position: curr
        });
      }
    }

    // Generate suggestions
    if (path.length > 0 && path.length < 8) {
      suggestions.push({
        type: 'clarity',
        description: 'Consider using a longer word for more engaging gameplay',
        action: 'Choose a word with 8+ letters'
      });
    }

    const result: PathValidatorTool = {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };

    setTools(prev => ({ ...prev, pathValidator: result }));
    return result;
  }, []);

  // Grid editor actions
  const updateGrid = useCallback((grid: PathGrid, path: Coordinate[]) => {
    setTools(prev => ({
      ...prev,
      gridEditor: {
        ...prev.gridEditor,
        grid,
        path,
        history: [...prev.gridEditor.history, grid],
        canUndo: true
      }
    }));

    // Validate path if word is set
    if (puzzleData.targetWord) {
      validatePath(path, puzzleData.targetWord);
    }

    // Update puzzle data
    updatePuzzleData({
      pathDefinition: {
        type: 'linear',
        grid,
        path
      }
    });
  }, [puzzleData.targetWord, validatePath, updatePuzzleData]);

  const undoGridAction = useCallback(() => {
    const history = tools.gridEditor.history;
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousGrid = newHistory[newHistory.length - 1];

      setTools(prev => ({
        ...prev,
        gridEditor: {
          ...prev.gridEditor,
          grid: previousGrid,
          history: newHistory,
          canUndo: newHistory.length > 1,
          canRedo: true
        }
      }));
    }
  }, [tools.gridEditor.history]);

  // Hint generation
  const generateHints = useCallback(async (word: string): Promise<GeneratedHint[]> => {
    const hints: GeneratedHint[] = [
      {
        type: 'definition',
        content: `This is the definition of ${word}`,
        quality: 85,
        source: 'auto'
      },
      {
        type: 'fun_fact',
        content: `An interesting fact about the word ${word}`,
        quality: 75,
        source: 'auto'
      },
      {
        type: 'usage_example',
        content: `An example sentence using the word ${word}`,
        quality: 80,
        source: 'auto'
      }
    ];

    setTools(prev => ({
      ...prev,
      hintGenerator: {
        ...prev.hintGenerator,
        generatedHints: hints
      }
    }));

    return hints;
  }, []);

  // Difficulty analysis
  const analyzeDifficulty = useCallback((): DifficultyAnalyzerTool => {
    const word = puzzleData.targetWord || '';
    const path = puzzleData.pathDefinition?.path || [];
    const hints = puzzleData.hints || [];

    const factors: DifficultyFactor[] = [];

    // Word length factor
    factors.push({
      factor: 'word_length',
      score: Math.min(word.length / 2, 10),
      weight: 0.3,
      impact: word.length > 8 ? 'Increases difficulty due to longer word' : 'Standard word length'
    });

    // Path complexity factor
    factors.push({
      factor: 'path_complexity',
      score: Math.min(path.length / 3, 10),
      weight: 0.25,
      impact: path.length > 10 ? 'Complex path increases difficulty' : 'Simple path structure'
    });

    // Hint quality factor
    factors.push({
      factor: 'hint_quality',
      score: Math.min((hints.length * 2), 10),
      weight: 0.2,
      impact: hints.length < 2 ? 'Few hints may increase difficulty' : 'Good hint availability'
    });

    const overallDifficulty = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0);

    let suggestedDifficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium';
    if (overallDifficulty < 3) suggestedDifficulty = 'easy';
    else if (overallDifficulty < 6) suggestedDifficulty = 'medium';
    else if (overallDifficulty < 8) suggestedDifficulty = 'hard';
    else suggestedDifficulty = 'expert';

    const result: DifficultyAnalyzerTool = {
      overallDifficulty: Math.round(overallDifficulty * 10) / 10,
      factors,
      suggestedDifficulty,
      adjustments: []
    };

    setTools(prev => ({ ...prev, difficultyAnalyzer: result }));
    return result;
  }, [puzzleData.targetWord, puzzleData.pathDefinition?.path, puzzleData.hints]);

  // Testing functionality
  const testPuzzle = useCallback(async (): Promise<PuzzleTestingResult> => {
    setIsTesting(true);

    try {
      // Mock testing - in real implementation, this would run actual test simulations
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResults: PuzzleTestingResult = {
        puzzleId: session?.id || 'test',
        testResults: [
          {
            testerId: 'bot1',
            completionTime: 180,
            hintsUsed: 2,
            rating: 4,
            feedback: 'Fun and challenging!',
            completed: true
          },
          {
            testerId: 'bot2',
            completionTime: 240,
            hintsUsed: 3,
            rating: 3,
            feedback: 'Good but could be clearer',
            completed: true
          }
        ],
        overallScore: 85,
        averageCompletionTime: 210,
        successRate: 1.0,
        feedback: [
          {
            category: 'fun_factor',
            score: 4,
            comment: 'Engaging gameplay'
          },
          {
            category: 'difficulty',
            score: 3,
            comment: 'Appropriate challenge level'
          }
        ],
        recommendations: [
          {
            type: 'improvement',
            priority: 'medium',
            description: 'Add more contextual hints',
            action: 'Consider adding usage examples'
          }
        ]
      };

      setTestResults(mockResults);
      return mockResults;
    } finally {
      setIsTesting(false);
    }
  }, [session?.id]);

  // Publishing functionality
  const publishPuzzle = useCallback(async (isPublic: boolean = false): Promise<boolean> => {
    if (!session || !puzzleData.targetWord || !puzzleData.pathDefinition) {
      throw new Error('Puzzle is incomplete. Please fill in all required fields.');
    }

    setIsPublishing(true);

    try {
      const finalPuzzle: CustomPuzzle = {
        id: `puzzle_${Date.now()}_${creatorId}`,
        title: puzzleData.title || 'Untitled Puzzle',
        description: puzzleData.description || '',
        creatorId,
        creatorName,
        createdAt: puzzleData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic,
        isApproved: false, // Requires moderation
        tags: puzzleData.tags || [],
        category: puzzleData.category || { id: 'custom', name: 'Custom', description: 'User-created puzzle', icon: '🎨', color: '#6B7280', isPublic: true },
        difficulty: puzzleData.difficulty || 'medium',
        targetWord: puzzleData.targetWord,
        pathDefinition: puzzleData.pathDefinition,
        hints: puzzleData.hints || [],
        theme: puzzleData.theme,
        educationalContent: puzzleData.educationalContent,
        likes: 0,
        dislikes: 0,
        plays: 0,
        completions: 0,
        averageRating: 0,
        totalRatings: 0,
        reports: [],
        moderationStatus: isPublic ? 'pending' : 'approved',
        language: puzzleData.language || 'en',
        estimatedTime: puzzleData.estimatedTime || 5,
        requirements: puzzleData.requirements
      };

      // Save to localStorage (in real implementation, this would be an API call)
      const existingPuzzles = JSON.parse(localStorage.getItem('user_puzzles') || '[]');
      existingPuzzles.push(finalPuzzle);
      localStorage.setItem('user_puzzles', JSON.stringify(existingPuzzles));

      // Clear session
      localStorage.removeItem(`puzzle_session_${session.id}`);
      localStorage.removeItem(`puzzle_data_${session.id}`);

      return true;
    } catch (error) {
      console.error('Publishing failed:', error);
      throw error;
    } finally {
      setIsPublishing(false);
    }
  }, [session, puzzleData, creatorId, creatorName]);

  // Load community stats
  const loadCommunityStats = useCallback(async () => {
    // Mock community stats
    const mockStats: CommunityStats = {
      totalPuzzles: 15420,
      publicPuzzles: 12340,
      approvedPuzzles: 11890,
      pendingApproval: 450,
      averageRating: 4.2,
      topCreators: [
        {
          creatorId: 'creator1',
          creatorName: 'PuzzleMaster',
          avatar: '🏆',
          totalPuzzles: 145,
          totalPlays: 15234,
          averageRating: 4.6,
          followerCount: 892,
          badges: [
            { id: 'top_creator', name: 'Top Creator', description: 'Created 100+ puzzles', icon: '⭐', unlockedAt: '2024-01-15' }
          ]
        }
      ],
      popularCategories: [
        { categoryId: 'technology', name: 'Technology', puzzleCount: 3420, totalPlays: 45678, averageRating: 4.3 }
      ],
      recentActivity: [
        {
          id: 'activity1',
          type: 'puzzle_created',
          description: 'New puzzle "Space Explorer" created',
          timestamp: new Date().toISOString(),
          userId: 'user123',
          puzzleId: 'puzzle456'
        }
      ]
    };

    setCommunityStats(mockStats);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;

      // Save
      if (ctrl && key === 's') {
        event.preventDefault();
        autoSave();
      }

      // Test
      if (ctrl && key === 't') {
        event.preventDefault();
        if (currentStep === 'testing') {
          testPuzzle();
        }
      }

      // Undo
      if (ctrl && key === 'z') {
        event.preventDefault();
        undoGridAction();
      }

      // Navigate steps
      if (ctrl && key === 'arrowright') {
        event.preventDefault();
        nextStep();
      }

      if (ctrl && key === 'arrowleft') {
        event.preventDefault();
        previousStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [autoSave, testPuzzle, undoGridAction, nextStep, previousStep, currentStep]);

  // Computed values
  const isStepComplete = useMemo(() => {
    switch (currentStep) {
      case 'basic_info':
        return !!(puzzleData.title && puzzleData.description);
      case 'word_selection':
        return !!(puzzleData.targetWord && tools.wordChecker.isValid);
      case 'path_design':
        return !!(puzzleData.pathDefinition && tools.pathValidator.isValid);
      case 'hint_creation':
        return !!(puzzleData.hints && puzzleData.hints.length > 0);
      case 'theme_customization':
        return !!(puzzleData.category && puzzleData.tags && puzzleData.tags.length > 0);
      case 'testing':
        return !!testResults;
      case 'publishing':
        return true;
      default:
        return false;
    }
  }, [currentStep, puzzleData, tools.wordChecker.isValid, tools.pathValidator.isValid, testResults]);

  const canProceed = useMemo(() => {
    const stepOrder: CreationStep[] = ['basic_info', 'word_selection', 'path_design', 'hint_creation', 'theme_customization', 'testing', 'publishing'];
    const currentIndex = stepOrder.indexOf(currentStep);

    // Can proceed if current step is complete or moving backwards
    if (currentIndex === 0) return true;
    const previousStep = stepOrder[currentIndex - 1];
    return isStepComplete || currentStep === 'publishing';
  }, [currentStep, isStepComplete]);

  return {
    // State
    session,
    currentStep,
    puzzleData,
    isSaving,
    lastSaveTime,
    selectedTemplate,
    editorSettings,
    tools,
    isTesting,
    testResults,
    communityStats,
    isPublishing,
    isStepComplete,
    canProceed,
    progress: calculateProgress(),

    // Actions
    goToStep,
    nextStep,
    previousStep,
    updatePuzzleData,
    validateWord,
    validatePath,
    updateGrid,
    undoGridAction,
    generateHints,
    analyzeDifficulty,
    testPuzzle,
    publishPuzzle,
    loadCommunityStats,
    setEditorSettings,
    setSelectedTemplate,

    // Computed
    keyboardShortcuts: DEFAULT_KEYBOARD_SHORTCUTS
  };
};

type GeneratedHint = {
  type: 'definition' | 'etymology' | 'usage_example' | 'synonym' | 'antonym' | 'fun_fact';
  content: string;
  quality: number; // 0-100
  source: 'auto' | 'api' | 'community';
};