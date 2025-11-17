import React, { useState, useEffect } from 'react';
import {
  Save,
  Play,
  RotateCcw,
  RotateCw,
  Grid3x3,
  Sparkles,
  Settings,
  Eye,
  Upload,
  Lightbulb,
  Target,
  HelpCircle,
  TrendingUp,
  Users,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  AlertTriangle,
  Clock,
  Star,
  BarChart3
} from 'lucide-react';
import { usePuzzleCreator } from '../hooks/usePuzzleCreator';
import { CreationStep, PuzzleTemplate } from '../types/puzzleCreator';

interface PuzzleCreatorProps {
  creatorId: string;
  creatorName: string;
  initialPuzzle?: any;
  templateId?: string;
  onClose?: () => void;
}

const PuzzleCreator: React.FC<PuzzleCreatorProps> = ({
  creatorId,
  creatorName,
  initialPuzzle,
  templateId,
  onClose
}) => {
  const {
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
    progress,
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
    keyboardShortcuts
  } = usePuzzleCreator({
    creatorId,
    creatorName,
    initialPuzzle,
    templateId
  });

  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [publishMode, setPublishMode] = useState<'private' | 'public'>('private');

  // Step navigation
  const steps = [
    { id: 'basic_info', label: 'Basic Info', icon: Sparkles },
    { id: 'word_selection', label: 'Word', icon: Target },
    { id: 'path_design', label: 'Path', icon: Grid3x3 },
    { id: 'hint_creation', label: 'Hints', icon: Lightbulb },
    { id: 'theme_customization', label: 'Theme', icon: Settings },
    { id: 'testing', label: 'Test', icon: Play },
    { id: 'publishing', label: 'Publish', icon: Upload }
  ] as const;

  // Load community stats on mount
  useEffect(() => {
    loadCommunityStats();
  }, [loadCommunityStats]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic_info':
        return <BasicInfoStep />;
      case 'word_selection':
        return <WordSelectionStep />;
      case 'path_design':
        return <PathDesignStep />;
      case 'hint_creation':
        return <HintCreationStep />;
      case 'theme_customization':
        return <ThemeCustomizationStep />;
      case 'testing':
        return <TestingStep />;
      case 'publishing':
        return <PublishingStep />;
      default:
        return null;
    }
  };

  // Basic Info Step
  const BasicInfoStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Puzzle Title *
        </label>
        <input
          type="text"
          value={puzzleData.title || ''}
          onChange={(e) => updatePuzzleData({ title: e.target.value })}
          placeholder="Enter a catchy title for your puzzle"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={100}
        />
        <p className="mt-1 text-sm text-gray-500">
          {puzzleData.title?.length || 0}/100 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={puzzleData.description || ''}
          onChange={(e) => updatePuzzleData({ description: e.target.value })}
          placeholder="Describe your puzzle concept, difficulty level, and what makes it unique"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={500}
        />
        <p className="mt-1 text-sm text-gray-500">
          {puzzleData.description?.length || 0}/500 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Estimated Time (minutes)
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="1"
            max="30"
            value={puzzleData.estimatedTime || 5}
            onChange={(e) => updatePuzzleData({ estimatedTime: parseInt(e.target.value) })}
            className="flex-1"
          />
          <span className="w-12 text-center font-medium">
            {puzzleData.estimatedTime || 5}
          </span>
        </div>
      </div>

      {selectedTemplate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Template Applied</span>
          </div>
          <p className="text-sm text-blue-700">
            Using "{selectedTemplate.name}" template with {selectedTemplate.difficulty} difficulty
          </p>
        </div>
      )}
    </div>
  );

  // Word Selection Step
  const WordSelectionStep = () => {
    const [wordInput, setWordInput] = useState(puzzleData.targetWord || '');
    const [isValidating, setIsValidating] = useState(false);

    const handleWordValidation = async () => {
      if (!wordInput.trim()) return;

      setIsValidating(true);
      try {
        await validateWord(wordInput);
        if (tools.wordChecker.isValid) {
          updatePuzzleData({ targetWord: wordInput.toUpperCase().trim() });
        }
      } finally {
        setIsValidating(false);
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Word *
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value.toUpperCase())}
              placeholder="Enter the target word (3-15 letters)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={15}
            />
            <button
              onClick={handleWordValidation}
              disabled={isValidating || !wordInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </button>
          </div>
        </div>

        {puzzleData.targetWord && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Word Validated</span>
            </div>
            <div className="space-y-1 text-sm text-green-700">
              <p><strong>Word:</strong> {puzzleData.targetWord}</p>
              <p><strong>Length:</strong> {puzzleData.targetWord.length} letters</p>
              <p><strong>Common Word:</strong> {tools.wordChecker.isCommon ? 'Yes' : 'No'}</p>
              <p><strong>Difficulty:</strong> {tools.wordChecker.difficulty}/10</p>
            </div>
          </div>
        )}

        {tools.wordChecker.definition && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Definition</h4>
            <p className="text-sm text-gray-700">{tools.wordChecker.definition}</p>
          </div>
        )}
      </div>
    );
  };

  // Path Design Step
  const PathDesignStep = () => {
    const { gridEditor, pathValidator } = tools;
    const gridSize = gridEditor.grid;

    const handleCellClick = (x: number, y: number) => {
      const newPath = [...gridEditor.path];
      const existingIndex = newPath.findIndex(coord => coord.x === x && coord.y === y);

      if (existingIndex !== -1) {
        // Remove coordinate if it exists
        newPath.splice(existingIndex, 1);
      } else {
        // Add coordinate
        newPath.push({ x, y });
      }

      updateGrid(gridSize, newPath);
    };

    const isPathCell = (x: number, y: number) => {
      return gridEditor.path.some(coord => coord.x === x && coord.y === y);
    };

    const getPathOrder = (x: number, y: number) => {
      return gridEditor.path.findIndex(coord => coord.x === x && coord.y === y);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Path Designer</h3>
            <p className="text-sm text-gray-600">
              Create a path that spells "{puzzleData.targetWord}" - click cells to add/remove them
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={undoGridAction}
              disabled={!gridEditor.canUndo}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex justify-center">
          <div className="inline-block bg-white border-2 border-gray-300 rounded-lg p-2">
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize.height}, 1fr)`
              }}
            >
              {Array.from({ length: gridSize.height * gridSize.width }, (_, index) => {
                const x = index % gridSize.width;
                const y = Math.floor(index / gridSize.width);
                const order = getPathOrder(x, y);

                return (
                  <button
                    key={`${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                      isPathCell(x, y)
                        ? 'border-blue-500 bg-blue-100 text-blue-700'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {isPathCell(x, y) && (
                      <div className="relative">
                        <span>{puzzleData.targetWord?.[order] || ''}</span>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {order + 1}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Validation Results */}
        {pathValidator.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <X className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-900">Validation Errors</span>
            </div>
            <ul className="space-y-1 text-sm text-red-700">
              {pathValidator.errors.map((error, index) => (
                <li key={index}>• {error.message}</li>
              ))}
            </ul>
          </div>
        )}

        {pathValidator.warnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-900">Warnings</span>
            </div>
            <ul className="space-y-1 text-sm text-yellow-700">
              {pathValidator.warnings.map((warning, index) => (
                <li key={index}>• {warning.message}</li>
              ))}
            </ul>
          </div>
        )}

        {pathValidator.suggestions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Suggestions</span>
            </div>
            <ul className="space-y-1 text-sm text-blue-700">
              {pathValidator.suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion.description}</li>
              ))}
            </ul>
          </div>
        )}

        {pathValidator.isValid && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Path is valid!</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Hint Creation Step
  const HintCreationStep = () => {
    const [newHint, setNewHint] = useState({ type: 'definition' as const, content: '', cost: 10, isFree: false });

    const addHint = () => {
      if (!newHint.content.trim()) return;

      const hint = {
        id: `hint_${Date.now()}`,
        ...newHint,
        content: newHint.content.trim()
      };

      updatePuzzleData({
        hints: [...(puzzleData.hints || []), hint]
      });

      setNewHint({ type: 'definition', content: '', cost: 10, isFree: false });
    };

    const removeHint = (hintId: string) => {
      updatePuzzleData({
        hints: puzzleData.hints?.filter(h => h.id !== hintId) || []
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create Hints</h3>

          {/* Hint creation form */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hint Type
              </label>
              <select
                value={newHint.type}
                onChange={(e) => setNewHint({ ...newHint, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="definition">Definition</option>
                <option value="etymology">Etymology</option>
                <option value="usage_example">Usage Example</option>
                <option value="synonym">Synonym</option>
                <option value="antonym">Antonym</option>
                <option value="fun_fact">Fun Fact</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hint Content
              </label>
              <textarea
                value={newHint.content}
                onChange={(e) => setNewHint({ ...newHint, content: e.target.value })}
                placeholder="Enter the hint content"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Cost
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newHint.cost}
                  onChange={(e) => setNewHint({ ...newHint, cost: parseInt(e.target.value) || 0 })}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="freeHint"
                  checked={newHint.isFree}
                  onChange={(e) => setNewHint({ ...newHint, isFree: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="freeHint" className="text-sm text-gray-700">
                  Free hint
                </label>
              </div>
            </div>

            <button
              onClick={addHint}
              disabled={!newHint.content.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Hint
            </button>
          </div>
        </div>

        {/* Existing hints */}
        {puzzleData.hints && puzzleData.hints.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Current Hints ({puzzleData.hints.length})</h4>
            <div className="space-y-2">
              {puzzleData.hints.map((hint) => (
                <div key={hint.id} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 capitalize">{hint.type}</span>
                        {hint.isFree && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Free</span>}
                        {!hint.isFree && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{hint.cost} pts</span>}
                      </div>
                      <p className="text-sm text-gray-700">{hint.content}</p>
                    </div>
                    <button
                      onClick={() => removeHint(hint.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Hint Guidelines</span>
          </div>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Provide 2-4 hints for balanced difficulty</li>
            <li>• Start with easier hints and progress to harder ones</li>
            <li>• Avoid giving away the answer directly</li>
            <li>• Consider the point cost based on hint helpfulness</li>
          </ul>
        </div>
      </div>
    );
  };

  // Theme Customization Step
  const ThemeCustomizationStep = () => {
    const [tagInput, setTagInput] = useState('');

    const addTag = () => {
      if (!tagInput.trim() || (puzzleData.tags || []).includes(tagInput.trim())) return;

      updatePuzzleData({
        tags: [...(puzzleData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
      updatePuzzleData({
        tags: puzzleData.tags?.filter(tag => tag !== tagToRemove) || []
      });
    };

    const predefinedTags = [
      'easy', 'medium', 'hard', 'beginner', 'advanced',
      'technology', 'science', 'nature', 'culture',
      'educational', 'fun', 'challenging', 'quick'
    ];

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={puzzleData.category?.id || ''}
            onChange={(e) => {
              const selected = e.target.value;
              if (selected) {
                // In a real implementation, this would load categories from a predefined list
                updatePuzzleData({
                  category: {
                    id: selected,
                    name: selected.charAt(0).toUpperCase() + selected.slice(1),
                    description: `Puzzles related to ${selected}`,
                    icon: '📚',
                    color: '#6B7280',
                    isPublic: true
                  }
                });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="technology">Technology</option>
            <option value="science">Science</option>
            <option value="nature">Nature</option>
            <option value="culture">Culture</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value.toLowerCase())}
              placeholder="Add a tag"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
            />
            <button
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>

          {/* Current tags */}
          {puzzleData.tags && puzzleData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {puzzleData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Predefined tags */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (!puzzleData.tags?.includes(tag)) {
                      updatePuzzleData({
                        tags: [...(puzzleData.tags || []), tag]
                      });
                    }
                  }}
                  disabled={puzzleData.tags?.includes(tag)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 disabled:bg-blue-100 disabled:text-blue-700 disabled:border-blue-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme (Optional)
          </label>
          <input
            type="text"
            value={puzzleData.theme || ''}
            onChange={(e) => updatePuzzleData({ theme: e.target.value })}
            placeholder="e.g., Space Exploration, Medieval Times, Ocean Adventure"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  };

  // Testing Step
  const TestingStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Test Your Puzzle</h3>
          <p className="text-gray-600 mb-6">
            Run automated tests to check puzzle quality and identify potential issues
          </p>

          <button
            onClick={testPuzzle}
            disabled={isTesting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Tests</span>
              </>
            )}
          </button>
        </div>

        {testResults && (
          <div className="space-y-4">
            {/* Overall Score */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Overall Score</h4>
                <span className="text-2xl font-bold text-blue-600">{testResults.overallScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${testResults.overallScore}%` }}
                ></div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Avg. Time</span>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  {Math.round(testResults.averageCompletionTime)}s
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Target className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Success Rate</span>
                </div>
                <p className="text-lg font-semibold text-gray-700">
                  {Math.round(testResults.successRate * 100)}%
                </p>
              </div>
            </div>

            {/* Feedback */}
            {testResults.feedback.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Test Feedback</h4>
                <div className="space-y-2">
                  {testResults.feedback.map((feedback, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-blue-700 capitalize">{feedback.category.replace('_', ' ')}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < feedback.score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {testResults.recommendations.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-3">Recommendations</h4>
                <div className="space-y-2">
                  {testResults.recommendations.map((rec, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-yellow-800 capitalize">{rec.type}:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-yellow-700">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Publishing Step
  const PublishingStep = () => {
    const handlePublish = async () => {
      try {
        const success = await publishPuzzle(publishMode === 'public');
        if (success) {
          // Show success message and potentially redirect
          alert(`Puzzle successfully published as ${publishMode}!`);
          if (onClose) onClose();
        }
      } catch (error) {
        alert(`Publishing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Publish!</h3>
          <p className="text-gray-600">
            Your puzzle is complete. Choose how you'd like to share it with the community.
          </p>
        </div>

        {/* Puzzle Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Puzzle Summary</h4>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-600">Title:</dt>
              <dd className="font-medium">{puzzleData.title}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Word:</dt>
              <dd className="font-medium">{puzzleData.targetWord}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Difficulty:</dt>
              <dd className="font-medium capitalize">{puzzleData.difficulty}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Hints:</dt>
              <dd className="font-medium">{puzzleData.hints?.length || 0}</dd>
            </div>
          </dl>
        </div>

        {/* Publishing Options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Publishing Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="private"
                  checked={publishMode === 'private'}
                  onChange={(e) => setPublishMode(e.target.value as 'private')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Private</div>
                  <div className="text-sm text-gray-600">Only you can play this puzzle</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  value="public"
                  checked={publishMode === 'public'}
                  onChange={(e) => setPublishMode(e.target.value as 'public')}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Public</div>
                  <div className="text-sm text-gray-600">Share with the community (requires approval)</div>
                </div>
              </label>
            </div>
          </div>

          {publishMode === 'public' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-900">Public Publishing</span>
              </div>
              <p className="text-sm text-yellow-700">
                Your puzzle will be submitted for moderation review. This process typically takes 24-48 hours.
                Make sure your puzzle meets community guidelines before submitting.
              </p>
            </div>
          )}
        </div>

        {/* Publish Button */}
        <div className="flex justify-center">
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isPublishing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Publish {publishMode === 'public' ? 'Publicly' : 'Privately'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Puzzle Creator</h1>
              <p className="text-sm text-gray-600">Create your own PathWordle puzzle</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Save Status */}
            <div className="flex items-center space-x-2 text-sm">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600">Saving...</span>
                </>
              ) : lastSaveTime ? (
                <>
                  <Save className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Saved {lastSaveTime.toLocaleTimeString()}</span>
                </>
              ) : null}
            </div>

            {/* Progress */}
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-1"
            >
              <Sparkles className="w-4 h-4" />
              <span>Templates</span>
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCurrent = currentStep === step.id;
              const isCompleted = isStepComplete;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'bg-blue-100 text-blue-700'
                      : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={previousStep}
              disabled={currentStep === 'basic_info'}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextStep}
              disabled={!canProceed}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderStepContent()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="space-y-6">
            {/* Community Stats */}
            {communityStats && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Community Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Puzzles:</span>
                    <span className="font-medium">{communityStats.totalPuzzles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Public Puzzles:</span>
                    <span className="font-medium">{communityStats.publicPuzzles.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Rating:</span>
                    <span className="font-medium">⭐ {communityStats.averageRating}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Keyboard Shortcuts */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <HelpCircle className="w-4 h-4 mr-2" />
                Keyboard Shortcuts
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Save:</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+S</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Test:</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+T</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Undo:</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+Z</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Navigate:</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl+←→</kbd>
                </div>
              </div>
            </div>

            {/* Difficulty Analysis */}
            {tools.difficultyAnalyzer.overallDifficulty > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Difficulty Analysis
                </h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${tools.difficultyAnalyzer.overallDifficulty * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {tools.difficultyAnalyzer.overallDifficulty}/10
                      </span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Suggested: </span>
                    <span className="font-medium capitalize">
                      {tools.difficultyAnalyzer.suggestedDifficulty}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Choose a Template</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid gap-4">
                {/* Would render templates here */}
                <div className="text-center py-8 text-gray-500">
                  Template selection will be implemented here
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Editor Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Auto-save</label>
                  <input
                    type="checkbox"
                    checked={editorSettings.autoSave}
                    onChange={(e) => setEditorSettings({ ...editorSettings, autoSave: e.target.checked })}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show grid</label>
                  <input
                    type="checkbox"
                    checked={editorSettings.showGrid}
                    onChange={(e) => setEditorSettings({ ...editorSettings, showGrid: e.target.checked })}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Snap to grid</label>
                  <input
                    type="checkbox"
                    checked={editorSettings.snapToGrid}
                    onChange={(e) => setEditorSettings({ ...editorSettings, snapToGrid: e.target.checked })}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Sound effects</label>
                  <input
                    type="checkbox"
                    checked={editorSettings.soundEnabled}
                    onChange={(e) => setEditorSettings({ ...editorSettings, soundEnabled: e.target.checked })}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PuzzleCreator;