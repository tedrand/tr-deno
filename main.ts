import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application } from "https://deno.land/x/abc/mod.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";

import { login, auth } from "./server/controllers/auth.ts";
import { getContent } from "./server/controllers/content.ts";
import { authMiddleware } from "./server/middleware/authMiddleware.ts";
import {
  setStaticHeaders,
  setPageHeaders,
} from "./server/middleware/headersMiddleware.ts";

const PORT = parseInt(Deno.env.toObject().PORT) || 8080

const app = new Application();
app.renderer = {
    render<T>(name: string, data: T): Promise<Deno.Reader> {
        return renderFile(name, data);
    },
};
app.static("/static", "assets", setStaticHeaders);

app.get("/", async (c) => {
  await c.render("./public/index.ejs");
}, setPageHeaders);

app.get("/about", async (c) => getContent(c, "about"), setPageHeaders);
app.get("/terms", async (c) => getContent(c, "terms"), setPageHeaders);
app.get("/privacy", async (c) => getContent(c, "privacy"), setPageHeaders);

app.get("/login", async (c) => await c.render("./public/login.ejs"));
app.post("/login", login);

app.get("/auth", auth, authMiddleware);
app.get("/admin/index", async (c) => {
  if (
    await validateJwt(
      c.queryParams.token,
      Deno.env.toObject().SECRET_KEY,
      { isThrowing: false },
    )
  ) {
    await c.render("./public/admin.ejs");
  }
});

app.start({ port: PORT });

console.log(`🦕 Listening on ${PORT}`);
