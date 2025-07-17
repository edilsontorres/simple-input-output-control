import express from 'express';
import router from './routes/Registers';
import cors from 'cors';
import path from 'path';
import { initDb } from './db/Database';

const app = express();

const PORT = process.env.PORT || 3001;
const DATABASE_PATH = process.env.DATABASE_PATH;

if (!DATABASE_PATH) {
    // Isso só deve acontecer em desenvolvimento se você não definir DATABASE_PATH
    // ou se houver um erro grave. Em um app empacotado, ele DEVE estar definido.
    console.error("ERRO CRÍTICO: Variável de ambiente DATABASE_PATH não definida!");
    // Você pode querer ter um fallback para desenvolvimento local aqui,
    // mas para o AppImage, queremos que ele falhe se não receber o path.
    // Por exemplo: process.exit(1);
    // Ou um caminho padrão para desenvolvimento:
    // DATABASE_PATH = path.join(__dirname, '..', 'database.sqlite');
    // Mas para o AppImage, o ideal é que ele venha do Electron.
    throw new Error("DATABASE_PATH não definido. Não é possível iniciar o backend.");
}

console.log(`[Backend] Usando banco de dados em: ${DATABASE_PATH}`);

app.use(express.json());
app.use(cors());
app.use('/registers', router);

initDb(DATABASE_PATH).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    })
});