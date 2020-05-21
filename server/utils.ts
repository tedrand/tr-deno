import * as flags from "https://deno.land/std/flags/mod.ts";

export function getPort() {
    const { args, exit } = Deno;
    const argPort = flags.parse(args).port;
    const port = argPort ? Number(argPort) : 8080;
    if (isNaN(port)) {
        console.log("port is not number");
        exit(1);
    }
    return port;
}