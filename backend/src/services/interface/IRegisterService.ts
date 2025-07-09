import { Register } from "../../types/Register";

export interface IRegisterService {
    list(): Promise<Register[]>;
    insert(register: Register): Promise<void>;
    calculateTotal(start: string, end: string): Promise<{
        totalInputs: number;
        totalOutputs: number;
        balance: number;
    }>;
    update(register: Register, id: number): Promise<void>;
    delete(id: number): Promise<void>;
}