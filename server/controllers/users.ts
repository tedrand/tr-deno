export interface User {
    id: string;
    username: string;
    password: string;
}

// TODO: Create Users DB in Hasura, and get from Flask API
const users: Array<User> = [
    {
        id: "1",
        username: Deno.env.toObject().USER,
        password: Deno.env.toObject().PWD
    },
]

console.log(Deno.env.toObject().USER);


export default users;