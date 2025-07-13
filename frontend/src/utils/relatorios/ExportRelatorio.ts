import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatData, formatToReal } from '../FormatValue';
import type { Register, Totais } from '../../types/Registers';

export function exportReportsPDF(registers: Register[], totais: Totais, start: string, end: string) {
    const doc = new jsPDF();

    const labelX = 14;
    const arrowX = 45;
    const valueX = 50;

    // Cabeçalho
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Relatório Financeiro', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Período: ${formatData(start)} a ${formatData(end)}`, doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.text('Entradas:', labelX, 40);
    doc.text('->', arrowX, 40);
    doc.setTextColor(0, 150, 0);
    doc.text(formatToReal(totais.totalInputs), valueX, 40);

    doc.setTextColor(0, 0, 0);
    doc.text('Saídas:', labelX, 47);
    doc.text('->', arrowX, 47);
    doc.setTextColor(200, 0, 0);
    doc.text(formatToReal(totais.totalOutputs), valueX, 47);

    doc.setTextColor(0, 0, 0);
    doc.text('Balanço:', 14, 54);
    doc.text('->', arrowX, 54);
    if (totais.balance >= 0) {
        doc.setTextColor(0, 0, 180); 
    } else {
        doc.setTextColor(200, 0, 0);
    }
    doc.text(formatToReal(totais.balance), valueX, 54);

    doc.setTextColor(0, 0, 0);

    
    const filteredRegisters = registers
        .filter(r => r.date >= start && r.date <= end)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


   
    autoTable(doc, {
        startY: 65,
        head: [[
            'Data',
            'Nome',
            'Descrição',
            'Valor',
            'Tipo'
        ]],
        body: filteredRegisters.map(r => [
            formatData(r.date),
            r.name,
            r.description,
            formatToReal(r.value),
            r.registerType === 'credit' ? 'Entrada' : 'Saída'
        ]),
        styles: {
            font: 'helvetica',
            fontSize: 10,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [255, 192, 203], 
            textColor: [80, 0, 0],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [255, 245, 247]
        },
        columnStyles: {
            0: { cellWidth: 25 }, // Data
            1: { cellWidth: 30 }, // Nome
            2: { cellWidth: 60 }, // Descrição
            3: { cellWidth: 25, halign: 'right', overflow: 'visible' }, // Valor
            4: { cellWidth: 25 }  // Tipo
        },
        didParseCell: function (data:any) {
            if (data.section === 'body' && data.column.index === 3 || data.column.index === 4) {
                const tipo = data.row.raw[4]; 
                if (tipo === 'Entrada') {
                    data.cell.styles.textColor = [34, 197, 94]; 
                } else if (tipo === 'Saída') {
                    data.cell.styles.textColor = [239, 68, 68];
                }
            }
        }
    });

    // Salva
    doc.save(`relatorio_${start}_a_${end}.pdf`);
}
