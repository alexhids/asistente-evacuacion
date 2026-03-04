const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI("TU_API_KEY_DE_GEMINI");
const FLIGHT_API_KEY = "TU_API_KEY_DE_AVIATIONSTACK";

app.post('/evacuacion', async (req, res) => {
    const { aeropuerto } = req.body;

    try {
        // 1. Obtener vuelos reales del aeropuerto
        const vuelosRes = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=${FLIGHT_API_KEY}&departure_icao=${aeropuerto}`);
        const vuelos = vuelosRes.data.data.slice(0, 10); // Solo los primeros 10 para no saturar

        // 2. Pedir a Gemini que analice
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Actúa como un experto en logística humanitaria. Analiza estos vuelos: ${JSON.stringify(vuelos)}. 
        El usuario está en el aeropuerto ${aeropuerto}. Indica cuáles NO están cancelados y sugiere la ruta más segura para salir hacia un país neutral. 
        Responde en español, con calma y claridad.`;

        const result = await model.generateContent(prompt);
        res.json({ plan: result.response.text() });

    } catch (error) {
        res.status(500).json({ plan: "Error obteniendo datos en tiempo real." });
    }
});

app.listen(3000, () => console.log("Servidor listo"));