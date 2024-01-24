import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route.path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title , description  } = req.body
      const current_date = new Date()
      const task = {
        id: randomUUID(),
        title ,
        description,
        completed_at: null,
        created_at: current_date,
        updated_at : current_date,
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    },
  },
]