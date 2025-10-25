import {check,validationResult} from 'express-validator';
import Usuario from '../models/Usuario.js';

const formularioLogin=(req,res)=>{
    res.render('auth/login',{
        pagina:'Iniciar Sesión'
    });
}

const formularioRegistro=(req,res)=>{
    res.render('auth/registro',{
        pagina:'Crear cuenta'
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
        errores: [{msg:'El email ya está registrado'}],
        usuario:{
            nombre:req.body.nombre,
            email:req.body.email
        }
    });
    }

    const usuario=await Usuario.create(req.body);
    res.json(usuario);
}
export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}