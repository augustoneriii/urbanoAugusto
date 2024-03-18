class UserRegisterEditDTO {
    constructor(name, email, phone, password, confirmpassword, image) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.confirmpassword = confirmpassword;
        this.image = image; 
    }
}
module.exports = UserRegisterEditDTO;
