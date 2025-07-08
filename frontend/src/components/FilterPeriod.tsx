import { useState } from 'react';
import { listRegisters, caculateTotais } from '../api/Registers';
import type { Register, Totais } from '../types/Registers';

export const FilterPeriod = () => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [inputs, setInputs] = useState<Register[]>([]);
    const [outputs, setOutputs] = useState<Register[]>([]);
    const [totais, setTotais] = useState<Totais | null>(null);

    const handleSearch = async () => {
        if (!start || !end) return alert('Selecione datas válidas');

        const allRegisters = await listRegisters();

        const filtered = allRegisters.filter(r => r.date >= start && r.date <= end);
        setInputs(filtered.filter(r => r.registerType === 'credit'));
        setOutputs(filtered.filter(r => r.registerType === 'debit'));

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

            {inputs.length > 0 && (
                <div>
                    <h3>Entradas</h3>
                    <table border={1}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Descrição</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inputs.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.date}</td>
                                    <td>{r.description}</td>
                                    <td>{formatToReal(r.value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {outputs.length > 0 && (
                <div>
                    <h3>Saídas</h3>
                    <table border={1}>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Descrição</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outputs.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.date}</td>
                                    <td>{r.description}</td>
                                    <td>{formatToReal(r.value)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            )}
            {totais && (
                <div>
                    <h3>Total do Período</h3>
                    <ul>
                        <li>Entradas: {formatToReal(totais.totalInputs)}</li>
                        <li>Saídas: {formatToReal(totais.totalOutputs)}</li>
                        <li>Balanço: {formatToReal(totais.balance)}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};
