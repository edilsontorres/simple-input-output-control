import { Request, RequestHandler, Response } from "express";
import { RegisterService } from "../services/RegisterService";
import { Register } from "../types/Register";

const service = new RegisterService();

interface TotaisQuery {
    start?: string;
    end?: string;
}

export class RegisterController {
    static async list(req: Request, res: Response) {
        const registers = await service.list();
        res.json(registers);
    }

    static async insert(req: Request, res: Response) {
        const register: Register = req.body;
        await service.insert(register);
        res.status(201).json({ message: 'Registro inserido com sucesso!' });
    }

    static calculateTotal: RequestHandler<{}, any, any, TotaisQuery> = async (req, res) => {
        const { start, end } = req.query;
        if (!start || !end) {
            res.status(400)
                .json({ msg: 'Parâmetros start e end obrigatórios!' });
        }
        
        const totais = await service.calculateTotal(String(start), String(end));

        res.json(totais);
    }
}