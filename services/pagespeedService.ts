import type { PageSpeedAnalysis } from '../types';

const API_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export const analyzeWebsite = async (url: string, apiKey?: string): Promise<PageSpeedAnalysis> => {
  let queryUrl = `${API_ENDPOINT}?url=${encodeURIComponent(url)}&strategy=mobile`;
  if (apiKey) {
    queryUrl += `&key=${apiKey}`;
  }

  let response: Response;
  try {
    response = await fetch(queryUrl);
  } catch (error) {
    // Catches network errors (e.g., 'Failed to fetch')
    console.error('Network error:', error);
    throw new Error('Network error: Failed to fetch');
  }

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      // Use the specific message from the API
      errorMessage = errorData.error.message || 'Failed to fetch PageSpeed data';
    } catch (e) {
      // Response was not JSON, use the status text
      errorMessage = response.statusText || 'An unexpected server error occurred';
    }
    throw new Error(errorMessage);
  }
  
  const data = await response.json();

  // A successful request might not have lighthouseResult if the URL couldn't be resolved or timed out.
  // The error message from the API is often inside data.error in this case.
  if (data.error || !data.lighthouseResult) {
      const apiErrorMessage = data.error?.message || 'Lighthouse analysis could not be completed.';
      // Make the message more user-friendly
      if (apiErrorMessage.includes('DNS_FAILURE') || apiErrorMessage.includes('UNREACHABLE')) {
        throw new Error('URL is unreachable or invalid. Could not resolve the domain.');
      }
      throw new Error(apiErrorMessage);
  }

  return data as PageSpeedAnalysis;
};