import { useEffect, useState } from 'react';
import { caculateTotais, listRegisters } from '../api/Registers';
import type { Totais } from '../types/Registers';
import { formatData, formatToReal } from '../utils/FormatValue';
import { exportReportsPDF } from '../utils/relatorios/ExportReports';
import { exportInputsReportsPDF } from '../utils/relatorios/ExportInputsReportsPDF';
import { exportOutputsReportsPDF } from '../utils/relatorios/ExportOutputsReportsPDF';
import type { Register } from '../types/Registers';



export const ResumeFilterPeriod = () => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [totais, setTotais] = useState<Totais>({ totalInputs: 0, totalOutputs: 0, balance: 0 });
    const [registers, setRegisters] = useState<Register[]>([]);
    const [relatorioTipo, setRelatorioTipo] = useState<'geral' | 'entradas' | 'saidas' | 'separado'>('geral');
    const [visibleResult, setVisibleResult] = useState(false);


    const handleSearch = async () => {
        const totalsPeriod = await caculateTotais(start, end);
        const totalsRegisters = await listRegisters();
        setTotais(totalsPeriod);
        setRegisters(totalsRegisters);
        setVisibleResult(true);
    };

    useEffect(() => {

        // Quando registros forem renderizados (ex: após uma pesquisa)
        if (registers.length > 0) {
            // Aguarda o próximo frame para garantir que a DOM já renderizou tudo
            requestAnimationFrame(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [registers]);


    const generateReport = () => {
        switch (relatorioTipo) {
            case 'geral':
                exportReportsPDF(registers, totais, start, end);
                break;
            case 'entradas':
                exportInputsReportsPDF(registers, start, end);
                break;
            case 'saidas':
                exportOutputsReportsPDF(registers, start, end);
                break;
        }
    };

    return (
        <div>
            <div className='flex'>
                <div className='flex flex-col items-center font-patrick text-2xl'>
                    <h1 className='font-semibold'>Inicio</h1>
                    <label>
                        <input
                            type="date"
                            value={start}
                            onChange={e => setStart(e.target.value)}
                            className="bg-white border-b border-r border-l border-pink-300 outline-none px-1 h-12 mr-4"
                        />
                    </label>
                </div>
                <div className='flex flex-col items-center font-patrick text-2xl'>
                    <h1 className='font-semibold'>Fim</h1>
                    <label>
                        <input
                            type="date"
                            value={end}
                            onChange={e => setEnd(e.target.value)}
                            className="bg-white border-b border-r border-l border-pink-300 outline-none px-1 h-12 mr-4"
                        />
                    </label>
                </div>
            </div>
            <div className='flex justify-star mt-2 mb-3'>
                <div className='flex p-2 rounded-t-md font-patrick font-semibold bg-pink-50 hover:bg-pink-100 hover:shadow-inner cursor-pointer'>
                    <button
                        className='cursor-pointer'
                        onClick={handleSearch}>
                        Buscar
                    </button>
                </div>
            </div>

            {visibleResult && (
                <>
                    <h2 className="font-patrick text-3xl text-center font-semibold mb-2">Resumo</h2>
                    <p className='text-center'> {formatData(start)} à {formatData(end)}</p>
                    <ul className="text-xl bg-pink-50 flex justify-between p-3 rounded-t-md">
                        <li className="font-semibold">
                            <span>Entradas:</span>
                            <span className="text-[#60d394]"> {formatToReal(totais.totalInputs)}</span>
                        </li>
                        <li className="font-semibold">
                            <span className="font-semibold">Saídas:</span>
                            <span className="text-red-400"> {formatToReal(totais.totalOutputs)}</span>
                        </li>
                        <li className="font-semibold">
                            <span>Balanço:</span>{' '}
                            <span className={totais.balance >= 0 ? 'text-blue-600' : 'text-red-600'}>
                                {formatToReal(totais.balance)}
                            </span>
                        </li>
                    </ul>

                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { label: '📄 Geral', value: 'geral' },
                                { label: '🟢 Somente Entradas', value: 'entradas' },
                                { label: '🔴 Somente Saídas', value: 'saidas' },
                            ].map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setRelatorioTipo(opt.value as any)}
                                    className={`px-4 py-2 rounded-md font-patrick font-semibold border cursor-pointer
                                            ${relatorioTipo === opt.value
                                            ? 'bg-pink-200 border-pink-600 text-pink-800'
                                            : 'bg-pink-50 hover:bg-pink-100 text-pink-600 border-pink-300'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex">
                            <button
                                onClick={generateReport}
                                className="mt-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md shadow mb-6 cursor-pointer"
                            >
                                Gerar Relatório PDF
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
