import { IRegisterService } from "./interface/IRegisterService";
import { openDb } from "../db/Database";
import { Register } from "../types/Register";

export class RegisterService implements IRegisterService {

    async list(): Promise<Register[]> {
        const db = await openDb();
        return db.all<Register[]>('SELECT * FROM registers ORDER BY date ASC');
    }

    async insert(register: Register): Promise<void> {
        const db = await openDb();
        const { name, description, value, date, registerType } = register;
        await db.run(
            'INSERT INTO registers (name, description, value, date, registerType) VALUES (?, ?, ?, ?, ?)',
            [name, description, value, date, registerType]
        );
    }

    async update(register: Register, id: number): Promise<void> {
        const db = await openDb();
        const { name, description, value, date, registerType } = register;

        const existing = await db.get('SELECT id FROM registers WHERE id = ?', [id]);
        if (!existing) {
            throw new Error(`Registro com ID ${id} não encontrado.`);
        }

        await db.run(
            `UPDATE registers
             SET name = ?, description = ?, value = ?, date = ?, registerType = ?
             WHERE id = ?`,
            [name, description, value, date, registerType, id]
        );
    }

    async delete(id: number): Promise<void> {
        const db = await openDb();

        const existing = await db.get('SELECT id FROM registers WHERE id = ?', [id]);
        if (!existing) {
            throw new Error(`Registro com ID ${id} não encontrado.`);
        }

        await db.run(`DELETE FROM registers WHERE id = ?`, [id]);
    }

    async calculateTotal(start: string, end: string): Promise<{ totalInputs: number; totalOutputs: number; balance: number; }> {
        const db = await openDb();
        const inputRow = await db.get<{ total: number }>(
            'SELECT SUM(value) as total FROM registers WHERE registerType = ? AND date BETWEEN ? AND ?',
            ['credit', start, end]);

        const outputRow = await db.get<{ total: number }>(
            'SELECT SUM(value) as total FROM registers WHERE registerType = ? AND date BETWEEN ? AND ?',
            ['debit', start, end]);

        const totalInputs = inputRow?.total ?? 0;
        const totalOutputs = outputRow?.total ?? 0;


        return {
            totalInputs,
            totalOutputs,
            balance: totalInputs - totalOutputs
        };
    }
}