const inicio=(req,res)=>{
    
    res.render('inicio',{
        pagina:'Inicio'
    });
    
}

const categoria=(req,res)=>{
    res.send('categoria...');
}

const noEncontrado=(req,res)=>{
    res.send('no encontrado...');
}

const buscador=(req,res)=>{
    res.send('buscador...');
}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}