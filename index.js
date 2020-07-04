require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const colors = require("colors");

morgan.token("data-post", (req) => {
  return JSON.stringify(req.dataPost);
});
app.use(express.static("build"));

app.use(cors());
app.use(express.json());

app.use(
  morgan(
    ":method. :url :status :res[content-length] - :response-time ms :data-post"
  )
);

// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456'
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelance',
//     number: '39-44-52342342'
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-1234543'
//   },
//   {
//     id: 4,
//     name: 'Mary Poppins',
//     number: '39-32-987654'
//   }
// ]

app.get("/", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((findedPerson) => {
      if (findedPerson) {
        res.json(findedPerson);
        // res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id).then((result) => {
    res.status(204).end();
  });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number missing",
    });
  }
  //   else if (persons.find((person) => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  person.save().then((savedPerson) => {
    res.json(person);

    req.dataPost = person;
    next();
  });
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  // By default, the updatedNote parameter of the event handler
  // receives the original document without the modifications.
  // We added the optional { new: true } parameter, which will
  // cause our event handler to be called with the new modified
  // document instead of the original.
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error.message.brightWhite.bgRed);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port`, PORT.underline.brightBlue);
});
