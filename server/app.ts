import { Application } from "https://deno.land/x/abc/mod.ts";
import { cors } from "https://deno.land/x/abc/middleware/cors.ts";
import { getContent } from "./controllers/content.ts";
import { getCases } from './controllers/tracker.ts';
import { DejsRenderer } from './renderers.ts';
import { setStaticHeaders, setPageHeaders } from "./middleware/headersMiddleware.ts";
import { getOpinion } from "./controllers/opinion.ts";

const app = new Application();
app.renderer = DejsRenderer;
app.static("/static", "assets", cors(), setStaticHeaders);

// Static Pages
app.get("/", async (c) => { await c.render("./public/index.ejs") }, setPageHeaders);
app.get("/about", async (c) => getContent(c, "about"), setPageHeaders);
app.get("/terms", async (c) => getContent(c, "terms"), setPageHeaders);
app.get("/privacy", async (c) => getContent(c, "privacy"), setPageHeaders);

app.get("/blog", async (c) => { await c.render("./public/blog.ejs") }, setPageHeaders);

// Court Tracker
app.get("/tracker/:ct", getCases);
app.get("/opinion/:id", getOpinion);

// Static Files
app.file("/robots.txt", "./assets/robots.txt");
app.file("/sitemap.xml", "./assets/sitemap.xml");

export default app;