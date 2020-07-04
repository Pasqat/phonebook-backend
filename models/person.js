const mongoose = require("mongoose");
require("dotenv").config();
const colors = require("colors");


mongoose.set('useFindAndModify', false)
const url = process.env.MONGODB_URI;

console.log("connecting to".yellow.bold, url);

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('✔ connected to MongoDB'.brightGreen)
  })
  .catch((error) => {
    console.log('❌ error connecting to MondoDB:'.red.bold, error.message)
  })


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)