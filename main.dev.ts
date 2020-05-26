import "https://deno.land/x/dotenv/load.ts";
import app from "./server/app.ts";

app.start({ port: 8080 });
console.log(`🦕 Listening on ${8080}`);