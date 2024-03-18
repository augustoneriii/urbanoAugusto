const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
//DTOs
const UserLoginDTO = require('../DTO/UserDTO/UserLoginDTO')
const UserRegisterEditDTO = require('../DTO/UserDTO/UserRegisterEditDTO')
const UserResponseDTO = require('../DTO/UserDTO/UserResponseDTO')

// helpers
const getUserByToken = require('../helpers/get-user-by-token')
const getToken = require('../helpers/get-token')
const createUserToken = require('../helpers/create-user-token')
const { imageUpload } = require('../helpers/image-upload')

module.exports = class UserController {
  static async register(req, res) {
    const userDto = new UserRegisterEditDTO(
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.password,
      req.body.confirmpassword
    );

    if (!userDto.name || !userDto.email || !userDto.phone || !userDto.password || !userDto.confirmpassword) {
      res.status(422).json({ message: 'Todos os campos são obrigatórios!' });
      return;
    }

    if (userDto.password != userDto.confirmpassword) {
      res.status(422).json({ message: 'A senha e a confirmação precisam ser iguais!' });
      return;
    }

    const userExists = await User.findOne({ email: userDto.email });

    if (userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(userDto.password, salt);

    const user = new User({
      name: userDto.name,
      email: userDto.email,
      phone: userDto.phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const loginDto = new UserLoginDTO(req.body.email, req.body.password);

    if (!loginDto.email || !loginDto.password) {
      res.status(422).json({ message: 'E-mail e senha são obrigatórios!' });
      return;
    }

    const user = await User.findOne({ email: loginDto.email });

    if (!user) {
      res.status(422).json({ message: 'Não há usuário cadastrado com este e-mail!' });
      return;
    }

    const checkPassword = await bcrypt.compare(loginDto.password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: 'Senha inválida' });
      return;
    }

    await createUserToken(user, req, res);
  }


  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, 'nossosecret');
      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    if (currentUser) {
      const userResponse = new UserResponseDTO(currentUser._id, currentUser.name);
      res.status(200).send(userResponse);
    } else {
      res.status(200).send(null);
    }
  }


  static async getUserById(req, res) {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      res.status(422).json({ message: 'Usuário não encontrado!' });
      return;
    }

    const userResponse = new UserResponseDTO(user._id, user.name, user.phone, user.email);
    res.status(200).json({ user: userResponse });
  }



  static async editUser(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const editDto = new UserRegisterEditDTO(
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.password,
      req.body.confirmpassword,
      req.file ? req.file.filename : ''
    );

    if (!editDto.name || !editDto.email || !editDto.phone) {
      res.status(422).json({ message: 'Nome, e-mail e telefone são obrigatórios!' });
      return;
    }

    const userExists = await User.findOne({ email: editDto.email });

    if (user.email !== editDto.email && userExists) {
      res.status(422).json({ message: 'Por favor, utilize outro e-mail!' });
      return;
    }

    user.name = editDto.name;
    user.email = editDto.email;
    user.phone = editDto.phone;

    if (editDto.image) {
      user.image = editDto.image;
    }

    if (editDto.password) {
      if (editDto.password != editDto.confirmpassword) {
        res.status(422).json({ error: 'As senhas não conferem.' });
        return;
      } else {
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(editDto.password, salt);
        user.password = passwordHash;
      }
    }

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.json({
        message: 'Usuário atualizado com sucesso!',
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
