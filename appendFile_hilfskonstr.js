import { appendFile, promises } from 'fs';

async function appendFile() {
    const filename = "config/content.json"

    const id = 0
    const layout = "text-with-title"
    const title = "Titel"
    const path = "entry"
    const text = "hier kommt der text."

    const data = `{
                "id": ${id},
                "layout": "${layout}",
                "title": "${title}",
                "path": "${path}",
                "text": "${text}"
            }`

    //const data = ",\n        " + "{\n            \"data\":\"some new data\"\n        }\n " + "    ]\n}\n"
    const data1 = ",\n        " + data + "\n     ]\n}\n"
    const stat = await promises.stat(filename)
    const fileSize = stat.size

    await promises.truncate(filename, fileSize - (4 + 6))
    appendFile(filename, data1, () => {})
}

appendFile();