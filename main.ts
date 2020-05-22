import { Application } from "https://deno.land/x/abc/mod.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { getPort } from "./server/utils.ts";

const app = new Application();

app.renderer = {
    render<T>(name: string, data: T): Promise<Deno.Reader> {
        return renderFile(name, data);
    },
};

app.static("/static", "assets");

app.get("/", async (c) => { 
    console.log(c.response.headers);
    c.response.headers = new Headers({
        "cache-control": "public, max-age=604800, immutable"
    })
    console.log(c.response.headers)
    await c.render("./public/index.ejs", { 
        name: "Ted Rand" 
    });
})

app.start({ port: getPort() });

console.log(`🦕 Listening on ${getPort()}`);


