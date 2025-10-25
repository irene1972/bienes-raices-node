import {check,validationResult} from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

const formularioLogin=(req,res)=>{
    res.render('auth/login',{
        pagina:'Iniciar Sesión'
    });
}

const formularioRegistro=(req,res)=>{
    res.render('auth/registro',{
        pagina:'Crear cuenta',
        csrfToken:req.csrfToken()
    });
}

const formularioOlvidePassword=(req,res)=>{
    res.render('auth/olvide-password',{
        pagina:'Recupera tu acceso a Bienes Raices'
    });
}

const registrar=async(req,res)=>{
    //validación
    await check('nombre').notEmpty().withMessage('El campo nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('El email no es válido').run(req);
    await check('password').isLength({min:6}).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    //await check('repetir_password').equals('password').withMessage('Los passwords deben ser iguales').run(req);

    let resultado=validationResult(req);

    //verificar que el resultado sea una array vacía, antes de insertar los datos
    if(!resultado.isEmpty()){
        return res.render('auth/registro',{
        pagina:'Crear Cuenta',
        csrfToken:req.csrfToken(),
        errores: resultado.array(),
        usuario:{
            nombre:req.body.nombre,
            email:req.body.email
        }
    });
    }

    //verificar que el email no esté duplicado
    const existeUsuario=await Usuario.findOne({where:{email:req.body.email}});
    if(existeUsuario){
        return res.render('auth/registro',{
        pagina:'Crear Cuenta',
        csrfToken:req.csrfToken(),
        errores: [{msg:'El email ya está registrado'}],
        usuario:{
            nombre:req.body.nombre,
            email:req.body.email
        }
    });
    }
    const {nombre,email,password}=req.body;
    const usuario=await Usuario.create({
        nombre,
        email,
        password,
        token:generarId()
    });

    //envío del email de confirmación
    emailRegistro({
        nombre,
        email,
        token:usuario.token
    });

    //mostrar mensaje de confirmación
    res.render('templates/mensaje',{
        pagina:'Cuenta Creada Correctamente',
        mensaje:'Hemos enviado un Email de Confirmación, presiona en el enlace'
    });
}

const confirmar=async(req,res)=>{
    const token=req.params.token;
    
    //Verificar si el token es válido
    const usuario=await Usuario.findOne({where:{token}});
    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina:'Error al confirmar tu cuenta',
            mensaje:'Hubo un error al confirmar tu cuenta, intentalo de nuevo',
            error:true
        });
    }
    //Confirmar la cuenta
    usuario.token=null;
    usuario.confirmado=true;
    await usuario.save();

    res.render('auth/confirmar-cuenta',{
            pagina:'Cuenta Confirmada',
            mensaje:'La cuenta se confirmó correctamente'
        });

}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar
}