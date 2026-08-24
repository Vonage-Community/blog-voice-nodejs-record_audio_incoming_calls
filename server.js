require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const { verifySignature } = require("@vonage/jwt");
const { buildRecordingFileName, downloadRecording } = require("./recording");

const port = process.env.PORT || 4002;
const recordingsDir = path.join(__dirname, "recordings");

fs.mkdirSync(recordingsDir, { recursive: true });

const app = express();
app.set("trust proxy", 1);
app.use(bodyParser.json());

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Unauthorized");
    }

    const jwtToken = authHeader.split(" ")[1];

    if (!verifySignature(jwtToken, process.env.VONAGE_API_SIGNATURE_SECRET)) {
      return res.status(401).send("Unauthorized");
    }

    next();
  } catch (err) {
    return res.status(401).send("Unauthorized");
  }
};

const onInboundCall = (request, response) => {
  const ncco = [
    {
      action: "talk",
      text: "Please leave your message after the tone, then press hash when finished.",
    },
    {
      action: "record",
      eventUrl: [`${request.protocol}://${request.get("host")}/record`],
      endOnSilence: 3,
      endOnKey: "#",
      beepStart: true,
      timeOut: 60,
    },
    {
      action: "talk",
      text: "Thank you for your message. Goodbye!",
    },
  ];

  response.json(ncco);
};

const onCallEvent = (request, response) => {
  response.status(204).send();
};

const onRecording = async (request, response) => {
  const audioURL = request.body.recording_url;

  if (!audioURL) {
    return response.status(204).send();
  }

  const fileName = buildRecordingFileName(audioURL);
  const audioFile = path.join(recordingsDir, fileName);

  try {
    await downloadRecording(audioURL, audioFile);
  } catch (err) {
    console.error("Error downloading recording:", err.message);
  }

  response.status(204).send();
};

app
  .get("/webhooks/answer", onInboundCall)
  .post("/webhooks/event", verifyJWT, onCallEvent)
  .post("/record", verifyJWT, onRecording)
  .post("/webhooks/recordings", verifyJWT, onRecording);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
