import axios from "axios";

const VERIFY_TOKEN = "lindaFruta";
const POWER_AUTOMATE_URL = "https://prod-18.brazilsouth.logic.azure.com:443/workflows/8b790b85559546959f170cd3a8d5ab14/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=v5-kCqk3msfp4hwirmvPHbxJpJgkC2XpooJDsWYldGE";

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
