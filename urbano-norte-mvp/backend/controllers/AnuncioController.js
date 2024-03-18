require('dotenv').config();
const Anuncio = require('../models/Anuncio');
const Pacote = require('../models/Pacotes');
const Company = require('../models/Company');
const CreateAnuncioDTO = require('../DTO/AnuncioDTO/CreateAnuncioDTO');
const AnuncioResponseDTO = require('../DTO/AnuncioDTO/AnuncioResponseDTO');
const UpdateAnuncioDTO = require('../DTO/AnuncioDTO/UpdateAnuncioDTO');

const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class AnuncioController {
    static async create(req, res) {
        // const pacotesIds = req.body.pacote.map(pacote => pacote._id);
        const pacotesIds = JSON.parse(req.body.pacote).map(pacote => pacote._id);

        const pacotes = await Pacote.find({ '_id': { $in: pacotesIds } });

        if (!pacotes.length) {
            res.status(422).json({ message: 'Pacotes inválidos ou não encontrados!' });
            return;
        }

        const company = await Company.findOne({ _id: req.body.company });

        if (!company) {
            res.status(422).json({ message: 'Empresa inválida ou não encontrada!' });
            return;
        }

        if(!req.files.length){
            res.status(422).json({ message: 'A imagem é obrigatória!' });
            return;
        }
        
       

        const createDto = new CreateAnuncioDTO(
            req.body.title,
            req.body.description,
            req.files.map(file => file.filename),
            company,
            pacotes
        );
        

        if (!createDto.isValid()) {
            res.status(422).json({ message: 'Todos os campos são obrigatórios!' });
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        const anuncio = new Anuncio({
            title: req.body.title,
            description: req.body.description,
            images: createDto.images,
            available: true,
            user: user,
            company: company,
            pacote: pacotes,
        });

        try {
            const newAd = await anuncio.save();
            const responseDto = new AnuncioResponseDTO(newAd);
            res.status(201).json({ message: 'Anuncio cadastrado com sucesso!', newAd: responseDto });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao salvar anúncio: ' + error.message });
        }
    }

    static async getAll(req, res) {
        const anuncio = await Anuncio.find().sort('-createdAt');
        const responseDto = anuncio.map(ad => new AnuncioResponseDTO(ad));
        res.status(200).json({ anuncio: responseDto });
    }

    static async getAllUserAd(req, res) {
        const token = getToken(req);
        const user = await getUserByToken(token);

        const anuncio = await Anuncio.find({ 'user._id': user._id });
        const responseDto = anuncio.map(ad => new AnuncioResponseDTO(ad));
        res.status(200).json({ anuncio: responseDto });
    }

    static async getAdById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        const anuncio = await Anuncio.findOne({ _id: id });

        if (!anuncio) {
            res.status(404).json({ message: 'Anuncio não encontrado!' });
            return;
        }

        const responseDto = new AnuncioResponseDTO(anuncio);
        res.status(200).json({ anuncio: responseDto });
    }

    static async removeAdById(req, res) {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: 'ID inválido!' });
            return;
        }

        const anuncio = await Anuncio.findOne({ _id: id });

        if (!anuncio) {
            res.status(404).json({ message: 'Anuncio não encontrado!' });
            return;
        }

        // REMOCAO VALIDAO SE USUARIO CRIOU O ANUNCIO
        // const token = getToken(req);
        // const user = await getUserByToken(token);

        // if (anuncio.user._id.toString() != user._id.toString()) {
        //     res.status(404).json({
        //         message: 'Houve um problema em processar sua solicitação, tente novamente mais tarde!',
        //     });
        //     return;
        // }

        await Anuncio.findByIdAndRemove(id);
        res.status(200).json({ message: 'Anuncio removido com sucesso!' });
    }

    static async updateAnuncio(req, res) {
        const id = req.params.id;

        const updateDto = new UpdateAnuncioDTO(
            req.body.title,
            req.body.description,
            req.files ? req.files.map(file => file.filename) : anuncio.images,
            req.body.available,
            req.body.company,
            req.body.pacote
        );

        const pacotes = await Pacote.find({ '_id': { $in: updateDto.pacote } });

        if (!updateDto.isValid()) {
            res.status(422).json({ message: 'Todos os campos são obrigatórios!' });
            return;
        }

        await Anuncio.findByIdAndUpdate(id, {
            pacote: pacotes.map(p => ({
                _id: p._id,
                name: p.name,
                description: p.description,
                price: p.price,
                available: p.available,
                addTime: p.addTime,
            })),
        })

        const token = getToken(req);
        const user = await getUserByToken(token);

        if (anuncio.user._id.toString() != user._id.toString()) {
            res.status(404).json({
                message: 'Houve um problema em processar sua solicitação, tente novamente mais tarde!',
            });
            return;
        }

        await Anuncio.findByIdAndUpdate(id, updateDto);
        res.status(200).json({ message: 'Anuncio atualizado com sucesso!' });
    }
}
