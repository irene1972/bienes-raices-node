(function() {
    const lat = 42.7257088;
    const lng = -6.6538099;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()