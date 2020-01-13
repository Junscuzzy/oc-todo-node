const express = require('express')
const session = require('cookie-session')
const bodyParser = require('body-parser')

const app = express()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

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

app.listen(8080)
