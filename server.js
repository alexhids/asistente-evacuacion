const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// El motor Gemini 3 Flash de última generación
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = "gemini-3-flash-preview"; 

// Ruta 1: Vuelos por IATA
app.post('/evacuacion', async (req, res) => {
    const { aeropuerto } = req.body;
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const vuelosRes = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=${process.env.FLIGHT_API_KEY}&departure_iata=${aeropuerto}`);
        const datosVuelos = vuelosRes.data.data ? vuelosRes.data.data.slice(0, 3) : [];

        const prompt = `Analiza estos vuelos desde ${aeropuerto}: ${JSON.stringify(datosVuelos)}. Sugiere un plan de evacuación inmediato en español.`;
        const result = await model.generateContent(prompt);
        res.json({ plan: result.response.text() });
    } catch (error) {
        console.error("Error en /evacuacion:", error);
        res.status(500).json({ plan: "Error procesando vuelos con Gemini 3." });
    }
});

// Ruta 2: Rutas de Contingencia por GPS
app.post('/ruta-segura', async (req, res) => {
    const { lat, lon, destino } = req.body;
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const prompt = `El usuario está en Lat: ${lat}, Lon: ${lon} y quiere ir a ${destino}. 
        Considera posibles conflictos bélicos actuales. Sugiere rutas alternativas seguras, 
        países puente y transporte terrestre o marítimo si los vuelos están cancelados. Responde en español.`;
        
        const result = await model.generateContent(prompt);
        res.json({ plan: result.response.text() });
    } catch (error) {
        console.error("Error en /ruta-segura:", error);
        res.status(500).json({ plan: "Error calculando ruta segura con Gemini 3." });
    }
});

app.get('/', (req, res) => res.send("Servidor S.E.I. (Gemini 3 Engine) Activo ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor operando en puerto ${PORT}`));



