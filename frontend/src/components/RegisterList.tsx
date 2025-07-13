import { useState } from 'react';
import { deleteRegister, updateRegister } from '../api/Registers';
import type { Register } from '../types/Registers';
import { formatData, formatToReal } from '../utils/FormatValue';


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
        return <div className='flex flex-col items-start w-full font-patrick'>
            <h2 className='text-3xl font-semibold'>Registros de hoje:</h2>
            <p>Nenhum registro pra hoje</p>
        </div>
    }

    return (
        <>
            <div className="w-full mt-6">
                {erro && <p className="text-red-500 mb-2">{erro}</p>}

                <h2 className="font-patrick text-3xl font-semibold mb-2">Registros de hoje:</h2>

                {/* Cabeçalho */}
                <div className="grid grid-cols-12 bg-pink-200 text-pink-900 font-patrick text-xl font-semibold py-2 px-4 rounded-t-md">
                    <span className='col-span-2'>Data</span>
                    <span className='col-span-2'>Nome</span>
                    <span className='col-span-3'>Descrição</span>
                    <span className='col-span-1'>R$</span>
                    <span className='col-span-2'>Tipo</span>
                    <span className="text-center col-span-2">Ações</span>
                </div>

                {/* Lista de registros */}
                {registers.map((r) => {
                    const isEditing = editId === r.id;

                    return (
                        <div
                            key={r.id}
                            className="grid grid-cols-12 items-center px-4 py-2 border-b border-pink-200 bg-pink-50 text-sm"
                        >
                            {isEditing ? (
                                <>
                                    <input
                                        type="date"
                                        name="date"
                                        value={registerEdited.date}
                                        onChange={handleChange}
                                        className="border-b border-pink-300 outline-none px-1 h-8 col-span-2"
                                    />
                                    <input
                                        type="text"
                                        name="name"
                                        value={registerEdited.name}
                                        onChange={handleChange}
                                        className="border-b border-pink-300 outline-none px-1 h-8 col-span-2"
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        value={registerEdited.description}
                                        onChange={handleChange}
                                        className="border-b border-pink-300 outline-none px-1 h-8 col-span-3"
                                    />
                                    <input
                                        type="number"
                                        name="value"
                                        value={registerEdited.value}
                                        onChange={handleChange}
                                        className="border-b border-pink-300 outline-none px-1 h-8 col-span-1"
                                    />
                                    <select
                                        name="registerType"
                                        value={registerEdited.registerType}
                                        onChange={handleChange}
                                        className="border-b border-pink-300 outline-none px-1 h-8 col-span-2"
                                    >
                                        <option value="credit">Entrada</option>
                                        <option value="debit">Saída</option>
                                    </select>
                                    <div className="flex justify-center gap-2 col-span-2">
                                        <button onClick={saveEdition} className="text-blue-600 hover:underline text-sm cursor-pointer">Salvar</button>
                                        <button onClick={cancelEdition} className="text-gray-500 hover:underline text-sm cursor-pointer">Cancelar</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span  className='col-span-2'>{formatData(r.date)}</span>
                                    <span  className='col-span-2'>{r.name}</span>
                                    <span className='col-span-3'>{r.description}</span>
                                    <span  className='col-span-1'>{formatToReal(r.value)}</span>
                                    <span className={r.registerType === 'credit' ? 'text-blue-600 col-span-2' : 'text-red-600 col-span-2'}>
                                        {r.registerType === 'credit' ? 'Entrada' : 'Saída'}
                                    </span>
                                    <div className="flex justify-center gap-2 col-span-2">
                                        <button onClick={() => startEditing(r)} className="text-blue-600 hover:underline text-sm cursor-pointer">Editar</button>
                                        <button onClick={() => handleDelete(r.id!)} className="text-red-600 hover:underline text-sm cursor-pointer">Deletar</button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </>

    );
}
