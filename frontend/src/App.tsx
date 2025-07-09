import { listRegisters, caculateTotais } from "./api/Registers";
import { useEffect, useState } from "react";
import { RegisterForm } from "./components/RegisterForm";
import type { Register, Totais } from "./types/Registers";
import { RegisterList } from "./components/RegisterList";
import { ResumeFilterPeriod } from "./components/ResumeFilterPeriod";

export const App = () => {
  const [registers, setRegister] = useState<Register[]>([]);
  const [totais, setTotais] = useState<Totais | null>(null);
  const [showFilter, setShowFilter] = useState(false);

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
        <RegisterList registers={registers} updateRegisters={loadDataOfToday} />

        <h2>Totais do dia</h2>
        {totais && (
          <ul>
            <li>Entradas: R$ {totais.totalInputs}</li>
            <li>Saídas: R$ {totais.totalOutputs}</li>
            <li>Balanço: R$ {totais.balance}</li>
          </ul>
        )}

        <button onClick={() => setShowFilter(!showFilter)}>
          {showFilter ? 'Fechar Filtro por Período' : 'Filtro por Período'}
        </button>

        {showFilter && <ResumeFilterPeriod />}
      </div>
    </>
  );
}
