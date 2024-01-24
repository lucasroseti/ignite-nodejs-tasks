import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route.path.js'
import { removeUninformedFields } from './utils/remove-uninformed-fields.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search,
      } : null)
      return res
        .setHeader('Content-Type', 'application/json')	
        .end(JSON.stringify(tasks))
    }
  },
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
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const data = { title, description }

      const taskToUpdate = database.update('tasks', id, removeUninformedFields(data))
      
      if (taskToUpdate) {
        return res.writeHead(204).end()
      } else {
        return res.writeHead(404).end('Task not found')
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const current_date = new Date()

      const task = database.selectById('tasks', id)

      if (task) {
        task.completed_at = task.completed_at === null ? current_date : null
  
        database.update('tasks', id, task)
  
        return res.writeHead(204).end()
      }

      return res.writeHead(404).end('Task not found')
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) => {
      const { id } = req.params

      const taskToDelete = database.delete('tasks', id)

      if (taskToDelete) {
        return res.writeHead(204).end()
      } else {
        return res.writeHead(404).end('Task not found')
      }
    }
  }
]