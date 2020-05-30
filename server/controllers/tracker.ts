import { Context } from "https://deno.land/x/abc/mod.ts";
import { COURT_MAP } from "../constants.ts";
import { formatLocalPath } from "../utils.ts";

interface Case {
  slug: string,
  name: string,
  date_created: Date,
  download_url: string,
  opinion_id: Number
}

export const getCases = async (c: Context) => {
  
  const { ct } = c.params;
  let api = `https://www.courtlistener.com/api/rest/v3/opinions/?cluster__docket__court__id=${ct}`
  if (c.queryParams.startDate) {
    api += `&date_created__gt=${c.queryParams.startDate}T00:00:00Z`;
  }
  if (c.queryParams.startDate) {
    api += `&date_created__lt=${c.queryParams.endDate}T00:00:00Z`;
  }
  
  // await fetch(`${Deno.env.toObject().BASE_PATH}/static/cache/${ct}.json`)
  await fetch(api, {
    method: "GET",
    headers: {
      "Authorization": `Token ${Deno.env.get('CTLSTNR_KEY')}`,
    },
  })
    .then((resp) => resp.json())
    .then(async function (data: any) {

      let ctName = (COURT_MAP[ct]) ? COURT_MAP[ct].name : ct
      let cases: Case[] = [];

      try {
        data.results.forEach(function (value: any) {
          let { slug, name } = formatLocalPath(value.local_path);
          if (c.queryParams.partyName) {
            if(slug.indexOf(c.queryParams.partyName.toLowerCase()) == -1) {
              return;
            }
          }
          cases.push({
            slug: slug,
            name: name,
            date_created: value["date_created"],
            download_url: `https://www.courtlistener.com/${value["local_path"]}`,
            opinion_id: value["id"]
          });
        });
        await c.render("./public/tracker.ejs", {
          cases: cases,
          ct: ct,
          name: ctName,
          canonical: c.url
        });
      } catch (error) {
        await c.render("./public/404.ejs", {
          error: error,
          data: data
        })
      }
    });
};
