import type { Register, Totais } from "../types/Registers";
import { api } from "./Client";

export const listRegisters = async (): Promise<Register[]> => {
    const response = await api.get('/');
    return response.data;
}

export const insertRegister = async (register: Register) => {
    await api.post('/', register);
};

export const updateRegister = async (register: Partial<Register>, id: string) => {
    if (!id) throw new Error('ID inválido');
    try {
        const response = await api.put(`/update/${id}`, register);
        return response.data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            throw new Error('Registro não encontrado');
        }
        throw new Error('Erro ao deletar o registro');
    }
}

export const deleteRegister = async (id: string) => {
    if (!id) throw new Error('ID inválido');
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            throw new Error('Registro não encontrado');
        }
        throw new Error('Erro ao deletar o registro');
    }
}

export const caculateTotais = async (start: string, end: string): Promise<Totais> => {
    const response = await api.get('/totais', {
        params: { start, end }
    });

    return response.data;
}