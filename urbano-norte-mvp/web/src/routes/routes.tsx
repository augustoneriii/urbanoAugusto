import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/Auth/Login";
import Home from "../components/Home/Home";
import Register from "../components/Auth/Register";
import CreateAd from "../components/Advertising/CreateAd";
import Advertising from "../components/Advertising/Advertising";
import Company from "../components/Company/Company";
import CreateOrEditCompany from "../components/Company/CreateOrEditCompany";
import Package from "../components/Package/Package";
import CreateOrEditPackage from "../components/Package/CreateOrEditPackages";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/anuncio" element={<Advertising />} />
      <Route path="/anuncio/create" element={<CreateAd />} />
      <Route path="/anuncio/update/:advertisingId" element={<CreateAd />} />
      <Route path="/empresa" element={<Company />} />
      <Route path="/empresa/create" element={<CreateOrEditCompany />} />
      <Route
        path="/empresa/update/:companyId"
        element={<CreateOrEditCompany />}
      />
      <Route path="/pacote" element={<Package />} />
      <Route path="/pacote/create" element={<CreateOrEditPackage />} />
      <Route
        path="pacote/update/:packageId"
        element={<CreateOrEditPackage />}
      />
    </Routes>
  );
};

export default AppRoutes;
