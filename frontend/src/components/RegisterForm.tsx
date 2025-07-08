import { useState } from 'react';
import type { Register } from '../types/Registers';
import { insertRegister } from '../api/Registers';


export const RegisterForm = ({ onSubmitSuccess }: { onSubmitSuccess: () => void }) => {
    const [form, setForm] = useState<Register>({
        name: '',
        description: '',
        value: 0,
        date: '',
        registerType: 'credit',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === 'value' ? parseFloat(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await insertRegister(form);
        setForm({ name: '', description: '', value: 0, date: '', registerType: 'credit' });
        onSubmitSuccess(); // recarregar dados
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Novo Registro</h2>
            <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
            />
            <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nome"
                required
            />
            <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descrição"
                required
            />
            <input
                name="value"
                type="number"
                value={form.value}
                onChange={handleChange}
                placeholder="Valor"
                required
            />

            <select name="registerType" value={form.registerType} onChange={handleChange}>
                <option value="credit">Entrada</option>
                <option value="debit">Saída</option>
            </select>
            <button type="submit">Adicionar</button>
        </form>
    );
};
