export interface AuditResult {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
  details?: {
    type: 'opportunity' | 'table' | 'debugdata';
    items: any[];
    overallSavingsMs?: number;
    overallSavingsBytes?: number;
  };
}

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
      // Specific audits for easy access
      'first-contentful-paint': AuditResult;
      'largest-contentful-paint': AuditResult;
      'speed-index': AuditResult;
      'cumulative-layout-shift': AuditResult;
      'interactive': AuditResult;
      'total-blocking-time': AuditResult;
      'server-response-time': AuditResult;
      'uses-https': AuditResult;
      'is-crawlable': AuditResult;
      'viewport': AuditResult;
      'font-size': AuditResult;
      'image-aspect-ratio': AuditResult;
      'mainthread-work-breakdown': AuditResult;
      'diagnostics': AuditResult;
      'total-byte-weight': AuditResult;
      'network-requests': AuditResult;
      // Index signature for all other audits
      [key: string]: AuditResult;
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