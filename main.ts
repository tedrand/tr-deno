import { Application } from "https://deno.land/x/abc/mod.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { getContent } from "./server/controllers/content.ts";
import { setStaticHeaders, setPageHeaders } from "./server/middleware/headersMiddleware.ts";

const app = new Application();
app.renderer = {
    render<T>(name: string, data: T): Promise<Deno.Reader> {
        return renderFile(name, data);
    },
};
app.static("/static", "assets", setStaticHeaders);

app.get("/", async (c) => { await c.render("./public/index.ejs") }, setPageHeaders);
app.get("/about", async (c) => getContent(c, "about"), setPageHeaders);
app.get("/terms", async (c) => getContent(c, "terms"), setPageHeaders);
app.get("/privacy", async (c) => getContent(c, "privacy"), setPageHeaders);

app.file("/robots.txt", "./assets/robots.txt");
app.file("/sitemap.xml", "./assets/sitemap.xml");

const PORT = parseInt(Deno.env.toObject().PORT) || 8080
app.start({ port: PORT });
console.log(`🦕 Listening on ${PORT}`);
