class UpdateCompanyDTO {
    constructor(name, representative, cnpj, email, phone, address, pacotes) {
        this.name = name;
        this.representative = representative;
        this.cnpj = cnpj
        this.email = email;
        this.phone = phone;
        this.address = {
            rua: address.rua,
            bairro: address.bairro,
            cep: address.cep,
        };
        this.pacotes = pacotes;
    }
    isValid() {
        return this.name && this.representative && this.cnpj && this.email && this.phone && this.address;
    }    
}

module.exports = UpdateCompanyDTO;
