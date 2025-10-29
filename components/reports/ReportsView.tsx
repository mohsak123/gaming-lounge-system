import React, { useState, useRef } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { Report } from '../../types';
import jsPDF from 'jspdf';
// FIX: Switched to functional usage of jspdf-autotable to resolve module augmentation error.
import autoTable from 'jspdf-autotable';
import { useTranslation } from '../../hooks/useTranslation';

const ReportsView: React.FC = () => {
  const { reports } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { t } = useTranslation();
  const printRef = useRef<HTMLDivElement>(null);

  const filteredReports = reports.filter(r => r.date === selectedDate);
  const totalRevenue = filteredReports.reduce((sum, r) => sum + r.cost, 0);

  const handlePrintHTML = () => {
    const printContent = printRef.current?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    if(printWindow){
        printWindow.document.write(`
            <html>
                <head>
                    <title>${t('report_details')}</title>
                    <style>
                        body { font-family: 'Cairo', sans-serif; direction: rtl; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #f2f2f2; }
                        h1, h2 { text-align: center; }
                    </style>
                </head>
                <body>${printContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
  };

  const handlePrintPDF = async () => {
    // For Arabic support in jsPDF, a font that supports Arabic glyphs must be embedded.
    // This is a complex process requiring a font file (e.g., a .ttf file).
    // The following is a simplified example. For full production, you would need to
    // add a font like 'Amiri' to jsPDF.
    
    const doc = new jsPDF();
    
    // This is a placeholder for real Arabic font loading.
    // doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    // doc.setFont('Amiri');

    doc.text(`Report for ${selectedDate}`, 105, 15, { align: 'center' });

    // FIX: Changed from 'doc.autoTable' to the functional 'autoTable(doc, ...)' to avoid TypeScript module augmentation issues.
    autoTable(doc, {
      head: [[t('cost'), t('game_type'), t('duration'), t('end_time'), t('start_time'), t('player_name'), t('device_id')]],
      body: filteredReports.map(r => [
        r.cost.toFixed(2),
        t(r.gameType),
        `${r.durationMinutes} min`,
        new Date(r.endTime).toLocaleTimeString('ar-EG'),
        new Date(r.startTime).toLocaleTimeString('ar-EG'),
        r.playerName || '-',
        r.deviceId,
      ]),
      styles: { halign: 'right' },
      headStyles: { halign: 'right' },
      didDrawPage: (data) => {
        doc.text(t('report_details'), data.settings.margin.left, 15);
      },
    });

    doc.text(`${t('total')}: ${totalRevenue.toFixed(2)}`, 14, (doc as any).lastAutoTable.finalY + 10);

    doc.save(`report_${selectedDate}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">{t('total_revenue_for')} {selectedDate}</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
        />
      </div>

      <div ref={printRef} className="printable-content">
        {filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('device_id')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('player_name')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('start_time')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('end_time')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('duration')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('game_type')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('cost')}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReports.map(report => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{report.deviceId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.playerName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(report.startTime).toLocaleTimeString('ar-EG')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(report.endTime).toLocaleTimeString('ar-EG')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.durationMinutes} دقيقة</td>
                    <td className="px-6 py-4 whitespace-nowrap">{t(report.gameType)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{report.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-right font-bold text-lg">{t('total')}</td>
                  <td className="px-6 py-4 font-bold text-lg">{totalRevenue.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="text-center py-10 text-gray-500">{t('no_reports_for_selected_date')}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button onClick={handlePrintPDF} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{t('print_pdf')}</button>
        <button onClick={handlePrintHTML} className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700">{t('print_html')}</button>
      </div>
    </div>
  );
};

export default ReportsView;