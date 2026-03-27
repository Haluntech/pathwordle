import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

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
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 bg-surface-container-low hover:bg-surface-container rounded-lg transition-all cursor-pointer">
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-on-surface">{currentLanguage.name}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute top-full right-0 mt-2 bg-surface-container-highest rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto min-w-[180px] max-h-[400px] overflow-y-auto">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-surface-container-low transition-colors border-b border-surface-container-low last:border-b-0 ${
              lang.code === i18n.language ? 'bg-primary/10 text-primary' : 'text-on-surface'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{lang.name}</span>
              <span className="text-xs text-on-surface-variant">{lang.native}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
