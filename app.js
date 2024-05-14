const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'todoApplication.db')
let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (error) {
    console.log(`Error Message${error.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

const hasPriorityAndStatus = requestQuery => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  )
}

const hasPriority = requestQuery => {
  return requestQuery.priority !== undefined
}
const hasStatus = requestQuery => {
  return requestQuery.status !== undefined
}

//API 1
app.get('/todos/', async (request, response) => {
  let getTodoQuery = ''
  let data = null
  let {search_q = '', priority, status} = request.query
  switch (true) {
    case hasPriorityAndStatus(request.query):
      getTodoQuery = `
    SELECT
     * 
    FROM 
    todo 
    WHERE 
    priority='${priority}'
    AND status='${status}' 
    AND todo LIKE '%${search_q}%'
    `
      break
    case hasPriority(request.query):
      getTodoQuery = `
    select * from todo where todo like '%${search_q}%' and priority='${priortiy}'
    `
      break
    case hasStatus(request.query):
      getTodoQuery = `
    select * from todo where todo like '%${search_q}%' and status='${status}'
    `
      break
    default:
      getTodoQuery = `
    select * from todo where todo like '%${search_q}%'
    `
      break
  }
  data = await db.all(getTodoQuery)
  response.send(data)
})

module.exports = app
