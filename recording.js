const fs = require("fs");
const { FileClient } = require("@vonage/server-client");

const buildRecordingFileName = (audioURL) => {
  const parsedUrl = new URL(audioURL);
  const fileName = parsedUrl.pathname.split("/").filter(Boolean).pop();

  return `${fileName || "recording"}.mp3`;
};

const getPrivateKey = (privateKeyInput) => {
  if (!privateKeyInput) {
    throw new Error("Missing VONAGE_PRIVATE_KEY environment variable");
  }

  if (fs.existsSync(privateKeyInput)) {
    return fs.readFileSync(privateKeyInput, "utf8");
  }

  return privateKeyInput;
};

const createFileClient = () => {
  const applicationId = process.env.VONAGE_APPLICATION_ID;
  const privateKey = getPrivateKey(process.env.VONAGE_PRIVATE_KEY);

  if (!applicationId) {
    throw new Error("Missing VONAGE_APPLICATION_ID environment variable");
  }

  return new FileClient({
    applicationId,
    privateKey,
  });
};

const downloadRecording = async (audioURL, audioFile) => {
  const fileClient = createFileClient();
  await fileClient.downloadFile(audioURL, audioFile);
};

module.exports = {
  buildRecordingFileName,
  downloadRecording,
  createFileClient,
};
