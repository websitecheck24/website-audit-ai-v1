
export interface PageSpeedAnalysis {
  id: string;
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
      seo: { score: number };
    };
    audits: {
      'first-contentful-paint': { displayValue: string; numericValue: number };
      'largest-contentful-paint': { displayValue: string; numericValue: number };
      'speed-index': { displayValue: string; numericValue: number };
      'cumulative-layout-shift': { displayValue: string; numericValue: number };
      'interactive': { displayValue: string; numericValue: number };
      'total-blocking-time': { displayValue: string; numericValue: number };
      'server-response-time': { displayValue: string; numericValue: number };
      'uses-https': { score: number, title: string };
      'is-crawlable': { score: number, title: string };
      'viewport': { score: number, title: string };
      'font-size': { score: number, title: string, details?: { items: any[] } };
      'image-aspect-ratio': { score: number, title: string, details?: { items: any[] } };
      'mainthread-work-breakdown': { details: { items: { group: string, duration: number }[] } };
      'diagnostics': { details: { items: { totalByteSize: number, requestCount: number }[] } }
    };
    finalUrl: string;
  };
}

export type Language = 'en' | 'de';

export type Translations = {
  [key: string]: string;
};

export type TranslationData = {
  [lang in Language]: Translations;
};
