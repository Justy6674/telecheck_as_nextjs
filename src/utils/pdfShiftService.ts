/**
 * PDFShift Service for HTML to PDF conversion
 *
 * Professional API-based PDF generation solution for healthcare documents.
 * Provides reliable, high-quality PDF output with healthcare formatting.
 *
 * PDFShift Benefits:
 * - No client-side canvas limitations
 * - Better handling of complex HTML/CSS
 * - Consistent PDF output across browsers
 * - Professional healthcare document formatting
 */

interface PDFShiftOptions {
  source: string;
  sandbox?: boolean;
  filename?: string;
  format?: string;
  landscape?: boolean;
  margin?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  header?: {
    source?: string;
    height?: string;
  };
  footer?: {
    source?: string;
    height?: string;
  };
  css?: string;
  javascript?: boolean;
  delay?: number;
}

interface PDFShiftResponse {
  success: boolean;
  data?: Blob;
  error?: string;
  message?: string;
}

export class PDFShiftService {
  private apiKey: string;
  private baseUrl = 'https://api.pdfshift.io/v3/convert/pdf';

  constructor() {
    this.apiKey =
      process.env.NEXT_PUBLIC_PDFSHIFT_API_KEY ??
      process.env.VITE_PDFSHIFT_API_KEY ??
      '';
    if (!this.apiKey) {
      throw new Error('PDFSHIFT API key environment variable is required');
    }
    console.log('✅ PDFShift API Key loaded:', this.apiKey.substring(0, 10) + '...');
  }

  /**
   * Convert HTML content to PDF using PDFShift API
   */
  async convertHtmlToPdf(
    htmlContent: string,
    options: Partial<PDFShiftOptions> = {}
  ): Promise<PDFShiftResponse> {
    try {
      const requestOptions: PDFShiftOptions = {
        source: htmlContent,
        sandbox: false,
        format: 'A4',
        ...options
      };

      console.log('📤 Sending request to PDFShift API...');
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(this.apiKey + ':'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestOptions)
      });

