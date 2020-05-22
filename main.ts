import { Application } from "https://deno.land/x/abc/mod.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import { getPort, setStaticHeaders } from "./server/utils.ts";

const app = new Application();

app.renderer = {
    render<T>(name: string, data: T): Promise<Deno.Reader> {
        return renderFile(name, data);
    },
};

app.static("/static", "assets", setStaticHeaders);

app.get("/", async (c) => { 
    c.response.headers = new Headers({
        "cache-control": "public, max-age=604800, immutable",
        "expires": new Date(Date.now() + 604800).toUTCString()
    })

    await c.render("./public/index.ejs", { 
        name: "Ted Rand" 
    });
})

app.get("/about", async (c) => {
    let ctx = c
    await fetch(`https://pycourt.herokuapp.com/contents/about`)
        .then((resp) => resp.json())
        .then(async function(data) {
            console.log(data)
            await ctx.render("./public/staticPage.ejs", {
                data: data[0]
            });
            
        })
})

app.get("/terms", async (c) => {
    let ctx = c
    await fetch(`https://pycourt.herokuapp.com/contents/terms`)
        .then((resp) => resp.json())
        .then(async function(data) {
            console.log(data)
            await ctx.render("./public/staticPage.ejs", {
                data: data[0]
            });
            
        })
})

app.get("/privacy", async (c) => {
    let ctx = c
    await fetch(`https://pycourt.herokuapp.com/contents/privacy`)
        .then((resp) => resp.json())
        .then(async function(data) {
            console.log(data)
            await ctx.render("./public/staticPage.ejs", {
                data: data[0]
            });
            
        })
})

app.start({ port: getPort() });

console.log(`🦕 Listening on ${getPort()}`);


