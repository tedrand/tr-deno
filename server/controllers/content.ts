
interface Content {
    content: string,
    date_created: any,
    html_str: string,
    id: Number,
    last_updated: any,
    meta_description: string,
    title: string
}

export const getContent = async (c: any, content: string) => {
    let ctx = c
    await fetch(`https://pycourt.herokuapp.com/contents/${content}`)
        .then((resp) => resp.json())
        .then(async function(data) {
            await c.render("./public/staticPage.ejs", {
                data: data[0]
            });
            
        })
}