import { MiddlewareFunc } from "https://deno.land/x/abc/mod.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts";

const key = config().SECRET_KEY;

export const authMiddleware: MiddlewareFunc = next => async c => {
    const headers: Headers = c.request.headers;

    
    const authorization = headers.get('Authorization')
    if (!authorization) {
        c.response.status = 401;
        return;
    }
    console.log(authorization.split(' ')[1]);
    
    const jwt = authorization.split(' ')[1];
    if (!jwt) {
        c.response.status = 401;
        c.response.body = `{
            message: 'Error finding jwt token'
        }`
    }
    if(await validateJwt(jwt, key, {isThrowing: false})) {
        return next(c);
    }
    
    c.response.status = 401;
    c.response.body = `{
        message: 'Invalid jwt token'
    }`
}