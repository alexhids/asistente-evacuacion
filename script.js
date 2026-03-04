async function solicitarAyuda() {
    const iata = document.getElementById('iataInput').value.trim().toUpperCase();
    const cuadroRespuesta = document.getElementById('respuesta');

    if (iata.length !== 3) {
        alert("Pon un código de 3 letras (Ej: BEY)");
        return;
    }

    cuadroRespuesta.style.display = 'block';
    cuadroRespuesta.innerHTML = "<em>⌛ Conectando... Si el servidor estaba dormido, tardará unos 40 segundos.</em>";

    try {
        const urlServidor = 'https://evacuation-assistant-rh3a.onrender.com/evacuacion'; 

        const response = await fetch(urlServidor, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ aeropuerto: iata })
        });

        const data = await response.json();
        cuadroRespuesta.innerHTML = "<strong>INSTRUCCIONES DE SALIDA:</strong><br><br>" + data.plan;

    } catch (error) {
        console.error("Error:", error);
        cuadroRespuesta.innerHTML = "❌ Error de conexión. El servidor de Render sigue arrancando o la URL es incorrecta.";
    }
}