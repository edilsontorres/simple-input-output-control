import { listRegisters, caculateTotais } from "./api/Registers";
import { useEffect, useState } from "react";
import { RegisterForm } from "./components/RegisterForm";
import type { Register, Totais } from "./types/Registers";
import { FilterPeriod } from "./components/FilterPeriod";

export const App = () => {
  const [registers, setRegister] = useState<Register[]>([]);
  const [totais, setTotais] = useState<Totais | null>(null);

  const getToday = (): string => {
    const today = new Date();
    const [day, month, year] = today.toLocaleDateString('pt-BR').split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const loadDataOfToday = async () => {
    const list = await listRegisters();
    const today = getToday();

    const ofDay = list.filter(r => r.date === today);
    setRegister(ofDay);


    const totais = await caculateTotais(today, today);
    setTotais(totais);
  }

  useEffect(() => {
    loadDataOfToday();
  }, []);




  return (
    <>
      <div>
        <h1>Controle Financeiro</h1>

        <RegisterForm onSubmitSuccess={loadDataOfToday} />

        <hr />

        <h2>Registros de hoje</h2>
        {registers.length === 0 ? (
          <p>Nenhum registro para hoje ainda.</p>
        ) : (
          <table border={1}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {registers.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.description}</td>
                  <td>R$ {r.value}</td>
                  <td>{r.registerType === 'credit' ? 'Entrada' : 'Saída'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Totais do dia</h2>
        {totais && (
          <ul>
            <li>Entradas: R$ {totais.totalInputs}</li>
            <li>Saídas: R$ {totais.totalOutputs}</li>
            <li>Balanço: R$ {totais.balance}</li>
          </ul>
        )}

        <FilterPeriod />
      </div>
    </>
  );
}
