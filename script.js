const URL_BASE = 'https://evacuation-assistant-rh3a.onrender.com';

// Función para buscar por IATA
async function solicitarAyuda() {
    const iata = document.getElementById('iataInput').value.trim().toUpperCase();
    const textoDiv = document.getElementById('textoRespuesta');
    document.getElementById('respuesta').style.display = 'block';
    textoDiv.innerHTML = "⌛ Analizando espacio aéreo...";

    try {
        const res = await fetch(`${URL_BASE}/evacuacion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aeropuerto: iata })
        });
        const data = await res.json();
        textoDiv.innerHTML = `<h3>Plan de Vuelo (${iata})</h3>` + data.plan.replace(/\n/g, '<br>');
    } catch (e) { textoDiv.innerHTML = "❌ Error en la conexión."; }
}

// Función para detectar ubicación y buscar ruta segura
function detectarUbicacion() {
    const destino = document.getElementById('destinoInput').value.trim();
    const textoDiv = document.getElementById('textoRespuesta');
    
    if (!destino) return alert("Escribe un destino primero.");
    
    document.getElementById('respuesta').style.display = 'block';
    textoDiv.innerHTML = "📡 Localizando señal GPS...";

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        textoDiv.innerHTML = "🧠 Calculando rutas de contingencia...";
        
        try {
            const res = await fetch(`${URL_BASE}/ruta-segura`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat: latitude, lon: longitude, destino: destino })
            });
            const data = await res.json();
            textoDiv.innerHTML = `<h3>Ruta Segura a ${destino}</h3>` + data.plan.replace(/\n/g, '<br>');
        } catch (e) { textoDiv.innerHTML = "❌ Error al conectar con el servidor."; }
    }, () => {
        textoDiv.innerHTML = "❌ Error: Debes permitir el acceso a la ubicación.";
    });
}
