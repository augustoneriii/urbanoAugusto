class CreateCompanyDTO {
    constructor(name, representative, cnpj, email, phone, address, pacotes) {
        this.name = name;
        this.representative = representative;
        this.cnpj = cnpj;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.pacotes = pacotes;
        this.pacotes.dataValidade = pacotes.dataValidade;
    }

    isValid() {
        return this.name && this.representative && this.cnpj && this.email && this.phone && this.address;
    }
}

module.exports = CreateCompanyDTO;
