const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();

// PERMISOS DE CONEXIÓN (CORS)
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST']
}));
app.use(express.json());

// CONFIGURACIÓN DE IA (Usa las variables de Render)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/evacuacion', async (req, res) => {
    const { aeropuerto } = req.body;
    const FLIGHT_API_KEY = process.env.FLIGHT_API_KEY;

    try {
        // 1. Obtener datos de vuelos
        const vuelosRes = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=${FLIGHT_API_KEY}&departure_iata=${aeropuerto}`);
        const datosVuelos = vuelosRes.data.data ? vuelosRes.data.data.slice(0, 10) : [];

        // 2. Consultar a la IA
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Actúa como un experto en logística de evacuación en zonas de crisis. 
        Datos de vuelos actuales en el aeropuerto ${aeropuerto}: ${JSON.stringify(datosVuelos)}. 
        Analiza cuáles vuelos NO están cancelados y sugiere la mejor ruta de salida. 
        Si no hay vuelos, sugiere buscar rutas terrestres hacia fronteras seguras. 
        Responde de forma clara, directa y en español.`;

        const result = await model.generateContent(prompt);
        const respuestaIA = result.response.text();

        res.json({ plan: respuestaIA });

    } catch (error) {
        console.error(error);
        res.status(500).json({ plan: "Error obteniendo datos. Revisa si el código de aeropuerto es correcto o si la API de vuelos tiene créditos." });
    }
});

// PUERTO PARA RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));