import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatData, formatToReal } from '../FormatValue';
import type { Register } from '../../types/Registers';

export const exportOutputsReportsPDF = (registers: Register[], start: string, end: string) => {
    const doc = new jsPDF();

    const filteredRegisters = registers
        .filter(r => r.registerType === 'debit' && r.date >= start && r.date <= end)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const total = filteredRegisters.reduce((sum, r) => sum + r.value, 0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Relatório de Saídas', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Período: ${formatData(start)} a ${formatData(end)}`, doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.text('Total de Saídas:', 14, 40);
    doc.setTextColor(239, 68, 68);
    doc.text(formatToReal(total), 60, 40);

    autoTable(doc, {
        startY: 50,
        head: [['Data', 'Nome', 'Descrição', 'Valor']],
        body: filteredRegisters.map(r => [
            formatData(r.date),
            r.name,
            r.description,
            formatToReal(r.value)
        ]),
        didParseCell(data) {
            if (data.section === 'body' && data.column.index === 3) {
                data.cell.styles.textColor = [239, 68, 68]; // vermelho
            }
        },
        styles: { font: 'helvetica', fontSize: 10 },
        headStyles: { fillColor: [255, 220, 220], textColor: [120, 0, 0], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [255, 245, 245] },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { cellWidth: 25, halign: 'right' }
        }
    });

    doc.save(`relatorio_saidas_${start}_a_${end}.pdf`);
}
