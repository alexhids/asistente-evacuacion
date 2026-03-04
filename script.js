async function solicitarAyuda() {
    const iata = document.getElementById('iataInput').value;
    const cuadroRespuesta = document.getElementById('respuesta');

    if (iata.length !== 3) {
        alert("Por favor, introduce un código válido de 3 letras.");
        return;
    }

    // Mostramos que estamos trabajando
    cuadroRespuesta.style.display = 'block';
    cuadroRespuesta.innerHTML = "<em>⌛ Conectando con bases de datos de aviación y analizando riesgos con IA...</em>";

    try {
        // IMPORTANTE: Aquí pondrás la dirección de tu servidor cuando lo subas a Render
        const direccionServidor = 'https://evacuation-assistant-rh3a.onrender.com/evacuacion'; 

        const response = await fetch(direccionServidor, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ aeropuerto: iata })
        });

        const data = await response.json();

        // Mostramos el plan que generó Gemini
        cuadroRespuesta.innerHTML = "<strong>Plan de Evacuación Sugerido:</strong><br><br>" + data.plan;

    } catch (error) {
        cuadroRespuesta.innerHTML = "❌ Error: No se pudo conectar con el servidor de emergencia. Verifica tu conexión.";
        console.error("Error:", error);
    }
}