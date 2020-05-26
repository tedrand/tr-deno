// Get slug & case name from local path
export function formatLocalPath(path: string): { slug: string; name: string } {
  let splitPath: string[] = path.split("/");
  let slug: string = splitPath[splitPath.length- 1];
  
  let splitSlug: string[] = slug.split("_");
  for (let i = 0; i < splitSlug.length; i++) {
    // Check for the big v.
    if (splitSlug[i] !== "v.") {
        splitSlug[i] = splitSlug[i].charAt(0).toUpperCase() 
            + splitSlug[i].substring(1);
    }

    // TODO: Check for acronyms

    // TODO: Check for abbreviations

  }
  let name = splitSlug.join(" ");
  name = name.substr(0, name.lastIndexOf("."));
  return { slug, name };
}