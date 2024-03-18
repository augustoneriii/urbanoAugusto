class CreatePacoteDTO {
  constructor({ name, description, price, available, addTime }) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.available = available;
    this.addTime = addTime;
  }
}

module.exports = CreatePacoteDTO;