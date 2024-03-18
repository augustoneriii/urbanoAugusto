class AnuncioResponseDTO {
    constructor(anuncio) {
        this.id = anuncio._id;
        this.title = anuncio.title;
        this.description = anuncio.description;
        this.images = anuncio.images || [];
        this.available = anuncio.available;
        this.user = {
            id: anuncio.user._id,
            name: anuncio.user.name,
            image: anuncio.user.image,
            phone: anuncio.user.phone
        };
        this.company = {
            id: anuncio.company._id,
            name: anuncio.company.name,
            phone: anuncio.company.phone,
            email: anuncio.company.email,
        };
        this.pacote = anuncio.pacote.map(pac => ({
            id: pac._id, // Supondo que cada pacote tem um _id
            name: pac.name,
            description: pac.description,
            price: pac.price,
            available: pac.available,
            addTime: pac.addTime,
        }));
    }
}


module.exports = AnuncioResponseDTO;