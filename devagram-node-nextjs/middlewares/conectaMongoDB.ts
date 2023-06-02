import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";

export const conectarMongoDB = (handler : NextApiHandler) =>
   async (req: NextApiRequest, res : NextApiResponse) => {

        // verificar se o banco ja esta conectado, se estiver seguir para o endpoint
        // ou para o próximo middleware

        if(mongoose.connections[0].readyState){

                return handler(req, res);
        }

        // ja que não esta conectado, vamos conectar
        // obter a variavel de ambiente preenchida do env

        const {DB_CONEXAO_STRING} = process.env;
        
        // Se a env estiver vazia aborta o uso do sistema e avisa o programador
       
        if(!DB_CONEXAO_STRING){

            return res.status(500).json({ erro : 'ENV de configuração do banco, não informado '})
      
        }
        
        mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
        mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar no Banco: ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);

        return handler(req, res);

        // Agora posso seguir para o end poin, pois estou conectado no banco.
        

    }