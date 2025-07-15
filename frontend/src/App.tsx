import { listRegisters, caculateTotais } from "./api/Registers";
import { useEffect, useState, useRef } from "react";
import { RegisterForm } from "./components/RegisterForm";
import type { Register, Totais } from "./types/Registers";
import { RegisterList } from "./components/RegisterList";
import { ResumeFilterPeriod } from "./components/ResumeFilterPeriod";
import { formatToReal } from "./utils/FormatValue";

export const App = () => {
  const [registers, setRegister] = useState<Register[]>([]);
  const [totais, setTotais] = useState<Totais | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

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
  if (showFilter && filterRef.current) {
    filterRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [showFilter]);

  useEffect(() => {
    loadDataOfToday();
  }, []);


  return (
    <>

      <div className="flex flex-col justify-center items-center">
        <div className="mb-3 mt-1.5">
          <h1 className="font-patrick text-6xl">Controle Financeiro</h1>
        </div>
        <div className="w-11/12">
          <RegisterForm onSubmitSuccess={loadDataOfToday} />
        </div>

        <div className="w-11/12 mb-3">
          <RegisterList registers={registers} updateRegisters={loadDataOfToday} />
        </div>


        <div className="w-11/12 mb-3 font-patrick">
          {totais && (
            <>
              <h2 className="font-patrick text-3xl text-center font-semibold mb-2">Totais do dia:</h2>
              <ul className="text-xl bg-pink-50 flex justify-between p-3 rounded-t-md">
                <li className="font-semibold">
                  <span>Entradas: </span>
                  <span className="text-[#60d394]">{formatToReal(totais.totalInputs)}</span>
                </li>
                <li className="font-semibold">
                  <span className="font-semibold">Saídas: </span>
                  <span className="text-red-400">{formatToReal(totais.totalOutputs)}</span>
                </li>
                <li className="font-semibold">
                  <span>Balanço: </span>{' '}
                  <span className={totais.balance >= 0 ? 'text-blue-600' : 'text-red-600'}>
                    {formatToReal(totais.balance)}
                  </span>
                </li>
              </ul>
            </>
          )}
        </div>

        <div className="w-11/12 mt-3 font-patrick font-semibold text-xl">
          <button
            className="flex p-2 bg-pink-50 hover:bg-pink-100 hover:shadow-inner rounded-t-md cursor-pointer transition-colors duration-200"
            onClick={() => setShowFilter(!showFilter)}>
            {showFilter ? 'Fechar Filtro por Período' : 'Filtro por Período'}
          </button>
        </div>
        <div ref={filterRef} className="w-11/12 mt-3">
          {showFilter && <ResumeFilterPeriod />}
        </div>

      </div>
    </>
  );
}
