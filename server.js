const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')

/**
 * Express app
 */

app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'))
})

app.use((req, res, next) => {
  res.redirect('/')
})

/**
 * Real time part. using Socket.js
 */

const todoList = []
io.on('connection', (socket) => {
  // Initial todo list from server memory
  if (todoList.length > 0) {
    socket.emit('todoList', todoList)
  }

  // utils
  function emitAll() {
    socket.emit('todoList', todoList)
    socket.broadcast.emit('todoList', todoList)
  }

  // Add new todo and emit updated array
  socket.on('new_todo', (todo) => {
    if (todo) {
      todoList.push(todo)
      emitAll()
    }
  })

  // Delete todo item and emit updated array
  socket.on('delete_todo', (index) => {
    if (index) {
      todoList.splice(index, 1)
      emitAll()
    }
  })
})

http.listen(8080, () => console.log('listening on *:8080'))
