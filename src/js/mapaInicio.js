(()=>{

    const lat = 42.7257088;
    const lng = -6.6538099;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    let markers=new L.FeatureGroup().addTo(mapa);

    const categoriasSelect=document.querySelector('#categorias');
    const preciosSelect=document.querySelector('#precios');

    const filtros={
        categoria:'',
        precio:''
    }

    let propiedades=[];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //filtrado de categorías y precios
    categoriasSelect.addEventListener('change',e=>{
        filtros.categoria = +e.target.value;
        filtrarPropiedades();
    });

    preciosSelect.addEventListener('change',e=>{
        filtros.precio = +e.target.value;
        filtrarPropiedades();
    });


    const obtenerPropiedades=()=>{
        try {
            const url='/api/propiedades';
            fetch(url,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                }
            })
                .then(response=>response.json())
                .then(data=>{
                    propiedades=data;
                    mostrarPropiedades(propiedades);
                })
                .catch(error=>console.log(error));
        } catch (error) {
            console.log(error);
        }

        
    }

    const mostrarPropiedades=(propiedades)=>{
        //limpiar los markers previos
        markers.clearLayers();

        propiedades.forEach(propiedad=>{
            //agregar los pines
            const marker=new L.marker([propiedad?.lat,propiedad?.lng],{
                autoPan:true
            })
            .addTo(mapa)
            .bindPopup(`
                        <p class='text-indigo-600 font-bold'>${propiedad.categoria.nombre}</p>
                        <h1 class='text-xl font-extrabold uppercase my-3'>${propiedad?.titulo}</h1>
                        <img src='/uploads/${propiedad?.imagen}' alt='Imagen de la propiedad: ${propiedad?.titulo}' />
                        <p class='text-gray-600 font-bold'>${propiedad.precio.nombre}</p>
                        <a href='/propiedad/${propiedad.id}' class='bg-indigo-600 block p-2 text-center font-bold uppercase'>Ver Propiedad</a>
                        `);

            markers.addLayer(marker);
        });
    }

    const filtrarPropiedades=()=>{
        const resultado=propiedades.filter(filtrarCategoria).filter(filtrarPrecio);
        mostrarPropiedades(resultado);
    }

    const filtrarCategoria=propiedad=>{
        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;
    }

    const filtrarPrecio=propiedad=>{
        return filtros.precio ? propiedad.precioId === filtros.precio : propiedad;
    }

    obtenerPropiedades();

})()