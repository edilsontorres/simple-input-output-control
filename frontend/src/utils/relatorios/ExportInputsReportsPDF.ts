import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatData, formatToReal } from '../FormatValue';
import type { Register } from '../../types/Registers';

export const exportInputsReportsPDF = (registros: Register[], start: string, end: string) => {
    const doc = new jsPDF();

    const filteredRegisters = registros
        .filter(r => r.registerType === 'credit' && r.date >= start && r.date <= end)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const total = filteredRegisters.reduce((sum, r) => sum + r.value, 0);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Relatório de Entradas', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Período: ${formatData(start)} a ${formatData(end)}`, doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.text('Total de Entradas:', 14, 40);
    doc.setTextColor(0, 150, 0);
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
                data.cell.styles.textColor = [34, 197, 94]; // verde
            }
        },
        styles: { font: 'helvetica', fontSize: 10 },
        headStyles: { fillColor: [200, 255, 200], textColor: [0, 100, 0], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 255, 245] },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { cellWidth: 25, halign: 'right' }
        }
    });

    doc.save(`relatorio_entradas_${start}_a_${end}.pdf`);
}
