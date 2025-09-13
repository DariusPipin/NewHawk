const express = require('express')

const app = express()
const port = 3000


const users = [
  {
    name: "Bill gates",
    password: "rich"
  }
]

app.get('/users', (req, res) => {
  res.json(users)
})

app.listen(port)