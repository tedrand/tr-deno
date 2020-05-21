import { Application } from "https://deno.land/x/abc/mod.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { getPort } from "./server/utils.ts";

const app = new Application();

app.renderer = {
    render<T>(name: string, data: T): Promise<Deno.Reader> {
        return renderFile(name, data);
    },
};

app
    .static("/static", "assets")
    .get("/", async (c) => { 
        await c.render("./public/index.ejs", { 
            name: "Ted Rand" 
        });
    })
    .start({ port: getPort() });

console.log(`🦕 Listening on ${getPort()}`);


