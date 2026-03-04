async function solicitarAyuda() {
    const iata = document.getElementById('iataInput').value.trim().toUpperCase();
    const cuadroRespuesta = document.getElementById('respuesta');

    if (iata.length !== 3) {
        alert("Por favor, pon un código de 3 letras (Ej: BEY o MAD)");
        return;
    }

    cuadroRespuesta.style.display = 'block';
    cuadroRespuesta.innerHTML = "<em>⌛ Conectando con el servidor... Si es la primera vez en 15 min, puede tardar 40 segundos en despertar.</em>";

    try {
        // CAMBIA ESTA URL POR LA TUYA DE RENDER
        const urlServidor = 'https://evacuation-assistant-rh3a.onrender.com/evacuacion'; 

        const response = await fetch(urlServidor, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ aeropuerto: iata })
        });

        if (!response.ok) {
            throw new Error("El servidor respondió con error. Revisa tus llaves API en Render.");
        }

        const data = await response.json();
        cuadroRespuesta.innerHTML = "<strong>Resultados del análisis:</strong><br><br>" + data.plan;

    } catch (error) {
        console.error("Error detallado:", error);
        cuadroRespuesta.innerHTML = "❌ Error de conexión. El servidor de Render podría estar arrancando o la URL es incorrecta.";
    }
}