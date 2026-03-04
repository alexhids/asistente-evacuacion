const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();

// Permisos totales para evitar el error de "Blocked by CORS"
app.use(cors());
app.use(express.json());

// Esta es la ruta que tu navegador va a buscar
app.post('/evacuacion', async (req, res) => {
    const { aeropuerto } = req.body;
    console.log("Buscando para:", aeropuerto);

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Llamada a la API de vuelos
        const vuelosRes = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=${process.env.FLIGHT_API_KEY}&departure_iata=${aeropuerto}`);
        const datosVuelos = vuelosRes.data.data ? vuelosRes.data.data.slice(0, 3) : [];

        const prompt = `Analiza vuelos en ${aeropuerto}: ${JSON.stringify(datosVuelos)}. Sugiere ruta de evacuación en español.`;
        const result = await model.generateContent(prompt);
        
        res.json({ plan: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ plan: "Error en el servidor al conectar con la IA." });
    }
});

// Ruta de diagnóstico (lo que ves al entrar a la URL)
app.get('/', (req, res) => {
    res.send("Servidor de Evacuación Online ✅ - Esperando peticiones POST en /evacuacion");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));


