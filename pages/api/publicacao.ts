import type { NextApiRequest, NextApiResponse } from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import nc from 'next-connect';
import {uploadImagemCosmic,updload} from '../../services/uploadImagemCosmic';
import {conectarMongoDB} from '../../middlewares/conectaMongoDB';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';


try{
    const handler =  nc ()
    .use (updload.single('file'))
    .post(async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
            const {descricao, file} = req?.body;

            if(!descricao || descricao.length < 2){
                    return res.status(400).json({erro : 'Descrição não é válida'});
            }

            if(!file){
                return res.status(400).json({erro : 'A imagem é obrigatória'});
            }

                return res.status(200).json({msg : 'A publicação esta válida'})

    });

} catch(e){
    console.log(e);
    return res.status(400).json({erro : 'Erro ao cadastrar publicação'});
}



    export const config = {
        api : {

            bodyParser : false

        }

    }

    export default validarTokenJWT(conectarMongoDB(handler));


    // tempo de vídeo 11:46