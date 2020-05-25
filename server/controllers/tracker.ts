// import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Context } from "https://deno.land/x/abc/mod.ts";
const API_KEY = Deno.env.toObject().COURT_LISTENER_KEY || "API KEY NOT FOUND";

export const getCases = async ({ c, ct }: { c: Context; ct: string }) => {
  await fetch(
    `https://www.courtlistener.com/api/rest/v3/opinions/?cluster__docket__court__id=${ct}&date_created_gt=${"2020-05-18"}T00:00:00z`,
    {
      method: "GET",
      headers: {
        "Authorization": `Token ${API_KEY}`,
      },
    },
  )
    .then((resp) => resp.json())
    .then(async function (data: any) {
        console.log(API_KEY);
        let cases: any = [];
        data.results.forEach(function (value: any) {
            // Get formatted case name from local path
            let str = value.local_path.split("/")
            str = str[str.length-1].split("_")
            for (var i=0; i<str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].substring(1);
            }
            cases.push({
                name: str.join(' '),
                date_created: value['date_created'],
                download_url: `https://www.courtlistener.com/${value['local_path']}`
            })
        });
        
        await c.render("./public/tracker.ejs", {
            cases: cases
        })
    });
};
