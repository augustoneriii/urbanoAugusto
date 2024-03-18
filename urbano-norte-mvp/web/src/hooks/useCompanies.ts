import { useState, useEffect, useCallback } from "react";
import API from "../api/api";
import { debounce } from "lodash";

export type CompanyProp = {
  name: {
    _id: string;
    name: string;
    representative: string;
    cnpj: string;
    email: string;
    phone: string;
    address: {
      rua: string;
      bairro: string;
      cep: string;
    };
  };
};

export type CompanyCreateProp = {
  name: string;
  representative: string;
  cnpj: string;
  email: string;
  phone: string;
  address: {
    rua: string;
    bairro: string;
    cep: string;
  };
  pacotes: PacoteCompany[]
};

export type PacoteCompany = {
  id?: string;
  name: string;
  description: string;
  available: boolean;
  addTime: number;
  dataValidade: string;
}

const useCompanies = () => {
  const [companies, setCompanies] = useState<CompanyProp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm.length >= 2) {
      fetchByName(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/company/");
      setCompanies(response.data);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const createCompany = async (
    companyData: CompanyCreateProp,
    successCalback: Function
  ) => {
    setIsLoading(true);
    try {
      await API.post("/company/create", companyData);
      successCalback();
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
    }
    setIsLoading(false);
  };

  const deleteCompany = async (id: string) => {
    setIsLoading(true);
    try {
      await API.delete(`/company/delete/${id}`);
      setCompanies((currentCompanies) =>
        currentCompanies.filter((company) => company.name._id !== id)
      );
      fetchCompanies();
    } catch (error) {
      console.error("Erro ao excluir empresa:", error);
    }
    setIsLoading(false);
  };

  const refetchCompanies = () => {
    fetchCompanies();
  };

  const fetchByName = debounce(async (name: string) => {
    setIsLoading(true);
    try {
      const response = await API.get(`/company/getbyname/${name}`);
      setCompanies(response.data);
    } catch (error) {
      console.error("Erro ao buscar empresas por nome:", error);
    }
    setIsLoading(false);
  }, 300);

  const updateCompany = async (
    id: string,
    companyData: CompanyCreateProp,
    successCalback: Function
  ) => {
    setIsLoading(true);
    try {
      await API.patch(`/company/update/${id}`, companyData);
      fetchCompanies();
      successCalback();
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
    }
    setIsLoading(false);
  };

  const getCompanyById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await API.get(`/company/${id}`);
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
      setIsLoading(false);
      return null;
    }
  };

  return {
    companies,
    isLoading,
    refetchCompanies,
    createCompany,
    deleteCompany,
    fetchByName,
    setSearchTerm,
    updateCompany,
    getCompanyById,
  };
};

export default useCompanies;
