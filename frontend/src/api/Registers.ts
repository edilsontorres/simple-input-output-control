import type { Register, Totais } from "../types/Registers";
import { api } from "./Client";


export const listRegisters = async (): Promise<Register[]> => {
    const response = await api.get('/');
    return response.data;
}

export const insertRegister = async (register: Register) => {
    await api.post('/', register);
};

export const caculateTotais = async (start: string, end: string): Promise<Totais> => {
    const response = await api.get('/totais', {
        params: { start, end }
    });

    return response.data;
}