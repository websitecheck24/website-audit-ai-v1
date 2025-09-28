import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { UrlInputForm } from './components/UrlInputForm';
import { Loader } from './components/Loader';
import { Dashboard } from './components/Dashboard';
import { analyzeWebsite } from './services/pagespeedService';
import { PageSpeedAnalysis } from './types';
import { useTranslations } from './hooks/useTranslations';
import type { Language } from './types';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<PageSpeedAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const { t } = useTranslations(language);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    // Add https:// if missing
    let fullUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      fullUrl = `https://${url}`;
    }

    try {
      const data = await analyzeWebsite(fullUrl);
      setAnalysis(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(t('error_message'));
      } else {
        setError(t('error_unknown'));
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header language={language} setLanguage={setLanguage} t={t} />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4">
            {t('main_headline')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            {t('main_subheadline')}
          </p>
        </div>
        
        <UrlInputForm onAnalyze={handleAnalyze} isLoading={isLoading} t={t} />

        <div className="mt-12">
          {isLoading && <Loader t={t} />}
          {error && (
            <div className="text-center bg-red-100 border border-red-200 text-red-800 p-4 rounded-lg max-w-2xl mx-auto">
              <p className="font-semibold">{t('error_title')}</p>
              <p>{error}</p>
            </div>
          )}
          {analysis && (
            <div ref={dashboardRef}>
              <Dashboard data={analysis} t={t} url={analysis.id} />
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500">
        <p>Site Audit Pro. {t('footer_text')}</p>
      </footer>
    </div>
  );
};

export default App;