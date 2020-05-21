import { Application } from "https://deno.land/x/oak/mod.ts"
import * as flags from "https://deno.land/std/flags/mod.ts"

const app = new Application()

const { args, exit } = Deno
const argPort = flags.parse(args).port
const port = argPort ? Number(argPort) : 8080

if (isNaN(port)) {
    console.log("port is not number")
    exit(1)
}

app.use((ctx) => {
  ctx.response.body = "Hello World!"
});

await app.listen({ port: port })