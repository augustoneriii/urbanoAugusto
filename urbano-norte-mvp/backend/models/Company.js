const mongoose = require('../db/conn')
const { Schema } = mongoose

const Company = mongoose.model(
    'Company',
    new Schema({
        name: {
            type: String,
            required: true,
        },
        representative: {
            type: String,
            required: true,
        },
        cnpj: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: Object,
            required: true,
        },
        enable: {
            type: Boolean,
        },
        pacotes: {
            type: Array,
        },
    }, { timestamps: true }),
)

module.exports = Company
