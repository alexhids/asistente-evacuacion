const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send("Servidor de Emergencia Online 📡"));

app.post('/evacuacion', async (req, res) => {
    try {
        const { aeropuerto } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const FLIGHT_API_KEY = process.env.FLIGHT_API_KEY;

        const vuelosRes = await axios.get(`http://api.aviationstack.com/v1/flights?access_key=${FLIGHT_API_KEY}&departure_iata=${aeropuerto}`);
        const datosVuelos = vuelosRes.data.data ? vuelosRes.data.data.slice(0, 5) : [];

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `USUARIO EN ZONA DE CONFLICTO. Aeropuerto: ${aeropuerto}. Vuelos detectados: ${JSON.stringify(datosVuelos)}. INSTRUCCIÓN: Indica vuelos NO cancelados. Si todo está cancelado, sugiere evacuación terrestre a países vecinos. Responde breve y claro en español.`;

        const result = await model.generateContent(prompt);
        res.json({ plan: result.response.text() });

    } catch (error) {
        console.error(error);
        res.status(500).json({ plan: "Error en el servidor. Verifica las llaves API en Render." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Puerto: ${PORT}`));