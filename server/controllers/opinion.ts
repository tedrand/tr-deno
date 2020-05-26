import { Context } from "https://deno.land/x/abc/mod.ts";
import { formatLocalPath } from "../utils.ts"

export const getOpinion = async ({ c, key }: { c: Context; key: any }) => {
    const { id } = c.params;
    
    await fetch(
      `https://www.courtlistener.com/api/rest/v3/opinions/${id}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Token ${key}`,
        },
      },
    )
      .then((resp) => resp.json())
      .then(async function (data: any) {
        let { name } = formatLocalPath(data.local_path);
        await c.render("./public/opinion.ejs", {
          opinion: {
              name: name,
              html_with_citations: data.html_with_citations,
              date_created: data.date_created
          }
        });
      });
  };