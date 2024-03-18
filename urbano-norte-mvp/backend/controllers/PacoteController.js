const Pacote = require('../models/Pacotes');
const CreatePacoteDTO = require('../DTO/PacotesDTO/CreatePacoteDTO');
const PacoteResponseDTO = require('../DTO/PacotesDTO/PacoteResponseDTO');
const Anuncio = require('../models/Anuncio');


const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class PacoteController {
    static async create(req, res) {

        //validations all fields
        if (!req.body.name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!req.body.description) {
            return res.status(400).json({ message: 'Description is required' });
        }
        if (!req.body.price) {
            return res.status(400).json({ message: 'Price is required' });
        }
        if (!req.body.addTime) {
            return res.status(400).json({ message: 'AddTime is required' });
        }


        const createDto = new CreatePacoteDTO(
            req.body.name,
            req.body.description,
            req.body.price,
            req.body.available,
            req.body.addTime,
            req.body.user
        );

        const token = getToken(req);
        const user = await getUserByToken(token);

        const pacote = new Pacote({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            available: true,
            addTime: req.body.addTime,
            user: {
                _id: user._id,
                name: user.name,
                phone: user.phone,
            },
        });

        await pacote.save();

        res.status(201).json(new PacoteResponseDTO(pacote));
    }

    //getall method
    static async getAll(req, res) {
        const pacotes = await Pacote.find({});

        res.status(200).json(pacotes.map((pacote) => new PacoteResponseDTO(pacote)));
    }

    //get by id method
    static async getById(req, res) {
        const pacote = await Pacote.findById(req.params.id);

        if (!pacote) {
            res.status(404).json({ message: 'Pacote não encontrado!' });
            return;
        }

        res.status(200).json(new PacoteResponseDTO(pacote));
    }

    //update method
    static async update(req, res) {
        const pacote = await Pacote.findById(req.params.id);

        if (!pacote) {
            res.status(404).json({ message: 'Pacote não encontrado!' });
            return;
        }


        //update all anuncios with this pacote
        const anuncios = await Anuncio.find({ "anuncio.pacote.id": pacote._id })

        if (anuncios.length > 0) {
            anuncios.forEach(async anuncio => {
                anuncio.pacote = {
                    name: pacote.name,
                    description: pacote.description,
                    price: pacote.price,
                    available: pacote.available,
                    addTime: pacote.addTime,
                };
                await anuncio.save();
            });
        }

        pacote.name = req.body.name;
        pacote.description = req.body.description;
        pacote.price = req.body.price;
        pacote.available = req.body.available;
        pacote.addTime = req.body.addTime;

        await pacote.save();

        res.status(200).json(new PacoteResponseDTO(pacote));
    }

    //delete method
    static async delete(req, res) {
        const pacote = await Pacote.findById(req.params.id);

        if (!pacote) {
            res.status(404).json({ message: 'Pacote não encontrado!' });
            return;
        }

        await pacote.delete();

        res.status(200).json({ message: 'Pacote excluído com sucesso!' });
    }

    //get by name method por nome exato ou semelhante 
    static async getByName(req, res) {
        try {
            const pacotes = await Pacote.find({ name: { $regex: req.params.name, $options: 'i' } });
            const responseDto = pacotes.map(pacote => new PacoteResponseDTO(pacote));
            res.status(200).json(responseDto);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar pacotes: ' + error.message });
        }
    }

}