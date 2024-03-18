import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Register: React.FC = () => {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    phone: "",
  });
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(userData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={userData.name}
        onChange={handleChange}
        placeholder="Nome"
      />
      <input
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={userData.password}
        onChange={handleChange}
        placeholder="Senha"
      />
      <input
        type="password"
        name="confirmpassword"
        value={userData.confirmpassword}
        onChange={handleChange}
        placeholder="Confirmar Senha"
      />
      <input
        type="text"
        name="phone"
        value={userData.phone}
        onChange={handleChange}
        placeholder="Telefone"
      />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;
