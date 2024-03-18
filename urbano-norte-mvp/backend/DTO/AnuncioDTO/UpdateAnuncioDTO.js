class UpdateAnuncioDTO {
    constructor(title, description, images, available, company, pacote) {
        this.title = title;
        this.description = description;
        this.images = images || [];
        this.available = available;
        this.company = company._id;
        this.pacote = pacote; // Aqui também, assumindo que pacote é uma lista
    }

    isValid() {
        // Ajuste a validação conforme necessário
        return this.title && this.description && this.images.length && this.available !== undefined && Array.isArray(this.pacote) && this.pacote.length;
    }
}
