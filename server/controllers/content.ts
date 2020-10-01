interface Content {
  content: string;
  date_created: any;
  html_str: string;
  id: Number;
  last_updated: any;
  meta_description: string;
  title: string;
  slug: string;
}

const contents =
  JSON.parse(Deno.readTextFileSync("./assets/cache/blog.json")).items;

export const getContent = async (c: any, slug: string) => {
  for (var i = 0; i < contents.length; i++) {
    if (contents[i].slug == slug) {
      await c.render(`./public/content.ejs`, {
        content: contents[i],
        canonical: c.url,
      });
    }
  }
};
