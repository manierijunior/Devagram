import type { NextApiRequest, NextApiResponse } from "next";
import {conectarMongoDB} from '../../middlewares/conectaMongoDB'
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'

const endpointLogin = (

    req : NextApiRequest,
    res : NextApiResponse<RespostaPadraoMsg>

)  => {

    if(req.method === 'POST'){

        const{login, senha} = req.body;

        if(login == 'admin@admin.com' && 
            senha === 'Admin@123'){
                return res.status(200).json({msg : 'Usuário autenticado com sucesso'});

            }
            return res.status(400).json({erro : 'Usuário ou senha não encontrados'});
    }

    return res.status(405).json({erro : 'Metódo informado não é valido'});
}

export default conectarMongoDB(endpointLogin);