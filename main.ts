import { Application } from "https://deno.land/x/abc/mod.ts";
import { getContent } from "./server/controllers/content.ts";
import { getCases } from './server/controllers/tracker.ts';
import "https://deno.land/x/dotenv/load.ts";
import { cors } from "https://deno.land/x/abc/middleware/cors.ts";

import { DejsRenderer } from './server/renderers.ts';
import { setStaticHeaders, setPageHeaders } from "./server/middleware/headersMiddleware.ts";
import { getOpinion } from "./server/controllers/opinion.ts";

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
app.get("/tracker/:ct", async (c) => getCases({ c, key: Deno.env.get('CTLSTNR_KEY') }), setPageHeaders);
app.get("/opinion/:id", async (c) => getOpinion({ c, key: Deno.env.get('CTLSTNR_KEY') }), setPageHeaders);

// Static Files
app.file("/robots.txt", "./assets/robots.txt");
app.file("/sitemap.xml", "./assets/sitemap.xml");

const PORT = parseInt(Deno.env.toObject().PORT) || 8080
app.start({ port: PORT });
console.log(`🦕 Listening on ${PORT}`);
