require("dotenv").config();
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "The password is the first arguments: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0-b1bde.mongodb.net/phonebook?retryWrites=true&w=majority`;
const name = process.argv[3];
const number = process.argv[4];

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
});

const Person = mongoose.model("Person", personSchema);

if (!name && !number) {
  Person.find({}).then((persons) => {
    console.log("phonebook:");
    persons.map((person) => console.log(person.name, person.number));
    mongoose.connection.close();
  });
} else if (!name || !number) {
  console.log('🚫 Leave empty to view all records or add a name with a number')
  mongoose.connection.close();
} else {
// Add new person
const person = new Person({
  name: name,
  number: number,
  date: new Date(),
});

person.save().then((result) => {
  console.log(`👍👍👍 added ${name}  📞 ${number} to the phonebook`);
  mongoose.connection.close();
});
}


