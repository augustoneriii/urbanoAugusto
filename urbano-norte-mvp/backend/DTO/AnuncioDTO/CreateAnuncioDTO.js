class CreateAnuncioDTO {
    constructor(title, description, images, company, pacote) {
        this.title = title;
        this.description = description;
        this.images = images || [];
        this.company = company;
        this.pacote = pacote; // Supondo que pacote já seja uma lista
    }

    isValid() {
        // Adicione validações conforme necessário, por exemplo, verificar se pelo menos um pacote foi fornecido
        return this.title && this.description && Array.isArray(this.pacote) && this.pacote.length;
    }
}

module.exports = CreateAnuncioDTO;
