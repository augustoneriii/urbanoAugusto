const DadosAnuncio = require('../models/DadosAnuncio');
const Anuncio = require('../models/Anuncio');
const Company = require('../models/Company');
const Pacote = require('../models/Pacotes');

const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');

module.exports = class DadosAnuncioController {
    static async create(req, res) {
        const {
            tempoExibicao,
            quantidadeExibicoes,
            anuncioId,
            companyId,
            pacoteId,
            incrementView
        } = req.body;

        // Validações básicas
        if (!tempoExibicao) {
            return res.status(400).json({ message: 'Campo tempoExibicao é obrigatório' });
        }
        if (!quantidadeExibicoes) {
            return res.status(400).json({ message: 'Campo quantidadeExibicoes é obrigatório' });
        }
        // Validação dos IDs
        const anuncio = await Anuncio.findById(anuncioId);
        if (!anuncio) {
            return res.status(400).json({ message: 'Anuncio não encontrado' });
        }
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({ message: 'Company não encontrado' });
        }
        const pacote = await Pacote.findById(pacoteId);
        if (!pacote) {
            return res.status(400).json({ message: 'Pacote não encontrado' });
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        const visualizacoesComUsuario = incrementView.map(visualizacao => ({
            ...visualizacao,
            user: user._id
        }));

        const dadosAnuncio = new DadosAnuncio({
            tempoExibicao,
            quantidadeExibicoes,
            anuncio: anuncioId,
            company: companyId,
            pacote: pacoteId,
            incrementView: visualizacoesComUsuario
        });

        try {
            const savedDadosAnuncio = await dadosAnuncio.save();
            return res.status(201).json({ message: "Dados salvos com sucesso", savedDadosAnuncio });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }


    //get all
    static async getAll(req, res) {
        try {
            const dadosAnuncio = await DadosAnuncio.find().populate('anuncio').populate('company').populate('pacote');
            return res.status(200).json(dadosAnuncio);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // increment view in dadosAnuncio by id
    static async incrementView(req, res) {
        const { id } = req.params;
        const { incrementView } = req.body;

        console.log("asdasd", id)

        const user = await getUserByToken(getToken(req));

        const novasVisualizacoesComUsuario = incrementView.map(visualizacao => ({
            ...visualizacao,
            user: user._id
        }));

        try {
            const dadosAnuncio = await DadosAnuncio.findOne({ anuncio: id })
            if (!dadosAnuncio) {
                return res.status(404).json({ message: `Anuncio não encontrado ${id} ${dadosAnuncio}` });
            }

            // Adiciona as novas visualizações ao array existente
            dadosAnuncio.incrementView = [...dadosAnuncio.incrementView, ...novasVisualizacoesComUsuario];

            const savedDadosAnuncio = await dadosAnuncio.save();
            return res.status(200).json({ message: "Visualizações incrementadas com sucesso", savedDadosAnuncio });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    //get by id
    static async getById(req, res) {
        const { id } = req.params;
        try {
            const dadosAnuncio = await DadosAnuncio.findById(id).populate('anuncio').populate('company').populate('pacote');
            if (!dadosAnuncio) {
                return res.status(404).json({ message: 'DadosAnuncio não encontrado' });
            }
            return res.status(200).json(dadosAnuncio);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const {
            tempoExibicao,
            quantidadeExibicoes,
            anuncioId,
            companyId,
            pacoteId,
            incrementView
        } = req.body;

        const user = await getUserByToken(getToken(req));

        const novasVisualizacoesComUsuario = incrementView.map(visualizacao => ({
            ...visualizacao,
            user: user._id
        }));

        if (!tempoExibicao || !quantidadeExibicoes) {
            return res.status(400).json({ message: 'Campos tempoExibicao e quantidadeExibicoes são obrigatórios' });
        }

        try {
            const dadosAnuncio = await DadosAnuncio.findById(id);
            if (!dadosAnuncio) {
                return res.status(404).json({ message: 'DadosAnuncio não encontrado' });
            }

            // Atualiza os campos básicos
            dadosAnuncio.tempoExibicao = tempoExibicao;
            dadosAnuncio.quantidadeExibicoes = quantidadeExibicoes;
            dadosAnuncio.anuncio = anuncioId;
            dadosAnuncio.company = companyId;
            dadosAnuncio.pacote = pacoteId;

            // Adiciona as novas visualizações ao array existente
            dadosAnuncio.incrementView = [...dadosAnuncio.incrementView, ...novasVisualizacoesComUsuario];

            const savedDadosAnuncio = await dadosAnuncio.save();
            return res.status(200).json({ message: "Dados atualizados com sucesso", savedDadosAnuncio });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    //delete
    static async delete(req, res) {
        const { id } = req.params;
        try {
            const dadosAnuncio = await DadosAnuncio.findById(id);
            if (!dadosAnuncio) {
                return res.status(404).json({ message: 'DadosAnuncio não encontrado' });
            }
            await dadosAnuncio.remove();
            return res.status(200).json({ message: 'DadosAnuncio deletado com sucesso' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
