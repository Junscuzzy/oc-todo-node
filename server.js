const app = require('express')()
const http = require('http').createServer(app)
const session = require('cookie-session')
const bodyParser = require('body-parser')
const io = require('socket.io')(http)

/**
 * 1) Express.js app
 * - Routes
 */

// For form
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Data "storage" in session
app.use(session({ secret: 'todotopsecret' }))

// create empty todolist if doesn't exists
app.use((req, res, next) => {
  if (typeof (req.session.todoList) === 'undefined') {
    req.session.todoList = []
  }
  next()
})

app.get('/todo', (req, res) => {
  res.render('todo.ejs', { todoList: req.session.todoList })
})

app.post('/todo/add/', urlencodedParser, (req, res) => {
  if (req.body.newTodo != '') {
    req.session.todoList.push(req.body.newTodo)
  }
  res.redirect('/todo')
})

app.get('/todo/delete/:id', (req, res) => {
  if (req.params.id != '') {
    req.session.todoList.splice(req.params.id, 1)
  }
  res.redirect('/todo')
})

app.use((req, res, next) => {
  res.redirect('/todo')
})

/**
 * 1) Socket.js part.
 * Real time app part.
 */
io.on('connection', (socket) => {
  socket.on('new_user', (name) => {
    console.log(`New user connected named: ${name}`)
    socket.userName = name

    socket.broadcast.emit('has_new_user', name)
  })

  socket.on('disconnect', () => {
    console.log(`${socket.userName || 'user'} disconnected`)
  })
})

http.listen(8080, () => console.log('listening on *:8080'))
