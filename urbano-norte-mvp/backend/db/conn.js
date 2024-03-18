require('dotenv').config()
const mongoose = require('mongoose')

const DB_USER = process.env.DB_USER
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.okj6i54.mongodb.net/?retryWrites=true&w=majority`;


async function main() {
  await mongoose.connect(uri)
  console.log('Conectou com Mongoose!')
}

main().catch((err) => console.log(err))

module.exports = mongoose
