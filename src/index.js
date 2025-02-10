import axios from 'axios'
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

export default async function savePage(url, output) {
    const findSymbols = /[^a-zA-Z\d]/g
    const file = `${url.split('://')[1].replace(findSymbols, '-')  }.html`
    const filePath = path.join(output, file)

    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((response) => writeFile(filePath, response.data))
            .then(() => {
                resolve(filePath)
            })
            .catch((error) => {
                reject(error)
            })
    })

}
