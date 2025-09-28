
import { useCallback } from 'react';
import { translations } from '../constants';
import type { Language } from '../types';

export const useTranslations = (language: Language) => {
  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return { t };
};
