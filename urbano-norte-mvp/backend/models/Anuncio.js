const mongoose = require('../db/conn');
const { Schema } = mongoose;

const AnuncioSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: Array,
    required: true,
  },
  available: {
    type: Boolean,
  },
  user: {
    type: Schema.Types.Mixed, 
    required: true
  },
  company: {
    type: Schema.Types.Mixed, 
    required: true
  },
  pacote: {
    type: Array, 
    required: true
  },
}, { timestamps: true });

const Anuncio = mongoose.model('Anuncio', AnuncioSchema);

module.exports = Anuncio;
