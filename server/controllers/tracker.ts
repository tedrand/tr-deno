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

export const getCases = async ({ c, key }: { c: Context; key: any }) => {
  const { ct } = c.params;
  await fetch(`${Deno.env.toObject().PORT}/static/cache/${ct}.json`)
    .then((resp) => resp.json())
    .then(async function (data: any) {
      let cases: Case[] = [];
      data.forEach(function (value: any) {
        let { slug, name } = formatLocalPath(value.local_path);
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
        name: COURT_MAP[ct].name
      });
    });
};
