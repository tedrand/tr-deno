import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Context } from "https://deno.land/x/abc/mod.ts";
import { makeJwt, setExpiration, Jose, Payload } from "https://deno.land/x/djwt/create.ts";
import users from "./users.ts";

const key = config().SECRET_KEY;

const header: Jose = {
    alg: "HS256",
    typ: "JWT"
}

export const login = async (c: Context) => {
    const value: any = await c.body();

    for (const user of users) {
        if (value.username === user.username && value.password === user.password) {
            const payload: Payload = {
                iss: user.username,
                exp: setExpiration(new Date().getTime() + 60000)
            }
            const jwt = makeJwt({key, header, payload});
            if (jwt) {
                console.log('sending jwt');
                
                c.response.status = 200;
                c.response.body = JSON.stringify({
                    id: user.id,
                    username: user.username,
                    jwt
                })
            } else {
                c.response.status = 500;
                c.response.body = `{
                    message: 'Internal Server error'
                }`
            }
            return;
        }
    }

    c.response.status = 422;
    c.response.body = `{
        message: 'Invalid username or password'
    }`
    
};

export const auth = async (c: Context) => {
    console.log("running auth");
    
    await c.render("./public/admin.ejs");
};