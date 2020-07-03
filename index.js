const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data-post', (req) => {
  return JSON.stringify(req.dataPost)
})
app.use(express.static('build'))

app.use(cors())
app.use(express.json())


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data-post'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelance',
    number: '39-44-52342342'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-1234543'
  },
  {
    id: 4,
    name: 'Mary Poppins',
    number: '39-32-987654'
  }
]

const generateId = () => {
    return Math.floor(Math.random() * 999999999)
}

app.get('/', (req,res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons', (req,res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req,res, next) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req,res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  } else if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId()
  }

  persons = persons.concat(person)

  res.json(person)

  req.dataPost = person
  next()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})