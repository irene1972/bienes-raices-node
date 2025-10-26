const protegerRuta=async(req,res,next)=>{
    //verificar si hay un token
    console.log(req.cookies);
    /*
    const {_token}=req.cookie;
    if(!_token){
        return res.redirect('/login');
    }
*/
    //comprobar el token


    next();
}

export default protegerRuta;