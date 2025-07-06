export type RegisterType = 'credit' | 'debit';

export interface Register {
    id?: number;
    name: string;
    description: string;
    value: number;
    date: string;
    registerType: RegisterType;
} 