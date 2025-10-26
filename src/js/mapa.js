(function() {
    const lat = 42.7257088;
    const lng = -6.6538099;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;
    
    //utilizar Provider y Geocoder
    const geocodeService=L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Pin de posicionamiento
    marker=new L.marker([lat,lng],{
        draggable:true,
        autoPan:true
    })
    .addTo(mapa);

    //detectar el movimiento del pin y leer su latitud y su longitud
    marker.on('moveend',function(e){
        marker=e.target;
        const posicion=marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng));

        //obtener la información de la calle al soltar el pin
        geocodeService.reverse().latlng(posicion,16).run(function(error,resultado){
            marker.bindPopup(resultado.address.LongLabel);

            //llenar los campos hidden
            document.querySelector('.calle').textContent=resultado?.address?.Address ?? '';
            document.querySelector('#lat').value=resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value=resultado?.latlng?.lng ?? '';
        });

    });

})()