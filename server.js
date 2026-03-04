const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
app.use(cors()); // Permiso universal
app.use(express.json());

// Ruta de prueba para confirmar que el servidor responde
app.get('/', (req, res) => res.send("SERVIDOR FUNCIONANDO ✅"));

app.post('/evacuacion', async (req, res) => {
    console.log("Petición recibida para el aeropuerto:", req.body.aeropuerto);
    
    try {
        const { aeropuerto } = req.body;
        
        // Verificamos que las llaves existan en Render
        if (!process.env.GEMINI_API_KEY || !process.env.FLIGHT_API_KEY) {
            return res.json({ plan: "Error: Faltan las llaves API en la configuración de Render." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const FLIGHT_API_KEY = process.env.FLIGHT_API_KEY;

        // Llamada a la API de vuelos
        const vuelosRes = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=${FLIGHT_API_KEY}&departure_iata=${aeropuerto}`);
        const datosVuelos = vuelosRes.data.data ? vuelosRes.data.data.slice(0, 3) : [];

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Analiza estos vuelos: ${JSON.stringify(datosVuelos)}. Sugiere ruta de evacuación para ${aeropuerto} en español.`;

        const result = await model.generateContent(prompt);
        res.json({ plan: result.response.text() });

    } catch (error) {
        console.error("ERROR INTERNO:", error.message);
        res.status(500).json({ plan: "El servidor tuvo un error al procesar la IA o los vuelos." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor listo"));