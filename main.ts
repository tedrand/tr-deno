import { Application } from "https://deno.land/x/abc/mod.ts";
import { getPort } from "./server/utils.ts";

const app = new Application()

app.static("/public", "public")

app.file("/", "public/index.html")

console.log(`🦕 Listening on ${getPort()}`);
await app.start({ port: getPort() });

