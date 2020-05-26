# Personal Website: Theodore Rand

This is a personal website written in the new language, Deno, that serves AMP pages and also hosts some of my professional content.

# Getting Started

To run the app, just hop into the root directory, create a .env file, and set the appropriate API Key.

The site uses the AMP framework on the front end. To validate the AMP html created by the DEJS views, append the following to the page url that you are testing:

`
#development=amp

e.g., localhost:8080/tracker#development=amp
`