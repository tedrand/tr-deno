# Personal Website: Theodore Rand

This is a personal website written in the new language, Deno, that serves AMP pages and also hosts some of my professional content.

# Getting Started

To run the app, just hop into the root directory, create a .env file, and set the appropriate API Key. Once the environmental variables are set, the app can be run from the terminal using the command: 

```
deno run --allow-net --allow-read --allow-env main.dev.ts
```

The development app runs from a separate main file because Deno does not allow conditional imports (AFAIK), so dotenv can't be imported in the deployment environment where the app will be receiving actual environment variables instead of a .env file.

Optionally, the app can be run with a "hot reload" by running the following script:

```
# install denon to local machine environment
deno install --allow-read --allow-run --allow-write -f --unstable https://deno.land/x/denon/denon.ts

denon run --allow-net --allow-read --allow-env main.dev.ts
```

The command to run denon locall can also be executed by running dev.sh:

```
bash dev.sh
```

# AMP Pages


The site uses the AMP framework on the front end. To validate the AMP html created by the DEJS views, append the following to the page url that you are testing:

`
#development=amp

e.g., localhost:8080/tracker#development=amp
`