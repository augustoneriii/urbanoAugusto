// Home.tsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/header";

const Home: React.FC = () => {
  return <Header />;
};

export default Home;
