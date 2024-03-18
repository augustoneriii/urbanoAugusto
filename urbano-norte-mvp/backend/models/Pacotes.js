const mongoose = require('../db/conn');
const { Schema } = mongoose;

const Pacote = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    available: {
        type: Boolean,
    },
    addTime: {
        type: Number,
    },
    user: {
        type: Schema.Types.Mixed,
        required: true
    },
}, { timestamps: true });

const Pacotes = mongoose.model('Pacotes', Pacote);

module.exports = Pacotes;