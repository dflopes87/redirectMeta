import axios from "axios";

const VERIFY_TOKEN = "lindaFruta";
const POWER_AUTOMATE_URL = "https://default6fcf4bf61ec64b2f98851cc7158ad9.1c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/69d97c71c6a0473084efa292f486b7d0/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=slngHJ-UVNNwIig45roktMzP7mLnFzlXcwGAnLh-jL4";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Token inválido");
    }
  }

  if (req.method === "POST") {
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        console.error("Erro ao fazer parse do body:", err);
        return res.status(400).send("Body inválido");
      }
    }

    console.log("Recebido da Meta:", body);

    try {
      await axios.post(POWER_AUTOMATE_URL, body);
      return res.status(200).send("Encaminhado com sucesso");
    } catch (error) {
      console.error("Erro ao encaminhar para Power Automate:", error.message);
      return res.status(500).send("Erro ao encaminhar");
    }
  }

  res.status(405).send("Método não permitido");
};
