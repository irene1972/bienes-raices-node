import nodemailer from 'nodemailer';

const emailRegistro=async(datos)=>{
    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });
    const {nombre,email,token}=datos;
    //enviar el email
    await transport.sendMail({
        from:'BienesRaices.com',
        to:email,
        subject:'Confirma tu cuenta en BienesRaices.com',
        text:'Confirma tu cuenta en Bienes Raices',
        html:`
                <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
                <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
                <a href="${process.env.BACKEND_URL}:${process.env.SERVER_PORT ?? 3000}/auth/confirmar/${token}">Confirmar tu cuenta</a></p>
                <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    });
}

export {
    emailRegistro
}