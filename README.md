# How to Record Audio from Incoming Calls with Node.js

Record audio using the Control Objects of the Vonage Voice API

## Prerequisites

- Vonage account with Voice API credentials
- Node.js installed
- `dotenv` for environment variables

## Setup and Installation

Follow the steps below to set up and run this application:

1. **Create a Voice API application:** Use your Vonage account to create a new voice app. Link an existing number to it or purchase a new one.

2. **Start an ngrok tunnel:** Run `ngrok http 4002` in your terminal to start an ngrok tunnel.

3. **Configure environment variables:** Rename the `.env.example` file to `.env` and set `VONAGE_APPLICATION_ID`, `VONAGE_PRIVATE_KEY`, and `VONAGE_API_SIGNATURE_SECRET`.

4. **Install dependencies:** Run `npm install` in your terminal from the project's root directory.

5. **Start the application:** Run `node server.js` to start the app, which will start on `http://localhost:4002`.

## Recording downloads

The server now downloads each recording using the documented Vonage file client flow. When a webhook delivers a `recording_url`, the app saves the file into the `/recordings` directory with an `.mp3` extension.

