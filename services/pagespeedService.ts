
import type { PageSpeedAnalysis } from '../types';

const API_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export const analyzeWebsite = async (url: string): Promise<PageSpeedAnalysis> => {
  // Use the mobile strategy for analysis
  const queryUrl = `${API_ENDPOINT}?url=${encodeURIComponent(url)}&strategy=mobile`;
  
  const response = await fetch(queryUrl);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error.message || 'Failed to fetch PageSpeed data');
  }
  
  const data = await response.json();
  return data as PageSpeedAnalysis;
};
