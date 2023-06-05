import {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';

const endPointCadastro = 
        (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

            if(req.method === 'POST'){

                const usuario = req.body as CadastroRequisicao;

                if(!usuario.nome || usuario.nome.length < 2){
                    return res.status(400).json({erro : 'Nome Inválido'});

                }

                if(!usuario.email || usuario.email.length <5
                    || !usuario.email.includes('@')
                    || !usuario.email.includes('.')){
                    return res.status(400).json({erro : 'Email Inválido'});
                        
                    }

                if(!usuario.senha || usuario.senha.length < 4){
                    return res.status(400).json({erro : 'Senha Inválida'});

                }

                return res.status(200).json({msg : 'Dados Corretos'});

            }
            return res.status(405).json({erro : 'Método informado não existe'})

        } 

        export default (endPointCadastro);
