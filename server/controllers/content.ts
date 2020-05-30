interface Content {
  content: string;
  date_created: any;
  html_str: string;
  id: Number;
  last_updated: any;
  meta_description: string;
  title: string;
}

export const getContent = async (c: any, slug: string) => {
  await fetch(`${Deno.env.toObject().BASE_PATH}/static/cache/blog.json`)
    .then((resp) => resp.json())
    .then(async function (data) {
      for (var i = 0; i < data.items.length; i++) {
        if (data.items[i].slug == slug) {
          await c.render(`./public/content.ejs`, {
            content: data.items[i],
            canonical: c.url
          });
        }
      }
    });
};
