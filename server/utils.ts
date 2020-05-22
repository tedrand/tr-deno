import { MiddlewareFunc } from "https://deno.land/x/abc/mod.ts";
import * as flags from "https://deno.land/std/flags/mod.ts";

// Determine if the app is running from a specific port in production
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

// Set headers for different types of static files that get sent across the server
export const setStaticHeaders: MiddlewareFunc = next => c => {
    if (c.path.indexOf("/static/images/") === 0) {
        c.response.headers = new Headers({
            "cache-control": "public, max-age=2592000",
            "expires": new Date(Date.now() + 2592000000).toUTCString()
        })
    }
    
    return next(c);
}