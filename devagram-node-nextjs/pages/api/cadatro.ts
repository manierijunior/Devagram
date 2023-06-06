import {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroRequisicao} from '../../types/CadastroRequisicao';
import{ UsuarioModel } from '../../models/UsuarioModel';
import { conectarMongoDB } from '@/middlewares/conectaMongoDB';

import md5 from 'md5';



const endPointCadastro = 
      async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

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

                // Validação se ja existe usuario com o mesmo email:

                const usuariosComOMesmoEmail = await UsuarioModel.find({email : usuario.email});
                if(usuariosComOMesmoEmail && usuariosComOMesmoEmail.length > 0){

                    return res.status(400).json({erro : 'Ja existe uma conta com o email informado'});
                }

              
                // salvar no banco de dados

                const UsuarioASerSalvo = {
                    nome : usuario.nome,
                    email : usuario.email,
                    senha : md5(usuario.senha)

                }
                await UsuarioModel.create(UsuarioASerSalvo);
                return res.status(200).json({msg : 'Dados Corretos'});

            }
            return res.status(405).json({erro : 'Método informado não existe'})

        } 

        export default conectarMongoDB(endPointCadastro);
