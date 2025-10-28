(()=>{

    const lat = 42.7257088;
    const lng = -6.6538099;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    let markers=new L.FeatureGroup().addTo(mapa);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

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
                    mostrarPropiedades(data);
                })
                .catch(error=>console.log(error));
        } catch (error) {
            console.log(error);
        }

        
    }

    const mostrarPropiedades=(propiedades)=>{
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

    obtenerPropiedades();

})()