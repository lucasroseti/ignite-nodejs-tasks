import fs from 'node:fs'
import { parse } from 'csv-parse'

const __dirname = new URL('../../', import.meta.url).pathname.substring(1)

const processFile = async () => {
  return fs
    .createReadStream(`${__dirname}/tasks.csv`)
    .pipe(parse({
      delimiter: ',',
      skipEmptyLines: true,
      fromLine: 2
    }))
}

(async () => {
  const records = await processFile()

  for await (const record of records) {
    const [title, description] = record
    const task = {
      title,
      description
    }

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
})()