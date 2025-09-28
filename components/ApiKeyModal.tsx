import React, { useState } from 'react';

interface ApiKeyModalProps {
  t: (key: string) => string;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
  reason?: 'user' | 'quota' | 'invalid_key';
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ t, onClose, onSave, currentKey, reason }) => {
  const [apiKey, setApiKey] = useState(currentKey);

  const handleSave = () => {
    onSave(apiKey);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('api_key_modal_title')}</h3>
        
        {reason === 'quota' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 text-sm mb-4 rounded-r-md">
            <p>{t('api_key_modal_quota_reason')}</p>
          </div>
        )}

        {reason === 'invalid_key' && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-3 text-sm mb-4 rounded-r-md">
            <p>{t('api_key_modal_invalid_key_reason')}</p>
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">{t('api_key_description')}</p>
        
        <div className="mb-4">
           <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t('api_key_placeholder')}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">{t('api_key_howto_title')}</h4>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>
              {t('api_key_howto_step1_part1')}{' '}
              <a href="https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                {t('api_key_howto_step1_link')}
              </a>.
            </li>
            <li>{t('api_key_howto_step2')}</li>
            <li>{t('api_key_howto_step3')}</li>
            <li>{t('api_key_howto_step4')}</li>
          </ol>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-gray-900 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-700 transition-colors"
        >
          {t('api_key_save')}
        </button>
      </div>
    </div>
  );
};