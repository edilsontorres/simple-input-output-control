export interface Register {
    name: string,
    description: string,
    value: number,
    date: string,
    registerType: 'credit' | 'debit';
}

export interface Totais {
    totalInputs: number;
    totalOutputs: number;
    balance: number;
}