// This utility assumes that jsPDF and html2canvas are loaded from a CDN.
// We declare them here to satisfy TypeScript.
declare const jspdf: any;
declare const html2canvas: any;

export const generatePdf = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found.`);
    return;
  }
  
  const { jsPDF } = jspdf;
  
  try {
    // Hide the download button during capture
    const button = element.querySelector<HTMLElement>('.download-pdf-button');
    if (button) button.style.display = 'none';

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      backgroundColor: '#ffffff', // Match the app's background
      useCORS: true,
    });
    
    // Show the button again after capture
    if (button) button.style.display = 'flex';

    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    // Ensure button is visible even if there's an error
    const button = element.querySelector<HTMLElement>('.download-pdf-button');
    if (button) button.style.display = 'flex';
  }
};