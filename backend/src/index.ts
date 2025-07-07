import express from 'express';
import router from './routes/Registers';
import cors from 'cors';
import { initDb } from './db/Database';

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use('/registers', router);

initDb().then(() => {
    app.listen(PORT, () => { 
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    })
});