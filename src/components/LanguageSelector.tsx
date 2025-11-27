import React, { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { ChevronDown, Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  compact?: boolean;
  showFlag?: boolean;
  showName?: boolean;
  className?: string;
  onChange?: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  compact = false,
  showFlag = true,
  showName = true,
  className = '',
  onChange
}) => {
  const { language, setLanguage, availableLanguages, languageNames, languageFlags } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as any);
    setIsOpen(false);
    onChange?.(newLanguage);
  };

  const currentLanguage = availableLanguages.find(lang => lang.isCurrent);

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select language"
        >
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">
            {currentLanguage?.name || 'Language'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
            <div className="max-h-64 overflow-y-auto">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left focus:outline-none focus:bg-gray-50"
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium text-gray-900">{lang.name}</span>
                  {lang.isCurrent && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-600" />
        Select Language
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
              lang.isCurrent
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {showFlag && (
              <span className="text-2xl flex-shrink-0">{lang.flag}</span>
            )}

            <div className="flex-1 text-left">
              {showName && (
                <div className="font-medium text-gray-900">{lang.name}</div>
              )}
              <div className="text-sm text-gray-500">{lang.code.toUpperCase()}</div>
            </div>

            {lang.isCurrent && (
              <div className="flex-shrink-0">
                <Check className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Language preferences are saved automatically and will be used on your next visit.
        </p>
      </div>
    </div>
  );
};

// Language switcher for navigation bar
export const LanguageSwitcher: React.FC<{
  className?: string;
  showCurrentOnly?: boolean;
}> = ({ className = '', showCurrentOnly = false }) => {
  const { language, availableLanguages, setLanguage } = useI18n();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentLanguage = availableLanguages.find(lang => lang.isCurrent);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as any);
    setIsDropdownOpen(false);
  };

  if (showCurrentOnly) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium text-gray-700">{currentLanguage?.name}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Language selector"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
          <div className="py-1">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 ${
                  lang.isCurrent ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {lang.isCurrent && <Check className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Language indicator for mobile
export const LanguageIndicator: React.FC<{
  className?: string;
  onClick?: () => void;
}> = ({ className = '', onClick }) => {
  const { language, languageFlags } = useI18n();

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-label={`Current language: ${language}`}
    >
      <span className="text-xl">{languageFlags[language]}</span>
    </button>
  );
};

export default LanguageSelector;