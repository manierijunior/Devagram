import type  {NextApiRequest, NextApiResponse} from 'next';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectaMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';
import { SeguidorModel } from '../../models/SeguidorModel';

 const endpointSeguir = 
     async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {

    try{
        
        if(req.method === 'PUT'){


                 const {userId, id} = req?.query;

                 // usuario logado/ autenticado = quem esta fazendo as ações

                const usuarioLogado = await UsuarioModel.findById(userId);
                if(!usuarioLogado){
                    return res.status(400).json({erro : 'Usuario logado não encontrado'});

                }

                // id do usuário a ser seguido - query 

                const usuarioASerSeguido = await UsuarioModel.findById(id);
                if(!usuarioASerSeguido){

                    return res.status(400).json({erro : 'Usuário a ser seguido não encontrado'});
                }

                // buscar se EU LOGADO sigo ou não esse usuário

                const euJaSigoEsseUsuario = await SeguidorModel
                .find({usuarioId: usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id});

                if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){


                    // sinal que eu ja sigo esse usuário 
                        euJaSigoEsseUsuario.forEach(async(e : any) => 
                            await SeguidorModel.findByIdAndDelete({_id : e._id}));


                        usuarioLogado.seguindo--;
                        await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
                        usuarioASerSeguido.seguidores--;
                        await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                        return res.status(200).json({msg : 'Deixou de seguir o usuário com sucesso'});


                }else{

                        // sinal que eu não sigo esse usuário 
                        const seguidor = {

                                usuarioid : usuarioLogado._id,
                                usuarioSeguidoId : usuarioASerSeguido._id
                        };

                        await SeguidorModel.create(seguidor);

                        // adicionar um segundo usuário logado

                         usuarioLogado.seguindo++;
                        await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

                       // adicionar um seguidor no usuario seguido 
                        usuarioASerSeguido.seguidores++;
                        await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                        return res.status(200).json({msg : 'Usuário seguido com sucesso'});
                }


        }

        return res.status(405).json({erro : 'Método informado não existe'});

    }catch(e){

        console.log(e);
        return res.status(500).json({erro : 'Não foi possível seguir/desseguir o usuário informado'});

    }

}

export default validarTokenJWT(conectarMongoDB(endpointSeguir));