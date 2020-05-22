import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application } from "https://deno.land/x/abc/mod.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts";

import { login, auth } from "./server/controllers/auth.ts";
import { getContent } from "./server/controllers/content.ts";
import { authMiddleware } from "./server/authMiddleware.ts";
import { 
    getPort, 
    setStaticHeaders, 
    setPageHeaders,
    dejsRenderer
} from "./server/utils.ts";

const app = new Application();
app.renderer = dejsRenderer;
app.static("/static", "assets", setStaticHeaders);

app.get("/", async (c) => { 
    await c.render("./public/index.ejs", { 
        name: "Ted Rand" 
    });
}, setPageHeaders);

app.get("/about", 
    async (c) => getContent(c, 'about'),
    setPageHeaders);

app.get("/terms", 
    async (c) => getContent(c, 'terms'),
    setPageHeaders);

app.get("/privacy", 
    async (c) => getContent(c, 'privacy'),
    setPageHeaders);

app.get("/login", async (c) => 
    await c.render("./public/login.ejs"));

app.post("/login", login);

app.get("/admin", auth, authMiddleware);

app.get("/admin/index", async (c) => {
    if(await validateJwt(
        c.queryParams.token, 
        config().SECRET_KEY, 
        {isThrowing: false})
    ) {
        await c.render("./public/admin.ejs")
    }
})

app.start({ port: getPort() });

console.log(`🦕 Listening on ${getPort()}`);


