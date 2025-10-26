import {check,validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { generarId } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

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
    //validación
    res.render('auth/olvide-password',{
            pagina:'Recupera tu acceso a Bienes Raices',
            csrfToken:req.csrfToken()
        });
}

const resetPassword=async(req,res)=>{

    const {email}=req.body;
    if(!email){
        res.render('auth/olvide-password',{
            pagina:'Recupera tu acceso a Bienes Raices',
            csrfToken:req.csrfToken(),
            errores: 'El campo email es obligatorio'
            //email:req.body.email
        });
    }

    //Buscar el usuario
    
    const usuario=await Usuario.findOne({where:{email}});
    console.log(usuario);
    if(!usuario){
        res.render('auth/olvide-password',{
            pagina:'Recupera tu acceso a Bienes Raices',
            csrfToken:req.csrfToken(),
            errores: 'El usuario no está registrado en nuestro sitio web'
        });
    }

    //Generar unn token y guardarlo en la base de datos
    usuario.token=generarId();
    await usuario.save();    
    
    // enviar un email
    emailOlvidePassword({
        email,
        nombre:usuario.nombre,
        token:usuario.token
    });

    //renderizar mensaje de confirmación
    res.render('templates/mensaje',{
            pagina:'Restablece tu Password',
            //csrfToken:req.csrfToken(),
            mensaje: 'Hemos enviado un email con las instrucciones'
        });
}

const comprobarToken=async(req,res)=>{
    const token=req.params.token;
    const usuario=await Usuario.findOne({where:{token}});
    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina:'Restablece tu password',
            mensaje:'Hubo un error al validar tu información, intentalo de nuevo',
            error:true
        });
    }

    //mostrar formulario para que pueda agregar un nuevo password
    return res.render('auth/reset-password',{
            pagina:'Restablece tu password',
            csrfToken:req.csrfToken()
        });

}

const nuevoPassword=async(req,res)=>{
    //validar el password
    const password=req.body.password;
    const token=req.params.token;

    if(!password || password.length<6){
        res.render('auth/reset-password',{
            pagina:'Restablece tu password',
            csrfToken:req.csrfToken(),
            errores: 'El password debe contener almenos 6 carácteres'
        });
    }

    //identificar quien hace el cambio
    const usuario=await Usuario.findOne({where:{token}});

    //hashear el nuevo password
    const salt=await bcrypt.genSalt(10);
    usuario.password=await bcrypt.hash(password,salt);

    //borrar el token de la bd y guardar también en nuevo password
    usuario.token=null;
    await usuario.save();

    //renderizar mensaje de confirmación
    res.render('auth/confirmar-cuenta',{
            pagina:'Password restablecido',
            //csrfToken:req.csrfToken(),
            mensaje: 'El password se guardó correctamente'
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
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword
}