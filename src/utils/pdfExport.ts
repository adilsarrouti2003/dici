import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportPdfFromElements(
  page1ElementId: string,
  page2ElementId: string,
  filename: string = '90-Days-Habit-Tracker.pdf'
): Promise<void> {
  const p1 = document.getElementById(page1ElementId);
  const p2 = document.getElementById(page2ElementId);

  if (!p1 || !p2) {
    // Fallback if elements not in DOM
    window.print();
    return;
  }

  // Temporarily ensure elements are rendered for capturing
  const originalDisplay1 = p1.style.display;
  const originalDisplay2 = p2.style.display;
  p1.style.display = 'block';
  p2.style.display = 'block';

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Capture Page 1
    const canvas1 = await html2canvas(p1, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1000,
    });
    const img1 = canvas1.toDataURL('image/jpeg', 0.95);
    pdf.addImage(img1, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

    // Capture Page 2
    const canvas2 = await html2canvas(p2, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1000,
    });
    const img2 = canvas2.toDataURL('image/jpeg', 0.95);
    pdf.addPage();
    pdf.addImage(img2, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

    pdf.save(filename);
  } catch (err) {
    console.warn('html2canvas PDF export failed, falling back to print dialog:', err);
    window.print();
  } finally {
    p1.style.display = originalDisplay1;
    p2.style.display = originalDisplay2;
  }
}
