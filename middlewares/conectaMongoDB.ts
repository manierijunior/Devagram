import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from 'mongoose';
import { error } from "console";
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg'
import type endpointCadastro from '../pages/api/cadastro';


export const conectarMongoDB = (handler : NextApiHandler) =>    
   async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>)=>{

        // verificar se o banco esta conectado, se estiver seguir para o endpoint ou próximo middleware

        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }

            //ja que não esta conectado, vamos conectar 
            //obter a variavel de ambiente preenchida do env

            const {DB_CONEXAO_STRING} = process.env;
            
            //Se a env estiver vazia aborta o uso do sistema e avisa o programador
            if(!DB_CONEXAO_STRING){
                return res.status(500).json({ erro : 'ENV de configuração do banco, não informado'});

            }
           
         mongoose.connection.on('connected', () => console.log('Banco de dados conectado'));
         mongoose.connection.on('error', () => console.log(`Ocorreu erro ao conectar no Banco: ${error} `));
         await mongoose.connect(DB_CONEXAO_STRING);
         
         // Agora posso seguir para o endpoint, pois estou conectado no banco 
         return handler(req, res);
           
    }