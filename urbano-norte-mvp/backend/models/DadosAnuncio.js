const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Anuncio = require('./Anuncio');
const Company = require('./Company');
const Pacote = require('./Pacotes');
const User = require('./User');

const DadosAnuncioSchema = new Schema({
    tempoExibicao: {
        type: Number,
        required: true,
    },
    quantidadeExibicoes: {
        type: Number,
        required: true,
    },
    anuncio: {
        type: Schema.Types.ObjectId,
        ref: Anuncio, 
        required: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: Company, 
        required: true,
    },
    pacote: {
        type: Schema.Types.ObjectId,
        ref: Pacote, 
        required: true,
    },
    incrementView: [{
        datetime: String,
        latitude: String,
        longitude: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: User
        }
    }]
}, { timestamps: true });


const DadosAnuncio = mongoose.model('DadosAnuncio', DadosAnuncioSchema);

module.exports = DadosAnuncio;