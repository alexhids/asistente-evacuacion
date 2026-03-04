async function solicitarAyuda() {
    const iata = document.getElementById('iataInput').value.trim().toUpperCase();
    const cuadroRespuesta = document.getElementById('respuesta');

    if (iata.length !== 3) {
        alert("Pon un código de 3 letras (Ej: BEY)");
        return;
    }

    cuadroRespuesta.style.display = 'block';
    cuadroRespuesta.innerHTML = "<em>⌛ Conectando con Render...</em>";

    try {
        // ESTA ES TU URL REAL CORREGIDA
        const urlServidor = 'https://evacuation-assistant-rh3a.onrender.com/evacuacion'; 

        const response = await fetch(urlServidor, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ aeropuerto: iata })
        });

        if (!response.ok) {
            throw new Error("El servidor no reconoce la ruta /evacuacion");
        }

        const data = await response.json();
        cuadroRespuesta.innerHTML = "<strong>RESULTADO:</strong><br>" + data.plan;

    } catch (error) {
        console.error("Error detallado:", error);
        cuadroRespuesta.innerHTML = "❌ Error: " + error.message;
    }
}