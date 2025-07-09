import { useState } from 'react';
import { deleteRegister, updateRegister } from '../api/Registers';
import type { Register } from '../types/Registers';


interface Props {
    registers: Register[];
    updateRegisters: () => void;
}

export const RegisterList = ({ registers, updateRegisters }: Props) => {
    const [erro, setErro] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [registerEdited, setRegisterEdited] = useState<Partial<Register>>({});

    const handleDelete = async (id: string) => {
        setErro(null);
        try {
            await deleteRegister(id);
            updateRegisters();
        } catch (e: any) {
            setErro(e.message || 'Erro ao deletar o registro');
        }
    };

    const startEditing = (register: Register) => {
        setEditId(register.id!);
        setRegisterEdited({ ...register });
    };

    const cancelEdition = () => {
        setEditId(null);
        setRegisterEdited({});
    };

    const saveEdition = async () => {
        if (!editId) return;
        try {
            await updateRegister(registerEdited, editId);
            setEditId(null);
            updateRegisters();
        } catch (e: any) {
            setErro(e.message || 'Erro ao atualizar o registro');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRegisterEdited((prev) => ({ ...prev, [name]: name === 'value' ? Number(value) : value }));
    };



    if (registers.length === 0) {
        return <p>Nenhum registro para hoje ainda.</p>;
    }

    return (
        <div>
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            <table border={1}>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {registers.map((r) => (
                        <tr key={r.id}>
                            {editId === r.id ? (
                                <>
                                    <td>
                                        <input
                                            type="date"
                                            name="date"
                                            value={registerEdited.date}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="name"
                                            value={registerEdited.name}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="description"
                                            value={registerEdited.description}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="value"
                                            value={registerEdited.value}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="registerType"
                                            value={registerEdited.registerType}
                                            onChange={handleChange}
                                        >
                                            <option value="credit">Entrada</option>
                                            <option value="debit">Saída</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={saveEdition}>Salvar</button>{' '}
                                        <button onClick={cancelEdition}>Cancelar</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{r.date}</td>
                                    <td>{r.name}</td>
                                    <td>{r.description}</td>
                                    <td>R$ {r.value}</td>
                                    <td>{r.registerType === 'credit' ? 'Entrada' : 'Saída'}</td>
                                    <td>
                                        <button onClick={() => startEditing(r)}>Atualizar</button>{' '}
                                        <button onClick={() => handleDelete(r.id!)}>Deletar</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
