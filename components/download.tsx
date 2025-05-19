'use client';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import domtoimage from 'dom-to-image-more';
import { useCallback } from 'react';

interface PdfDocument extends jsPDF {
  lastAutoTable: { finalY: number };
}

const DownloadPDFButton: React.FC = () => {
  const handleDownloadPDF = useCallback(async () => {
    const sourceElement = document.querySelector('#nd-page article .prose');
    if (!sourceElement) return;

    const clone = sourceElement.cloneNode(true) as HTMLElement;
    const divs = clone.querySelectorAll('div');
    if (divs.length > 0) divs[divs.length - 1].remove();
    clone.querySelectorAll('svg').forEach((svg) => svg.remove());

    const cleanNode = (node: HTMLElement) => {
      node.removeAttribute('class');
      const tag = node.tagName.toLowerCase();
      const baseStyles: Partial<CSSStyleDeclaration> = {
        fontFamily: 'Arial, sans-serif',
        color: '#000',
        marginBottom: '8px',
        lineHeight: '1.6',
        maxWidth: '100%',
        wordWrap: 'break-word',
      };

      const tagStyles: Record<string, Partial<CSSStyleDeclaration>> = {
        h1: { fontSize: '24px', fontWeight: 'bold' },
        h2: { fontSize: '20px', fontWeight: 'bold' },
        h3: { fontSize: '18px', fontWeight: 'bold' },
        p: { fontSize: '14px', marginTop: '0px' },
        code: {
          fontSize: '13px',
          backgroundColor: '#f5f5f5',
          padding: '2px 4px',
          borderRadius: '4px',
          fontFamily: 'monospace',
        },
        pre: {
          fontSize: '13px',
          backgroundColor: '#f5f5f5',
          padding: '12px',
          borderRadius: '6px',
          overflowX: 'auto',
        },
        img: {
          maxWidth: '100%',
          height: 'auto',
          margin: '12px 0',
        },
        ul: { paddingLeft: '20px' },
        ol: { paddingLeft: '20px' },
      };

      Object.assign(node.style, baseStyles, tagStyles[tag] || {});
      Array.from(node.children).forEach((child) => cleanNode(child as HTMLElement));
    };

    cleanNode(clone);

    const pdf = new jsPDF() as PdfDocument;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let currentY = 20;

    const checkPageBreak = (height: number) => {
      if (currentY + height >= pageHeight - 20) {
        pdf.addPage();
        currentY = 20;
      }
    };

    // Helper function to handle bold text within strings
    const processText = (text: string) => {
      const parts = text.split(/(<string>|<\/string>)/);
      let result = '';
      let isBold = false;

      parts.forEach((part) => {
        if (part === '<string>') {
          isBold = true;
        } else if (part === '</string>') {
          isBold = false;
        } else if (part.trim()) {
          if (isBold) {
            pdf.setFont('helvetica', 'bold');
            result += part;
            pdf.setFont('helvetica', 'normal');
          } else {
            result += part;
          }
        }
      });

      return result;
    };

    const renderTextWithFormat = (text: string, x: number, y: number, maxWidth: number) => {
      const lines = pdf.splitTextToSize(processText(text), maxWidth);
      pdf.text(lines, x, y);
      return lines.length;
    };

    const processNode = async (element: HTMLElement) => {
      const tag = element.tagName.toLowerCase();

      switch (tag) {
        case 'h1':
        case 'h2':
        case 'h3':
          checkPageBreak(14);
          pdf.setFontSize(tag === 'h1' ? 24 : tag === 'h2' ? 20 : 18);
          pdf.setFont('helvetica', 'bold');
          const headerLines = renderTextWithFormat(element.textContent || '', 15, currentY, pageWidth - 30);
          currentY += 14 * headerLines;
          break;

        case 'p':
          checkPageBreak(10);
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'normal');
          const textLines = renderTextWithFormat(element.textContent || '', 15, currentY, pageWidth - 30);
          currentY += 10 * textLines;
          break;        case 'ul':
        case 'ol':
          Array.from(element.children).forEach((item, idx) => {
            checkPageBreak(10);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'normal');

            // Enhanced list styling
            const bullet = tag === 'ul' ? '•' : `${idx + 1}.`;
            const bulletWidth = pdf.getTextWidth(bullet + ' ');

            // Draw bullet/number
            pdf.text(bullet, 20, currentY);

            // Handle nested paragraph in list items
            let itemText = '';
            if (item.querySelector('p')) {
              // If there's a nested paragraph, get its text content
              itemText = Array.from(item.querySelectorAll('p'))
                .map(p => p.textContent)
                .filter(Boolean)
                .join(' ');
            } else {
              itemText = item.textContent || '';
            }

            // Handle wrapped text in list items
            const lines = pdf.splitTextToSize(processText(itemText.trim()), pageWidth - 35 - bulletWidth);

            // Render list item text
            pdf.text(lines, 20 + bulletWidth, currentY);
            currentY += 8 * lines.length + 4; // Increased spacing between list items for better readability
          });
          currentY += 8; // Added spacing after list
          break;        case 'img': {
          const img = element as HTMLImageElement;
          if (img.src) {
            try {
              // Create a high-quality container for the image
              const container = document.createElement('div');
              container.style.backgroundColor = '#ffffff';
              container.style.padding = '0';
              container.style.display = 'inline-block';
              container.style.width = img.naturalWidth ? `${img.naturalWidth}px` : '800px';
              container.style.height = img.naturalHeight ? `${img.naturalHeight}px` : 'auto';
              
              // Create and style the image clone
              const imgClone = img.cloneNode(true) as HTMLImageElement;
              imgClone.style.width = '100%';
              imgClone.style.height = '100%';
              imgClone.style.objectFit = 'contain';
              imgClone.style.display = 'block';
              container.appendChild(imgClone);
              document.body.appendChild(container);

              // Ensure image is loaded
              await new Promise((resolve) => {
                if (imgClone.complete) {
                  resolve(null);
                } else {
                  imgClone.onload = () => resolve(null);
                  imgClone.onerror = () => resolve(null);
                }
              });

              // Capture image with maximum quality
              const imgData = await domtoimage.toPng(container, {
                quality: 1,
                bgcolor: '#ffffff',
                height: container.offsetHeight * 2,
                width: container.offsetWidth * 2,
                style: {
                  transform: 'scale(2)',
                  transformOrigin: 'top left',
                  width: '100%',
                  height: '100%'
                }
              });

              document.body.removeChild(container);

              // Calculate optimal size for PDF
              const maxWidth = pageWidth - 30;
              const maxHeight = pageHeight - 40;
              
              // Get the actual image dimensions
              const tempImage = new Image();
              await new Promise((resolve) => {
                tempImage.onload = resolve;
                tempImage.src = imgData;
              });
              
              let imgWidth = tempImage.width / 2; // Compensate for the 2x scale
              let imgHeight = tempImage.height / 2;
              
              // Scale to fit page width if needed
              if (imgWidth > maxWidth) {
                const scale = maxWidth / imgWidth;
                imgWidth *= scale;
                imgHeight *= scale;
              }
              
              // Scale to fit page height if needed
              if (imgHeight > maxHeight) {
                const scale = maxHeight / imgHeight;
                imgWidth *= scale;
                imgHeight *= scale;
              }

              // Ensure minimum size
              const minWidth = 100;
              if (imgWidth < minWidth) {
                const scale = minWidth / imgWidth;
                imgWidth *= scale;
                imgHeight *= scale;
              }

              checkPageBreak(imgHeight + 20);

              // Center the image
              const xOffset = (pageWidth - imgWidth) / 2;
              
              // Add image with high quality settings
              pdf.addImage(
                imgData,
                'PNG',
                xOffset,
                currentY,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
              );
              
              currentY += imgHeight + 20;
            } catch (err) {
              console.error('Error processing image:', err);
            }
          }
          break;
        }

        case 'table': {
          const headers = Array.from(element.querySelectorAll('thead th')).map(
            (th) => (th as HTMLElement).textContent || ''
          );
          const rows = Array.from(element.querySelectorAll('tbody tr')).map((tr) =>
            Array.from(tr.querySelectorAll('td')).map(
              (td) => (td as HTMLElement).textContent || ''
            )
          );

          checkPageBreak(20);
          autoTable(pdf, {
            head: [headers],
            body: rows,
            startY: currentY,
            margin: { left: 15, right: 15 },
            styles: { fontSize: 10, cellPadding: 3 },
            theme: 'grid',
          });
          currentY = pdf.lastAutoTable.finalY + 10;
          break;
        }

        default:
          if (!['table', 'img'].includes(tag)) {
            for (const child of Array.from(element.children)) {
              await processNode(child as HTMLElement);
            }
          }
          break;
      }
    };

    try {
      await processNode(clone);
      pdf.save('blog.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
    }
  }, []);

  return (
    <button
      onClick={handleDownloadPDF}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Download PDF
    </button>
  );
};

export default DownloadPDFButton;