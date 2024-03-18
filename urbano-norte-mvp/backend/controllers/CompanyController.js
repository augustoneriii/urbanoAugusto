const Company = require('../models/Company');
const CreateCompanyDTO = require('../DTO/CompanyDTO/CreateCompanyDTO');
const UpdateCompanyDTO = require('../DTO/CompanyDTO/UpdateCompanyDTO');
const CompanyResponseDTO = require('../DTO/CompanyDTO/CompanyResponseDTO');
const Anuncio = require('../models/Anuncio');

const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');

module.exports = class CompanyController {
    //create method
    static async create(req, res) {
        const createDto = new CreateCompanyDTO(
            req.body.name,
            req.body.representative,
            req.body.cnpj,
            req.body.email,
            req.body.phone,
            req.body.address,
            req.body.pacotes,
        );

        if (!createDto.isValid()) {
            res.status(422).json({ message: 'Nome e descrição são obrigatórios!' });
            return;
        }

        const token = getToken(req);
        const user = await getUserByToken(token);

        const company = new Company({
            name: createDto.name,
            representative: createDto.representative,
            cnpj: createDto.cnpj,
            email: createDto.email,
            phone: createDto.phone,
            address: {
                rua: createDto.address.rua,
                bairro: createDto.address.bairro,
                cep: createDto.address.cep,
            },
            pacotes: createDto.pacotes,
        });

        try {
            const newCompany = await company.save();
            const responseDto = new CompanyResponseDTO(newCompany);
            res.status(201).json({ message: 'Empresa cadastrada com sucesso!', newCompany: responseDto });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao salvar empresa: ' + error.message });
        }
    }

    //get all method
    static async getAll(req, res) {
        try {
            const companies = await Company.find();
            const responseDto = companies.map(company => new CompanyResponseDTO(company));
            res.status(200).json(responseDto);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar empresas: ' + error.message });
        }
    }

    //get by id method
    static async getById(req, res) {
        try {
            const company = await Company.findById(req.params.id);
            const responseDto = new CompanyResponseDTO(company);
            res.status(200).json(responseDto);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar empresa: ' + error.message });
        }
    }

    //update method
    static async update(req, res) {

        const updateDto = new UpdateCompanyDTO(
            req.body.name,
            req.body.representative,
            req.body.cnpj,
            req.body.email,
            req.body.phone,
            req.body.address,
            req.body.pacotes,
        );

        if (!updateDto.isValid()) {
            res.status(422).json({ message: 'Nome, representante, CNPJ, email, telefone e endereço são obrigatórios!' });
            return;
        }
    
        //update all anuncios with this company
        const anuncios = await Anuncio.find({ "anuncio.company.id": req.params.id});

        try {
            const company = await Company.findById(req.params.id);
    
            if (!company) {
                res.status(404).json({ message: 'Empresa não encontrada' });
                return;
            }

            //update all anuncios with this company
            if (anuncios.length > 0) {
                anuncios.forEach(async anuncio => {
                    anuncio.company = {
                        name: company.name,
                        phone: company.phone,
                        email: company.email
                    };
                    await anuncio.save();
                });
            }
    
            company.name = updateDto.name;
            company.representative = updateDto.representative;
            company.cnpj = updateDto.cnpj;
            company.email = updateDto.email;
            company.phone = updateDto.phone;
            company.address = {
                rua: updateDto.address.rua,
                bairro: updateDto.address.bairro,
                cep: updateDto.address.cep,
            };
            company.pacotes = updateDto.pacotes;
    
            const updatedCompany = await company.save();
            const responseDto = new CompanyResponseDTO(updatedCompany);
            res.status(200).json({ message: 'Empresa atualizada com sucesso!', updatedCompany: responseDto });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar empresa: ' + error.message });
        }
    }
    

    //metodo getByName para encontrar por nome exato ou semelhante
    static async getByName(req, res) {
        try {
            const companies = await Company.find({ name: { $regex: req.params.name, $options: 'i' } });
            const responseDto = companies.map(company => new CompanyResponseDTO(company));
            res.status(200).json(responseDto);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar empresas: ' + error.message });
        }
    }

    //delete method
    static async delete(req, res) {
        try {
            await Company.deleteOne({ _id: req.params.id });
            res.status(200).json({ message: 'Empresa deletada com sucesso!' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar empresa: ' + error.message });
        }
    }
}