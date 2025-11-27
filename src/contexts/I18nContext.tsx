import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  TranslationKeys,
  translations,
  defaultLanguage,
  supportedLanguages,
  languageNames,
  languageFlags,
  detectLanguage,
  setLanguage as setI18nLanguage,
  translate,
  pluralize,
  formatDate,
  formatNumber,
  formatTime,
  formatRelativeTime
} from '../i18n';

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
  tn: (key: string, count: number, fallback?: string) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatTime: (seconds: number, showHours?: boolean) => string;
  formatRelativeTime: (date: Date, now?: Date) => string;
  isRTL: boolean;
  supportedLanguages: Language[];
  languageNames: Record<Language, string>;
  languageFlags: Record<Language, string>;
  availableLanguages: Array<{
    code: Language;
    name: string;
    flag: string;
    isCurrent: boolean;
  }>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLanguage: userDefaultLanguage,
  storageKey = 'pathwordle_language'
}) => {
  const [language, setLanguageState] = useState<Language>(
    userDefaultLanguage || detectLanguage()
  );

  // RTL languages list
  const rtlLanguages: Language[] = []; // Add RTL languages like 'ar', 'he' here
  const isRTL = rtlLanguages.includes(language);

  // Change language handler
  const setLanguage = (newLanguage: Language) => {
    if (!supportedLanguages.includes(newLanguage)) {
      console.warn(`Language "${newLanguage}" is not supported`);
      return;
    }

    setLanguageState(newLanguage);
    setI18nLanguage(newLanguage);

    // Save to localStorage
    localStorage.setItem(storageKey, newLanguage);

    // Trigger a custom event for components that might need to re-render
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: newLanguage }
    }));
  };

  // Translation functions
  const t = (key: string, fallback?: string): string => {
    return translate(language, key, fallback);
  };

  const tn = (key: string, count: number, fallback?: string): string => {
    return pluralize(language, key, count, fallback);
  };

  // Format functions
  const formatDateFn = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return formatDate(language, date, options);
  };

  const formatNumberFn = (number: number, options?: Intl.NumberFormatOptions): string => {
    return formatNumber(language, number, options);
  };

  const formatTimeFn = (seconds: number, showHours = false): string => {
    return formatTime(language, seconds, showHours);
  };

  const formatRelativeTimeFn = (date: Date, now = new Date()): string => {
    return formatRelativeTime(language, date, now);
  };

  // Available languages with metadata
  const availableLanguages = supportedLanguages.map(lang => ({
    code: lang,
    name: languageNames[lang],
    flag: languageFlags[lang],
    isCurrent: lang === language
  }));

  // Initialize language on mount
  useEffect(() => {
    // Check if we have a stored language preference
    const storedLanguage = localStorage.getItem(storageKey) as Language;

    if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
      setLanguage(storedLanguage);
    } else {
      // Use detected language
      const detected = detectLanguage();
      setLanguage(detected);
    }
  }, [storageKey]);

  // Listen for system language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const detected = detectLanguage();
      // Only change language if no explicit preference is set
      if (!localStorage.getItem(storageKey)) {
        setLanguage(detected);
      }
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, [storageKey]);

  // Update HTML attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

    // Add language class to body for CSS targeting
    document.body.className = document.body.className
      .replace(/lang-\w+/g, '')
      .trim();
    document.body.classList.add(`lang-${language}`);
  }, [language, isRTL]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    tn,
    formatDate: formatDateFn,
    formatNumber: formatNumberFn,
    formatTime: formatTimeFn,
    formatRelativeTime: formatRelativeTimeFn,
    isRTL,
    supportedLanguages,
    languageNames,
    languageFlags,
    availableLanguages
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use i18n context
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Higher-order component for automatic translation
export const withTranslation = <P extends object>(
  Component: React.ComponentType<P>,
  translationNamespace?: string
) => {
  const WithTranslationComponent = React.forwardRef<any, P>((props, ref) => {
    const { t } = useI18n();

    // Create a translation function that prefixes with namespace if provided
    const translateWithNamespace = (key: string, fallback?: string) => {
      const fullKey = translationNamespace ? `${translationNamespace}.${key}` : key;
      return t(fullKey, fallback);
    };

    return <Component {...props} ref={ref} t={translateWithNamespace} />;
  });

  WithTranslationComponent.displayName = `withTranslation(${
    Component.displayName || Component.name
  })`;

  return WithTranslationComponent;
};

// Utility for creating translated components
export const createTranslatedComponent = <P extends object>(
  Component: React.ComponentType<P & { translations: Partial<TranslationKeys> }>
) => {
  return React.forwardRef<any, P>((props, ref) => {
    const { language } = useI18n();
    const translations = translations[language];

    return <Component {...props} ref={ref} translations={translations} />;
  });
};

// Translation hook for specific namespaces
export const useTranslation = (namespace?: string) => {
  const { t, tn, ...rest } = useI18n();

  const translateWithNamespace = (key: string, fallback?: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return t(fullKey, fallback);
  };

  const pluralizeWithNamespace = (key: string, count: number, fallback?: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return tn(fullKey, count, fallback);
  };

  return {
    t: translateWithNamespace,
    tn: pluralizeWithNamespace,
    ...rest
  };
};

export default I18nContext;