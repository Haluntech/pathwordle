import React, { useState, useRef, useCallback, useMemo } from 'react';
import { GameHistory } from '../types/statistics';
import {
  Share2,
  Download,
  Twitter,
  Facebook,
  MessageCircle,
  Mail,
  Copy,
  Check,
  Trophy,
  Star,
  Zap,
  Target,
  Heart,
  Gamepad2,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  X
} from 'lucide-react';

interface ShareResultCardProps {
  gameData: {
    mode: 'daily' | 'practice' | 'timed';
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    targetWord: string;
    won: boolean;
    attemptsUsed: number;
    timeTaken: number;
    score: number;
    perfectGame?: boolean;
    maxStreak?: number;
    hintsUsed?: number;
    date: string;
    shareEmoji?: string[];
  };
  onClose?: () => void;
  showPreview?: boolean;
}

// Predefined emoji sets for different game outcomes
const EMOJI_SETS = {
  perfect_won: ['🏆', '🎯', '⭐', '🔥', '💯'],
  won: ['🎮', '🎉', '🏅', '✨', '🎊'],
  lost: ['💪', '🎯', '📈', '🌟', '💭']
};

const ShareResultCard: React.FC<ShareResultCardProps> = ({
  gameData,
  onClose,
  showPreview = true
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'default' | 'dark' | 'colorful' | 'minimal'>('default');
  const [cardStyle, setCardStyle] = useState<'classic' | 'modern' | 'playful' | 'professional'>('classic');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Determine emoji set based on game result
  const emojiSet = useMemo(() => {
    if (gameData.perfectGame) return EMOJI_SETS.perfect_won;
    return gameData.won ? EMOJI_SETS.won : EMOJI_SETS.lost;
  }, [gameData.perfectGame, gameData.won]);

  // Format time taken
  const formatTime = useCallback((seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }, []);

  // Get difficulty color and label
  const difficultyInfo = useMemo(() => {
    const difficulties = {
      easy: { label: 'Easy', color: 'text-green-600', bgColor: 'bg-green-100', emoji: '🌱' },
      medium: { label: 'Medium', color: 'text-blue-600', bgColor: 'bg-blue-100', emoji: '⚡' },
      hard: { label: 'Hard', color: 'text-red-600', bgColor: 'bg-red-100', emoji: '🔥' },
      expert: { label: 'Expert', color: 'text-purple-600', bgColor: 'bg-purple-100', emoji: '💎' }
    };
    return difficulties[gameData.difficulty];
  }, [gameData.difficulty]);

  // Generate shareable text
  const shareableText = useMemo(() => {
    const mode = gameData.mode === 'daily' ? 'Daily' : 'Practice';
    const result = gameData.won ? 'Won' : 'Lost';
    const perfect = gameData.perfectGame ? ' Perfect!' : '';

    return `PathWordle ${mode} ${result}${perfect} 🎮\n` +
           `Difficulty: ${difficultyInfo.emoji} ${difficultyInfo.label}\n` +
           `Score: ${gameData.score} points\n` +
           `Attempts: ${gameData.attemptsUsed}/6\n` +
           `Time: ${formatTime(gameData.timeTaken)}\n` +
           `${gameData.maxStreak ? `Streak: ${gameData.maxStreak} 🔥\n` : ''}` +
           `${gameData.shareEmoji ? gameData.shareEmoji.join(' ') + '\n' : emojiSet.join(' ')}\n` +
           `#PathWordle #WordGame #Puzzle`;
  }, [gameData, difficultyInfo, formatTime, emojiSet]);

  // Canvas-based card generation
  const generateCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Background gradient based on theme
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    switch (selectedTheme) {
      case 'dark':
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        break;
      case 'colorful':
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        break;
      case 'minimal':
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f3f4f6');
        break;
      default:
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#1e40af');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = selectedTheme === 'minimal' ? '#e5e7eb' : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    // Title
    ctx.fillStyle = selectedTheme === 'minimal' ? '#1f2937' : '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PathWordle', canvas.width / 2, 80);

    // Game mode
    ctx.font = '24px Arial';
    ctx.fillText(gameData.mode === 'daily' ? 'Daily Challenge' : 'Practice Mode', canvas.width / 2, 120);

    // Result
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = gameData.won ? '#10b981' : '#ef4444';
    ctx.fillText(gameData.won ? '🎉 Victory!' : '💪 Keep Trying!', canvas.width / 2, 180);

    // Target word (show only if won or in practice mode)
    if (gameData.won || gameData.mode === 'practice') {
      ctx.font = 'bold 42px Arial';
      ctx.fillStyle = selectedTheme === 'minimal' ? '#1f2937' : '#ffffff';
      ctx.fillText(gameData.targetWord.toUpperCase(), canvas.width / 2, 240);
    }

    // Stats
    ctx.font = '20px Arial';
    ctx.fillStyle = selectedTheme === 'minimal' ? '#6b7280' : '#e5e7eb';

    const stats = [
      `Score: ${gameData.score} points`,
      `Attempts: ${gameData.attemptsUsed}/6`,
      `Time: ${formatTime(gameData.timeTaken)}`,
      `Difficulty: ${difficultyInfo.emoji} ${difficultyInfo.label}`
    ];

    stats.forEach((stat, index) => {
      ctx.fillText(stat, canvas.width / 2, 300 + (index * 35));
    });

    // Emoji representation
    ctx.font = '32px Arial';
    ctx.fillText(emojiSet.join(' '), canvas.width / 2, 470);

    // Date
    ctx.font = '16px Arial';
    ctx.fillStyle = selectedTheme === 'minimal' ? '#9ca3af' : '#d1d5db';
    ctx.fillText(new Date(gameData.date).toLocaleDateString(), canvas.width / 2, 530);

    // Website URL
    ctx.font = '18px Arial';
    ctx.fillText('play.pathwordle.com', canvas.width / 2, 560);

    return canvas.toDataURL('image/png');
  }, [gameData, selectedTheme, difficultyInfo, formatTime, emojiSet]);

  // Download card as image
  const downloadCard = useCallback(() => {
    const dataUrl = generateCard();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `pathwordle-${gameData.mode}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, [generateCard, gameData.mode]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareableText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }, [shareableText]);

  // Share on social media
  const shareOnTwitter = useCallback(() => {
    const text = encodeURIComponent(shareableText);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, '_blank', 'width=550,height=420');
  }, [shareableText]);

  const shareOnFacebook = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
  }, []);

  const shareViaEmail = useCallback(() => {
    const subject = encodeURIComponent('Check out my PathWordle result!');
    const body = encodeURIComponent(shareableText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [shareableText]);

  // Generate preview card
  const PreviewCard = useMemo(() => (
    <div className={`rounded-lg border-4 p-6 text-center ${
      selectedTheme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' :
      selectedTheme === 'colorful' ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-pink-600 text-white' :
      selectedTheme === 'minimal' ? 'bg-white border-gray-200 text-gray-800' :
      'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 text-white'
    }`}>
      <h3 className="text-2xl font-bold mb-2">PathWordle</h3>
      <p className="text-lg mb-4 opacity-90">
        {gameData.mode === 'daily' ? 'Daily Challenge' : 'Practice Mode'}
      </p>

      <div className="text-3xl font-bold mb-4">
        {gameData.won ? '🎉 Victory!' : '💪 Keep Trying!'}
      </div>

      {(gameData.won || gameData.mode === 'practice') && (
        <div className="text-2xl font-mono mb-6 tracking-widest">
          {gameData.targetWord.toUpperCase()}
        </div>
      )}

      <div className="space-y-2 text-sm">
        <div>Score: {gameData.score} points</div>
        <div>Attempts: {gameData.attemptsUsed}/6</div>
        <div>Time: {formatTime(gameData.timeTaken)}</div>
        <div>Difficulty: {difficultyInfo.emoji} {difficultyInfo.label}</div>
      </div>

      <div className="text-2xl mt-4 mb-2">
        {emojiSet.join(' ')}
      </div>

      <div className="text-xs opacity-75">
        {new Date(gameData.date).toLocaleDateString()}
      </div>
    </div>
  ), [gameData, selectedTheme, difficultyInfo, formatTime, emojiSet]);

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Share Your Result</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview Section */}
        {showPreview && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>

            {/* Theme Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {(['default', 'dark', 'colorful', 'minimal'] as const).map(theme => (
                  <button
                    key={theme}
                    onClick={() => setSelectedTheme(theme)}
                    className={`px-3 py-2 rounded-lg border-2 transition-all ${
                      selectedTheme === theme
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="capitalize">{theme}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Preview */}
            <div className="transform scale-75 origin-top">
              {PreviewCard}
            </div>

            {/* Canvas for image generation (hidden) */}
            <canvas
              ref={canvasRef}
              className="hidden"
              width="800"
              height="600"
            />
          </div>
        )}

        {/* Share Options Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Options</h3>

          {/* Shareable Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Share Text</label>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 font-mono whitespace-pre-line">
              {shareableText}
            </div>
            <button
              onClick={copyToClipboard}
              className={`mt-2 w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 inline-block mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 inline-block mr-2" />
                  Copy Text
                </>
              )}
            </button>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={shareOnTwitter}
              className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Twitter className="w-5 h-5" />
              Share on Twitter
            </button>

            <button
              onClick={shareOnFacebook}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Facebook className="w-5 h-5" />
              Share on Facebook
            </button>

            <button
              onClick={shareViaEmail}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Share via Email
            </button>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadCard}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download as Image
          </button>

          {/* Statistics Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Game Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Score: {gameData.score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Accuracy: {Math.round((6 - gameData.attemptsUsed + 1) / 6 * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Time: {formatTime(gameData.timeTaken)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Difficulty: {difficultyInfo.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareResultCard;