import { Context } from "https://deno.land/x/abc/mod.ts";
import { formatLocalPath } from "../utils.ts"

export const getOpinion = async (c: Context) => {
    const { id } = c.params;
    
    await fetch(
      `https://www.courtlistener.com/api/rest/v3/opinions/${id}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Token ${Deno.env.get('CTLSTNR_KEY')}`,
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