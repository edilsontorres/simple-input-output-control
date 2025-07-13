export const formatData = (data: string): string => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

export const formatToReal = (v: number) => {
    const abs = Math.abs(v);
    const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(abs);

    return v < 0 ? `R$ -${formatted.replace('R$', '').trim()}` : formatted;
}
