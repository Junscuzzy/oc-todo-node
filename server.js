const app = require('express')()
const http = require('http').createServer(app)
const session = require('cookie-session')
const io = require('socket.io')(http)
const path = require('path')

/**
 * Express app
 */

// Data "storage" in session
app.use(session({ secret: 'todotopsecret' }))

app.get('/todo', (req, res) => {
  res.sendFile(path.resolve('index.html'))
})

app.use((req, res, next) => {
  res.redirect('/todo')
})

/**
 * Real time part. using Socket.js
 */

const todoList = []
io.on('connection', (socket) => {
  // Initial todo from server memory
  if (todoList.length > 0) {
    socket.emit('todoList', todoList)
  }

  // Receive new todo and emit updated array
  socket.on('new_todo', (todo) => {
    if (todo) {
      todoList.push(todo)
    }
    socket.emit('todoList', todoList)
    socket.broadcast.emit('todoList', todoList)
  })

  // Delete todo item and emit updated array
  socket.on('delete_todo', (index) => {
    if (index) {
      todoList.splice(index, 1)
    }
    socket.emit('todoList', todoList)
    socket.broadcast.emit('todoList', todoList)
  })
})

http.listen(8080, () => console.log('listening on *:8080'))
