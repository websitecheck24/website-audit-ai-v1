import React from 'react';
import type { AuditResult } from '../types';

interface OpportunityCardProps {
  audit: AuditResult;
  t: (key: string) => string;
}

const ParseMarkdownLink: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return (
    <>
      {parts.map((part, index) => {
        const match = /\[(.*?)\]\((.*?)\)/.exec(part);
        if (match) {
          const [, linkText, url] = match;
          return (
            <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">
              {linkText}
            </a>
          );
        }
        return part;
      })}
    </>
  );
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ audit, t }) => {
  const savingsMs = audit.details?.overallSavingsMs ?? 0;

  const getSeverity = () => {
    if (savingsMs > 2000) return { text: t('severity_high'), bg: 'bg-red-100', textColor: 'text-red-800' };
    if (savingsMs > 500) return { text: t('severity_medium'), bg: 'bg-yellow-100', textColor: 'text-yellow-800' };
    return null;
  };

  const severity = getSeverity();

  return (
    <div className="border border-gray-200 bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
        <h4 className="font-semibold text-gray-800">{audit.title}</h4>
        <div className="flex items-center gap-4">
          {severity && (
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${severity.bg} ${severity.textColor}`}>
              {severity.text}
            </span>
          )}
          <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {t('potential_savings')}: <span className="font-bold text-green-600">{(savingsMs / 1000).toFixed(2)}s</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        <ParseMarkdownLink text={audit.description} />
      </p>
    </div>
  );
};