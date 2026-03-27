import React, { useState, useCallback } from 'react';
import { Share2, Twitter, Facebook, Link2, Check, MessageCircle } from 'lucide-react';

interface ShareSystemProps {
  gameResult?: {
    won: boolean;
    attemptsUsed: number;
    word: string;
    timeTaken: number;
  };
  onShare?: (platform: string) => void;
}

// Generate shareable text
const generateShareText = (result: ShareSystemProps['gameResult']) => {
  if (!result) return 'Check out PathWordle - A strategic word puzzle game!';

  const { won, attemptsUsed, word, timeTaken } = result;
  const emoji = won ? '🎉' : '🤔';
  const score = won ? `${6 - attemptsUsed}/6` : 'X/6';

  return `${emoji} PathWordle ${score}

${won ? `I guessed "${word.toUpperCase()}" in ${6 - attemptsUsed} tries!` : `Failed to guess today's word.`}

Can you do better? 🧠

#PathWordle #WordGame #Puzzle`;
};

// Generate share URL
const generateShareURL = () => {
  return 'https://pathwordle.com';
};

// Share platforms configuration
const SHARE_PLATFORMS = {
  twitter: {
    name: 'Twitter',
    icon: Twitter,
    baseUrl: 'https://twitter.com/intent/tweet',
    color: '#1DA1F2',
  },
  facebook: {
    name: 'Facebook',
    icon: Facebook,
    baseUrl: 'https://www.facebook.com/sharer/sharer.php',
    color: '#1877F2',
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: MessageCircle,
    baseUrl: 'https://wa.me/',
    color: '#25D366',
  },
  copy: {
    name: 'Copy Link',
    icon: Link2,
    action: 'copy',
    color: '#6B7280',
  },
};

const ShareSystem: React.FC<ShareSystemProps> = ({ gameResult, onShare }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShare = useCallback(async (platform: keyof typeof SHARE_PLATFORMS) => {
    const shareText = generateShareText(gameResult);
    const shareURL = generateShareURL();

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareURL}`);
        setCopied(true);
        setShowTooltip(true);
        setTimeout(() => {
          setCopied(false);
          setShowTooltip(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = `${shareText}\n\n${shareURL}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      if (onShare) onShare('copy');
      return;
    }

    // Open share dialog for social platforms
    let url = '';
    switch (platform) {
      case 'twitter':
        url = `${SHARE_PLATFORMS.twitter.baseUrl}?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareURL)}`;
        break;
      case 'facebook':
        url = `${SHARE_PLATFORMS.facebook.baseUrl}?u=${encodeURIComponent(shareURL)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        url = `${SHARE_PLATFORMS.whatsapp.baseUrl}?text=${encodeURIComponent(`${shareText}\n\n${shareURL}`)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
    if (onShare) onShare(platform);
  }, [gameResult, onShare]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <Share2 className="w-5 h-5" />
        <span className="text-sm font-medium">Share your result</span>
      </div>

      <div className="flex items-center gap-3">
        {(Object.keys(SHARE_PLATFORMS) as Array<keyof typeof SHARE_PLATFORMS>).map((platform) => {
          const config = SHARE_PLATFORMS[platform];
          const Icon = config.icon;

          return (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className={`relative group p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                platform === 'copy' && copied
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant'
              }`}
              aria-label={`Share on ${config.name}`}
              style={{ backgroundColor: copied ? undefined : config.color + '20' }}
            >
              <Icon className={`w-5 h-5 ${platform === 'copy' && copied ? 'text-on-primary' : ''}`} style={{ color: copied ? undefined : config.color }} />

              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-surface-container-highest rounded text-xs text-on-surface-variant whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {copied ? 'Copied!' : config.name}
              </div>

              {copied && platform === 'copy' && (
                <Check className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-on-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Share motivation message */}
      {gameResult?.won && (
        <p className="text-xs text-on-surface-variant text-center max-w-xs">
          🏆 Challenge your friends to beat your score!
        </p>
      )}
    </div>
  );
};

export default ShareSystem;
