// This utility dynamically loads jsPDF and html2canvas from a CDN with fallbacks.
interface CustomWindow extends Window {
  jspdf?: any;
  html2canvas?: any;
}
declare const window: CustomWindow;

const LIBRARIES = {
  jspdf: {
    urls: [
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
      'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
    ],
    isLoaded: () => !!window.jspdf,
  },
  html2canvas: {
    urls: [
      'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
      'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
    ],
    isLoaded: () => !!window.html2canvas,
  },
};

type LibraryName = keyof typeof LIBRARIES;

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.head.appendChild(script);
  });
};

const loadLibraryWithFallbacks = async (libName: LibraryName): Promise<void> => {
  const lib = LIBRARIES[libName];
  if (lib.isLoaded()) {
    return;
  }

  for (const url of lib.urls) {
    try {
      await loadScript(url);
      // If script loads and library is available on window, we are done.
      if (lib.isLoaded()) return;
    } catch (error) {
      console.warn(`Failed to load ${libName} from ${url}. Trying next fallback...`);
    }
  }

  // If the loop completes without returning, all URLs failed.
  throw new Error(`Failed to load ${libName} from all available sources.`);
};

const ensureLibrariesLoaded = async (): Promise<void> => {
  try {
    // Load libraries in parallel
    await Promise.all([
      loadLibraryWithFallbacks('html2canvas'),
      loadLibraryWithFallbacks('jspdf'),
    ]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to load one or more PDF generation libraries:", errorMessage);
    alert(`Sorry, a required library for PDF generation could not be loaded. This can be caused by a network issue or an ad-blocker.\n\nError details: ${errorMessage}\n\nPlease try again after checking your connection or ad-blocker settings.`);
    // Re-throw to be caught by the calling function
    throw new Error("PDF generation library failed to load.");
  }
};

export const generatePdf = async (elementId: string, filename: string): Promise<void> => {
  await ensureLibrariesLoaded();
  
  if (!window.html2canvas || !window.jspdf) {
    const errorMsg = "PDF generation libraries could not be initialized correctly. This might be due to a network issue or an ad-blocker.";
    console.error(errorMsg);
    alert("Sorry, there was an unexpected issue with the PDF generation libraries. Please try refreshing the page or checking your ad-blocker settings.");
    throw new Error(errorMsg);
  }

  const element = document.getElementById(elementId);
  if (!element) {
    const errorMsg = `Element with id "${elementId}" not found for PDF generation.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const { jsPDF } = window.jspdf;
  const button = element.querySelector<HTMLElement>('.download-pdf-button');
  
  // Use visibility to hide the button without causing a layout shift
  if (button) button.style.visibility = 'hidden';

  try {
    const canvas = await window.html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false, // Suppress verbose logging from html2canvas
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true, // Compress PDF for smaller file size
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add the first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    // Add subsequent pages if the content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);

  } catch (error) {
    console.error("Error during PDF generation process:", error);
    alert("An error occurred while generating the PDF. The report might contain elements that could not be captured correctly.");
    // Re-throw the error so the calling component can handle its state
    throw error;
  } finally {
    // Ensure the button is always made visible again
    if (button) button.style.visibility = 'visible';
  }
};