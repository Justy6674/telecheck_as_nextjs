import jsPDF from 'jspdf';

interface AnalysisData {
  totalPatients: number;
  totalEligiblePatients: number;
  eligibilityRate: number;
  totalActiveDisasters?: number;
  stateDistribution?: Record<string, any>;
  timeBasedAnalysis?: {
    within12Months?: { count: number; percentage: number };
    between12And24Months?: { count: number; percentage: number };
    over24Months?: { count: number; percentage: number };
  };
  nationalRemotenessBreakdown?: Record<string, number>;
  analysedAt?: string;
}

/**
 * Generate a professional PDF report for clinic analysis
 * 
 * This is the WORKING PDF GENERATOR for TeleCheck Professional Analysis
 * 
 * Features:
 * - Simple client-side generation using jsPDF (no API calls!)
 * - Professional layout matching on-screen report exactly
 * - All 20 metrics included on ONE page
 * - Audit guidance box for Medicare compliance
 * - Complete state distribution with remoteness breakdowns
 * - Proper Australian formatting and terminology
 * 
 * @param clinicName - Name of the clinic/practitioner
 * @param analysisData - Complete analysis results from Enhanced Clinic Analysis V2
 * @param viewMode - If true, returns blob URL for viewing; if false, downloads directly
 */
