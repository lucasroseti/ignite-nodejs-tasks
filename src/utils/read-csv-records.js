import fs from 'node:fs'
import { parse } from 'csv-parse'

const __dirname = new URL('../../', import.meta.url).pathname.substring(1)

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`${__dirname}/tasks.csv`)
    .pipe(parse())
  for await (const record of parser) {
    records.push(record);
  }
  return records;
}

(async () => {
  const records = await processFile()

  for await (const [key, record] of records.entries()) {
    if (key > 0) {
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
  }
})()