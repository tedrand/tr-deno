import app from "./server/app.ts"

const PORT = parseInt(Deno.env.toObject().PORT) || 8080
app.start({ port: PORT });
console.log(`🦕 Listening on ${PORT}`);
