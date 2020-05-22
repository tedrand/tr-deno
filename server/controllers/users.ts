import { config } from "https://deno.land/x/dotenv/mod.ts";

export interface User {
    id: string;
    username: string;
    password: string;
}

const users: Array<User> = [
    {
        id: "1",
        username: config().USER,
        password: config().PWD
    },
]

export default users;