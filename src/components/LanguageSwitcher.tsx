import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'zh', name: '中文', flag: '🇨🇳', native: '中文' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', native: '日本語' },
    { code: 'es', name: 'Español', flag: '🇪🇸', native: 'Español' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', native: 'Français' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', native: 'Deutsch' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', native: '한국어' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-surface-container-low hover:bg-surface-container rounded-lg transition-all cursor-pointer"
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-on-surface">{currentLanguage.name}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-surface-container-highest rounded-lg shadow-xl z-20 min-w-[200px] max-h-[400px] overflow-y-auto border border-surface-container-low">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-container-low transition-colors border-b border-surface-container-low last:border-b-0 ${
                  lang.code === i18n.language ? 'bg-primary/10 text-primary' : 'text-on-surface'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.name}</span>
                  <span className="text-xs text-on-surface-variant">{lang.native}</span>
                </div>
                {lang.code === i18n.language && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
