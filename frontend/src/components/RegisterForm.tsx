import { useState } from 'react';
import type { Register } from '../types/Registers';
import { insertRegister } from '../api/Registers';


export const RegisterForm = ({ onSubmitSuccess }: { onSubmitSuccess: () => void }) => {
    const getToday = () => new Date().toISOString().split('T')[0];
    const [form, setForm] = useState<Register>({
        name: '',
        description: '',
        value: 0,
        date: getToday(),
        registerType: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'value' ? parseFloat(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await insertRegister(form);
        setForm({ name: '', description: '', value: 0, date: getToday(), registerType: '' });
        onSubmitSuccess();
    };

    const handleCancel = async (e: React.FormEvent) => {
        e.preventDefault();
        setForm({ name: '', description: '', value: 0, date: getToday(), registerType: '' });

    }

    return (
        <>

            <div className='flex items-start w-full font-patrick text-3xl font-semibold'>
                <h2>Novo Registro</h2>
            </div>

            <div className="w-full font-patrick">
                <div className="grid grid-cols-10  bg-pink-200 text-pink-800 font-semibold text-xl py-2 px-2 rounded-t-md">
                    <span className='col-span-2 border-r border-l border-pink-800 pl-1'>Data</span>
                    <span className='col-span-2 border-r border-pink-800 pl-1'>Nome</span>
                    <span className='col-span-3 border-r border-pink-800 pl-1'>Descrição</span>
                    <span className='auto border-r border-pink-800 pl-1'>R$</span>
                    <span className='text-center col-span-2 border-r border-pink-800'>Entrada   |   Saida</span>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-10 items-center py-2 px-2 bg-pink-50 text-xl">

                    <input
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        className="bg-white border-b border-r border-l border-pink-300 outline-none px-1 h-12 col-span-2"
                    />
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="bg-white border-b border-r border-pink-300 outline-none px-1 h-12 col-span-2"
                    />
                    <input
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        className="bg-white border-b border-r border-pink-300 outline-none px-1 h-12 col-span-3"
                    />
                    <input
                        name="value"
                        type="number"
                        value={form.value}
                        onChange={handleChange}
                        required
                        className="bg-white border-b border-r border-pink-300 outline-none px-1 h-12 auto"
                    />
                    <div className="flex gap-4 col-span-2 justify-center items-center bg-white border-b border-r border-pink-300 px-1 h-12">
                        {[
                            { value: 'credit', color: 'blue' },
                            { value: 'debit', color: 'red' },
                        ].map(({ value, color }) => {
                            const isSelected = form.registerType === value;
                            const colorMap: any = {
                                credit: 'bg-blue-500 border-blue-500',
                                debit: 'bg-red-400 border-red-400',
                            };
                            return (
                                <label key={value} className="flex flex-col items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="registerType"
                                        value={value}
                                        checked={isSelected}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span
                                        onClick={() => console.log('Color clicado:', color)}
                                        className={`w-5 h-5 rounded border transition-all 
                                                ${isSelected ? colorMap[value] : 'border-gray-400'}
                                            `}
                                    />
                                </label>
                            );
                        })
                        }
                    </div>






                    {/* <select name="registerType" value={form.registerType} onChange={handleChange}>
                        <option value="credit">Entrada</option>
                        <option value="debit">Saída</option>
                    </select> */}
                    <div className='flex mt-2 p-1 font-semibold'>
                        <div className='flex pl-2 pr-2 bg-pink-300 text-pink-800 rounded mr-4'>
                            <button type="submit" className='cursor-pointer'>Adicionar</button>
                        </div>

                        <div className='flex pl-2 pr-2 bg-[#E8E8E4] border border-[#ECE4DB] rounded'>
                            <button onClick={handleCancel} className='cursor-pointer'>Cancelar</button>
                        </div>

                    </div>

                </form>

            </div>




        </>
    );
};