      console.log('📥 PDFShift API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PDFShift API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(`PDFShift API error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const pdfBlob = await response.blob();
      console.log('✅ PDF generated successfully:', {
        size: pdfBlob.size,
        type: pdfBlob.type
      });

      return {
        success: true,
        data: pdfBlob
      };

    } catch (error) {
      console.error('❌ PDFShift conversion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Convert a DOM element to PDF by extracting its HTML
   */
  async convertElementToPdf(
    element: HTMLElement,
    filename: string,
    options: Partial<PDFShiftOptions> = {}
  ): Promise<PDFShiftResponse> {
    try {
      // Extract HTML content and prepare for PDFShift with healthcare styling
      const htmlContent = this.prepareHealthcareHTML(element);

      const result = await this.convertHtmlToPdf(htmlContent, {
        ...options,
        filename,
        css: this.getHealthcarePDFCSS(),
        javascript: false
      });

      return result;

    } catch (error) {
      console.error('Element to PDF conversion failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to convert element to PDF'
      };
    }
  }

  /**
   * Download PDF blob as file
   */
  downloadPDF(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Prepare HTML content for healthcare PDF generation with TeleCheck branding
   */
  private prepareHealthcareHTML(element: HTMLElement): string {
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Add professional healthcare styling with TeleCheck header and footer
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleCheck Professional Healthcare Report</title>
    <style>
        ${this.getHealthcarePDFCSS()}
    </style>
</head>
<body>
    <!-- TeleCheck Professional Header -->
    <div class="telecheck-header">
        <div class="header-left">
            <img src="https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/URL's/telecheckFAVICON.png" alt="TeleCheck" class="logo" />
            <div class="header-text">
                <h1>TeleCheck Professional</h1>
                <p>Medicare Disaster Eligibility Intelligence</p>
            </div>
        </div>
        <div class="header-right">
            <p class="report-date">Generated: ${new Date().toLocaleDateString('en-AU')}</p>
            <p class="report-id">Report ID: RPT-${Date.now().toString(36).toUpperCase()}</p>
        </div>
    </div>

    <!-- Report Content with Two-Column State Layout -->
    <div class="healthcare-report">
        ${clonedElement.outerHTML}
    </div>

    <!-- TeleCheck Professional Footer -->
    <div class="telecheck-footer">
        <div class="footer-content">
            <div class="footer-left">
                <p><strong>TeleCheck Professional</strong> | Medicare Disaster Eligibility Intelligence</p>
                <p>Supporting Australian Healthcare Practitioners | www.telecheck.com.au</p>
            </div>
            <div class="footer-right">
                <p>DISCLAIMER: This report provides data analysis only based on Australian Government</p>
                <p>disaster declarations. Clinical decisions remain at practitioner discretion.</p>
            </div>
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Get professional healthcare CSS for PDF generation with TeleCheck branding
   */
  private getHealthcarePDFCSS(): string {
    return `

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #1f2937;
        background: #ffffff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      /* TeleCheck Professional Header */
      .telecheck-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 3px solid #2563eb;
        margin-bottom: 20px;
        background: #f8fafc;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .logo {
        width: 40px;
        height: 40px;
        object-fit: contain;
      }

      .header-text h1 {
        color: #2563eb;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 2px;
      }

      .header-text p {
        color: #6b7280;
        font-size: 11px;
        font-weight: 500;
      }

      .header-right {
        text-align: right;
        font-size: 10px;
        color: #6b7280;
      }

      .report-date, .report-id {
        margin: 2px 0;
      }

      /* Main Report Content */
      .healthcare-report {
        max-width: 210mm;
        margin: 0 auto;
        padding: 0 20px;
        background: white;
      }

      /* Two-Column State Layout */
      .state-breakdown {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }

      .state-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .state-title {
        font-size: 16px;
        font-weight: 600;
        color: #2563eb;
        margin-bottom: 12px;
        text-align: center;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 8px;
      }

      .state-metrics {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .state-metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
        border-bottom: 1px solid #f3f4f6;
        font-size: 11px;
      }

      .metric-label {
        color: #6b7280;
        font-weight: 500;
      }

      .metric-value {
        color: #111827;
        font-weight: 600;
      }

      /* Australia Summary Section */
      .australia-summary {
        grid-column: 1 / -1;
        background: #f8fafc;
        border: 2px solid #2563eb;
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;
      }

      .australia-title {
        font-size: 18px;
        font-weight: 700;
        color: #2563eb;
        text-align: center;
        margin-bottom: 16px;
        border-bottom: 2px solid #2563eb;
        padding-bottom: 8px;
      }

      /* TeleCheck Professional Footer */
      .telecheck-footer {
        margin-top: 30px;
        padding: 15px 20px;
        border-top: 2px solid #e5e7eb;
        background: #f8fafc;
        font-size: 9px;
        color: #6b7280;
      }

      .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .footer-left p {
        margin: 2px 0;
      }

      .footer-right {
        text-align: right;
        font-style: italic;
      }

      .footer-right p {
        margin: 1px 0;
      }

      /* Header Styling */
      .report-header {
        border-bottom: 3px solid #2563eb;
        padding-bottom: 15px;
        margin-bottom: 25px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .clinic-branding h1 {
        color: #2563eb;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 10px;
      }

      .clinic-details {
        font-size: 11px;
        color: #6b7280;
        line-height: 1.3;
      }

      .report-meta {
        text-align: right;
        font-size: 10px;
        color: #6b7280;
      }

      /* Card Styling */
      .card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .card-header {
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      .card-title {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 8px;
      }

      .card-content {
        padding: 16px;
      }

      /* Badge Styling */
      .badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .badge-green {
        background: #dcfce7;
        color: #166534;
      }

      .badge-yellow {
        background: #fef3c7;
        color: #92400e;
      }

      .badge-red {
        background: #fee2e2;
        color: #991b1b;
      }

      .badge-blue {
        background: #dbeafe;
        color: #1e40af;
      }

      /* Metrics Grid */
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
      }

      .metric-item {
        text-align: center;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        background: #f8fafc;
      }

      .metric-value {
        font-size: 24px;
        font-weight: 700;
        color: #2563eb;
        margin-bottom: 4px;
      }

      .metric-label {
        font-size: 11px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* State Breakdown */
      .state-breakdown {
        margin-bottom: 24px;
      }

      .state-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f3f4f6;
      }

      .state-name {
        font-weight: 600;
        color: #374151;
      }

      .state-stats {
        display: flex;
        gap: 16px;
        font-size: 11px;
        color: #6b7280;
      }

      /* Footer */
      .report-footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 2px solid #e5e7eb;
        font-size: 10px;
        color: #6b7280;
        text-align: center;
      }

      .disclaimer {
        background: #f8fafc;
        padding: 15px;
        border-left: 4px solid #3b82f6;
        margin-top: 20px;
        font-style: italic;
        font-size: 10px;
        line-height: 1.5;
      }

      /* Print Optimizations */
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .healthcare-report {
          margin: 0;
          padding: 15mm;
        }
      }

      /* Dark mode overrides for PDF */
      .dark, .bg-slate-900, .text-white {
        background: #ffffff !important;
        color: #1f2937 !important;
      }

      .text-slate-300, .text-slate-400 {
        color: #6b7280 !important;
      }

      .bg-slate-800 {
        background: #f9fafb !important;
      }

      /* Icon replacements for PDF */
      .lucide, .lucide-icon {
        display: none;
      }
    `;
  }
}

// Export singleton instance
export const pdfShiftService = new PDFShiftService();