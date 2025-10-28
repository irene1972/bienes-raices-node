const inicio=(req,res)=>{
    res.send('inicio...');
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