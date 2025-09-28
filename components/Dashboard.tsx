import React from 'react';
import type { PageSpeedAnalysis } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { MetricCard } from './MetricCard';
import { generatePdf } from '../utils/pdfGenerator';

interface DashboardProps {
  data: PageSpeedAnalysis;
  t: (key: string) => string;
  url: string;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const Dashboard: React.FC<DashboardProps> = ({ data, t, url }) => {
  const { lighthouseResult } = data;
  const categories = lighthouseResult.categories;
  const audits = lighthouseResult.audits;

  const performanceScore = Math.round(categories.performance.score * 100);
  const accessibilityScore = Math.round(categories.accessibility.score * 100);
  const bestPracticesScore = Math.round(categories['best-practices'].score * 100);
  const seoScore = Math.round(categories.seo.score * 100);
  
  const totalByteSize = audits.diagnostics?.details.items[0]?.totalByteSize ?? 0;
  const totalRequests = audits.diagnostics?.details.items[0]?.requestCount ?? 0;
  const jsExecutionTime = audits['mainthread-work-breakdown']?.details.items.find(i => i.group === 'scripting')?.duration ?? 0;

  const handleDownload = () => {
    const domain = new URL(url).hostname;
    generatePdf('audit-dashboard', `site-audit-${domain}`);
  };

  return (
    <div id="audit-dashboard" className="bg-white border border-gray-200 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('dashboard_title')}</h2>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors break-all">
            {new URL(url).hostname}
          </a>
        </div>
        <button onClick={handleDownload} className="download-pdf-button mt-4 sm:mt-0 flex items-center space-x-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>{t('download_pdf')}</span>
        </button>
      </div>

      {/* Overall Scores */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('overall_scores')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <ScoreGauge title={t('performance')} score={performanceScore} />
          <ScoreGauge title={t('accessibility')} score={accessibilityScore} />
          <ScoreGauge title={t('best_practices')} score={bestPracticesScore} />
          <ScoreGauge title={t('seo')} score={seoScore} />
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('core_web_vitals')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <MetricCard title={t('lcp')} value={audits['largest-contentful-paint'].displayValue} description={t('lcp_desc')} />
            <MetricCard title={t('cls')} value={audits['cumulative-layout-shift'].displayValue} description={t('cls_desc')} />
            <MetricCard title={t('tti')} value={audits['interactive'].displayValue} description={t('inp_desc')} />
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('key_metrics')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <MetricCard title={t('fcp')} value={audits['first-contentful-paint'].displayValue} description={t('fcp_desc')} />
            <MetricCard title={t('speed_index')} value={audits['speed-index'].displayValue} description={t('speed_index_desc')} />
            <MetricCard title={t('tbt')} value={audits['total-blocking-time'].displayValue} description={t('tbt_desc')} />
            <MetricCard title={t('server_response_time')} value={audits['server-response-time'].displayValue} description={t('server_response_time_desc')} />
            <MetricCard title={t('https')} value={audits['uses-https'].score === 1 ? t('pass') : t('fail')} description={t('https_desc')} status={audits['uses-https'].score === 1}/>
            <MetricCard title={t('crawlable')} value={audits['is-crawlable'].score === 1 ? t('pass') : t('fail')} description={t('crawlable_desc')} status={audits['is-crawlable'].score === 1}/>
            <MetricCard title={t('mobile_friendly')} value={audits['viewport'].score === 1 ? t('pass') : t('fail')} description={t('mobile_friendly_desc')} status={audits['viewport'].score === 1}/>
            <MetricCard title={t('readable_fonts')} value={audits['font-size'].score === 1 ? t('pass') : t('fail')} description={t('readable_fonts_desc')} status={audits['font-size'].score === 1}/>
            <MetricCard title={t('image_aspect_ratio')} value={audits['image-aspect-ratio'].score === 1 ? t('pass') : t('fail')} description={t('image_aspect_ratio_desc')} status={audits['image-aspect-ratio'].score === 1}/>
        </div>
      </div>

      {/* Page Stats */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900">{t('page_stats')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <MetricCard title={t('total_page_size')} value={formatBytes(totalByteSize)} />
          <MetricCard title={t('total_requests')} value={totalRequests.toString()} />
          <MetricCard title={t('js_execution_time')} value={`${jsExecutionTime.toFixed(2)} ms`} />
        </div>
      </div>
    </div>
  );
};