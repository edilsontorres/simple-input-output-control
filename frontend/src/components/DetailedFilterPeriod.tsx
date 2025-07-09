import { useEffect, useState } from 'react';
import { listRegisters } from '../api/Registers';
import type { Register } from '../types/Registers';

interface Props {
    start: string;
    end: string;
}

export const DetailedFilterPeriod = ({ start, end }: Props) => {
    const [inputs, setInputs] = useState<Register[]>([]);
    const [outputs, setOutputs] = useState<Register[]>([]);

    useEffect(() => {

        const handleSearch = async () => {
            if (!start || !end) return alert('Selecione datas válidas');

            const allRegisters = await listRegisters();

            const filtered = allRegisters.filter(r => r.date >= start && r.date <= end);
            setInputs(filtered.filter(r => r.registerType === 'credit'));
            setOutputs(filtered.filter(r => r.registerType === 'debit'));

        };

        handleSearch();

    }, [start, end]);

    const formatToReal = (v: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    return (
        <div>
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
        </div>
    );
};
