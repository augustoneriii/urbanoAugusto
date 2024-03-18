class PacoteResponseDTO {
    constructor(pacote) {
        this.id = pacote._id;
        this.name = pacote.name;
        this.description = pacote.description;
        this.price = pacote.price;
        this.available = pacote.available;
        this.addTime = pacote.addTime;
        this.user = {
            id: pacote.user._id,
            name: pacote.user.name,
            image: pacote.user.image,
            phone: pacote.user.phone
        };
    }
}

module.exports = PacoteResponseDTO;