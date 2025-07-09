import { useState } from 'react';
import { caculateTotais } from '../api/Registers';
import type { Totais } from '../types/Registers';
import { DetailedFilterPeriod } from './DetailedFilterPeriod';

export const ResumeFilterPeriod = () => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [totais, setTotais] = useState<Totais | null>(null);
    const [showDetail, setShowDetail] = useState<boolean>(false);

    const handleSearch = async () => {
        setShowDetail(false);
        const totalsPeriod = await caculateTotais(start, end);
        setTotais(totalsPeriod);
    };

    const formatToReal = (v: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    return (
        <div>
            <h2>Filtro por Período</h2>
            <div>
                <label>
                    Início:
                    <input type="date" value={start} onChange={e => setStart(e.target.value)} />
                </label>
                <label>
                    Fim:
                    <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
                </label>
                <button onClick={handleSearch}>Buscar</button>
            </div>

            {totais && (
                <div>
                    <h3>Resumo do Período</h3>
                    <ul>
                        <li>Entradas: {formatToReal(totais.totalInputs)}</li>
                        <li>Saídas: {formatToReal(totais.totalOutputs)}</li>
                        <li>Balanço: {formatToReal(totais.balance)}</li>
                    </ul>
                    <button onClick={() => setShowDetail(true)}>
                        Ver todos os registros detalhados
                    </button>
                </div>
            )}

            {showDetail && <DetailedFilterPeriod start={start} end={end} />}
        </div>
    );
};
