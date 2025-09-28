import React from 'react';
import type { Language } from '../types';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage, t }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  return (
    <header className="bg-white py-4 px-4 md:px-8 border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 12v6"></path><path d="M16 16.5A4.5 4.5 0 0 0 7.5 12"></path></svg>
          <span className="text-xl font-bold text-gray-900">Site Audit Pro</span>
        </div>
        <button
          onClick={toggleLanguage}
          className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold border border-gray-300 hover:border-gray-400 rounded-md px-3 py-1"
        >
          {t('language_switcher')}
        </button>
      </div>
    </header>
  );
};