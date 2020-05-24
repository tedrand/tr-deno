import { MiddlewareFunc } from "https://deno.land/x/abc/mod.ts";

// Set headers for different types of static files that get sent across the server
export const setStaticHeaders: MiddlewareFunc = next => c => {
    if (c.path.indexOf("/static/images/") === 0) {
        c.response.headers = new Headers({
            "cache-control": "public, max-age=2592000",
            "expires": new Date(Date.now() + 2592000000).toUTCString(),
            "last-modified": new Date(Date.now()).toUTCString()
        })
    }
    
    return next(c);
}

export const setPageHeaders: MiddlewareFunc = next => c => {
    c.response.headers = new Headers({
        "cache-control": "public, max-age=604800, immutable",
        "expires": new Date(Date.now() + 604800).toUTCString(),
        "last-modified": new Date(Date.now()).toUTCString()
    });

    return next(c)
}