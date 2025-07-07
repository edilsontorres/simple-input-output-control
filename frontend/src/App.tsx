import { listRegisters, caculateTotais } from "./api/Registers";
import { useEffect } from "react";

export const App = () => {

  useEffect(() => {
    const fatch = async () => {
      const registers = await listRegisters();
      console.log('Registros: ', registers);
    };

    fatch();
  }, [])

  return (
    <>
      <h1>App Conectado ao Backend</h1>
    </>
  )
}