export function generateSimplePDF(clinicName: string, analysisData: AnalysisData, viewMode = false): string | void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = margin;

  // HEADER - Blue bar
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('TeleCheck Professional Analysis', pageWidth / 2, 12, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Clinic Analysis Report', pageWidth / 2, 20, { align: 'center' });
  
  const reportDate = analysisData.analysedAt 
    ? new Date(analysisData.analysedAt).toLocaleDateString('en-AU')
    : new Date().toLocaleDateString('en-AU');
  doc.text(`${clinicName} • ${reportDate}`, pageWidth / 2, 27, { align: 'center' });

  y = 42;
  doc.setTextColor(0, 0, 0);

  // KEY METRICS - 4 boxes in one row (SMALLER)
  const boxWidth = (pageWidth - (margin * 2) - 9) / 4;
  const metrics = [
    { label: 'Total Patients', value: analysisData.totalPatients },
    { label: 'Eligible Rate', value: `${analysisData.eligibilityRate.toFixed(1)}%` },
    { label: 'Active Disasters', value: analysisData.totalActiveDisasters || 580 },
    { label: 'Total Eligible', value: analysisData.totalEligiblePatients }
  ];

  metrics.forEach((metric, i) => {
    const x = margin + (i * (boxWidth + 3));
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, y, boxWidth, 14, 1, 1, 'FD');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(String(metric.value), x + boxWidth / 2, y + 6, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(metric.label, x + boxWidth / 2, y + 11, { align: 'center' });
  });

  // TIME-BASED ANALYSIS
  y += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // Darker blue-gray for consistency
  doc.text('Time since Disaster (Eligible Patients Only)', margin, y);

  y += 6;
  const timeData = [
    {
      label: 'Within 12 Months',
      count: analysisData.timeBasedAnalysis?.within12Months?.count || 0,
      pct: analysisData.timeBasedAnalysis?.within12Months?.percentage?.toFixed(1) || '0.0',
      risk: 'Low Risk',
      color: [220, 252, 231]
    },
    {
      label: '1-2 Years',
      count: analysisData.timeBasedAnalysis?.between12And24Months?.count || 0,
      pct: analysisData.timeBasedAnalysis?.between12And24Months?.percentage?.toFixed(1) || '0.0',
      risk: 'Medium Risk',
      color: [254, 243, 199]
    },
    {
      label: 'Over 2 Years',
      count: analysisData.timeBasedAnalysis?.over24Months?.count || 0,
      pct: analysisData.timeBasedAnalysis?.over24Months?.percentage?.toFixed(1) || '0.0',
      risk: 'High Risk',
      color: [254, 226, 226]
    }
  ];

  doc.setFontSize(8);
  timeData.forEach((row, i) => {
    const rowY = y + (i * 7);
    doc.setFont('helvetica', 'bold');
    doc.text(row.label, margin, rowY);
    doc.setFont('helvetica', 'normal');
    doc.text(String(row.count), margin + 50, rowY);
    doc.text(`${row.pct}% of eligible`, margin + 70, rowY);
    
    doc.setFillColor(row.color[0], row.color[1], row.color[2]);
    doc.roundedRect(margin + 115, rowY - 3, 25, 5, 1, 1, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(row.risk, margin + 127.5, rowY, { align: 'center' });
    doc.setFontSize(8);
  });

  // AUDIT GUIDANCE BOX
  y += 25;
  doc.setFillColor(255, 243, 205);
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 12, 2, 2, 'FD');
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14);
  doc.text('Audit Documentation Guidance:', margin + 2, y + 3);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 53, 15);
  const guidanceText = 'Time since disaster commencement affects Medicare audit documentation requirements. Recent disasters (<12 months) typically require routine documentation, while longer periods may require enhanced clinical justification and continuity-of-care evidence.';
  const splitText = doc.splitTextToSize(guidanceText, pageWidth - (margin * 2) - 4);
  doc.text(splitText, margin + 2, y + 7);

  // STATE DISTRIBUTION (COMPACT BOXES)
  y += 20; // Reduced gap
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // Darker blue-gray for consistency
  doc.text('State Distribution', margin, y);

  y += 6;
  if (analysisData.stateDistribution) {
    const states = Object.entries(analysisData.stateDistribution)
      .filter(([, data]: [string, any]) => data.total > 0)
      .sort(([, a]: [string, any], [, b]: [string, any]) => b.total - a.total);

    // Define colors for state boxes
    const stateColors = [
      [59, 130, 246],   // Blue
      [16, 185, 129],   // Green  
      [245, 158, 11],   // Amber
      [239, 68, 68],    // Red
      [139, 92, 246],   // Purple
      [236, 72, 153],   // Pink
      [6, 182, 212],    // Cyan
      [34, 197, 94]     // Emerald
    ];

    doc.setFontSize(7);
    states.forEach(([state, data]: [string, any], i) => {
      const col = i % 3; // 3 columns instead of 2
      const row = Math.floor(i / 3);
      const boxWidth = 58; // Slightly wider for better spacing
      const boxHeight = 28; // Taller for better readability
      const x = margin + (col * (boxWidth + 6)); // More space between boxes
      const stateY = y + (row * (boxHeight + 4)); // More space between rows
      
      // State box with colored border
      const color = stateColors[i % stateColors.length];
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(1.0); // Thicker border for clarity
      doc.rect(x, stateY, boxWidth, boxHeight);
      
      // State name (bold, larger) - more prominent
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFontSize(9); // Larger state name
      doc.text(state, x + 3, stateY + 5);
      
      // Total count - better spacing
      doc.setFontSize(7); // Slightly larger
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`${data.total} Total`, x + 3, stateY + 9);
      
      // Percentage - better positioned
      const pct = analysisData.totalPatients > 0 
        ? ((data.total / analysisData.totalPatients) * 100).toFixed(1) 
        : '0.0';
      doc.setTextColor(100, 116, 139);
      doc.text(`(${pct}% of patients)`, x + 3, stateY + 12);
      
      // Disaster Eligible (green) - better spacing
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74);
      doc.text('Disaster Eligible:', x + 3, stateY + 16);
      
      doc.setFont('helvetica', 'normal');
      doc.text(String(data.eligible || 0), x + 3, stateY + 19);
      
      // Remoteness items - better formatted
      if (data.remoteness) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        const remoteness = Object.entries(data.remoteness)
          .filter(([, count]) => (count as number) > 0)
          .slice(0, 2); // Only show 2 items to save space
        
        remoteness.forEach(([cat, count], ri) => {
          const shortCat = cat.replace('Major Cities', 'Cities').replace('Inner Regional', 'Inner').replace('Outer Regional', 'Outer');
          doc.text(`• ${shortCat}: ${count}`, x + 3, stateY + 22 + (ri * 3)); // Better spacing
        });
      }
    });
  }

  // NATIONAL REMOTENESS (ATTRACTIVE BOXES)
  y += Math.ceil((Object.keys(analysisData.stateDistribution || {}).length) / 3) * 32 + 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // Darker blue-gray for consistency
  doc.text('Australia Summary - Remoteness Distribution', margin, y);

  y += 8;
  if (analysisData.nationalRemotenessBreakdown) {
    // Define remoteness categories in proper order with colors
    const remotenessOrder = [
      { name: 'Major Cities', color: [59, 130, 246] },      // Blue
      { name: 'Inner Regional', color: [16, 185, 129] },    // Green
      { name: 'Outer Regional', color: [245, 158, 11] },    // Amber
      { name: 'Remote', color: [239, 68, 68] },             // Red
      { name: 'Very Remote', color: [139, 92, 246] }        // Purple
    ];

    doc.setFontSize(8);
    remotenessOrder.forEach((category, i) => {
      const count = analysisData.nationalRemotenessBreakdown[category.name] || 0;
      const col = i % 3; // 3 columns for better layout
      const row = Math.floor(i / 3);
      const boxWidth = 58; // Same as state boxes
      const boxHeight = 20; // Slightly shorter than state boxes
      const x = margin + (col * (boxWidth + 6));
      const remoteY = y + (row * (boxHeight + 4));
      
      // Remoteness box with colored border
      doc.setDrawColor(category.color[0], category.color[1], category.color[2]);
      doc.setLineWidth(1.0);
      doc.rect(x, remoteY, boxWidth, boxHeight);
      
      // Category name (bold, colored)
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(category.color[0], category.color[1], category.color[2]);
      doc.setFontSize(9);
      doc.text(category.name, x + 3, remoteY + 5);
      
      // Count and percentage
      const pct = analysisData.totalPatients > 0 
        ? ((count / analysisData.totalPatients) * 100).toFixed(1) 
        : '0.0';
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`${count} patients`, x + 3, remoteY + 10);
      doc.text(`(${pct}% of total)`, x + 3, remoteY + 15);
    });
  }

  // FOOTER
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Generated by TeleCheck Professional • www.telecheck.com.au', pageWidth / 2, footerY, { align: 'center' });
  doc.text('Data analysis based on Australian Government disaster declarations and postcode classifications.', pageWidth / 2, footerY + 4, { align: 'center' });
  doc.text('No financial, medical, or business advice provided. Analysis reflects data as of report generation date.', pageWidth / 2, footerY + 8, { align: 'center' });

  const fileName = `${clinicName.replace(/[^a-z0-9]/gi, '_')}_${reportDate.replace(/\//g, '-')}.pdf`;

  if (viewMode) {
    // Return blob URL for viewing in new tab
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    return blobUrl;
  } else {
    // Download directly
    doc.save(fileName);
  }
}
