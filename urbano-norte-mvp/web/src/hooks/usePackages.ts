import { useState, useEffect } from "react";
import API from "../api/api"; // Certifique-se de que o caminho para sua instância de API está correto
import { debounce } from "lodash";

export type PackageProp = {
  id: string;
  name: string;
  description: string;
  price: number;
  addTime: number;
  available: boolean;
};

const usePackages = () => {
  const [packages, setPackages] = useState<PackageProp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTermPackage] = useState("");

  useEffect(() => {
    if (searchTerm.length >= 2) {
      fetchByName(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchByName = debounce(async (name: string) => {
    setIsLoading(true);
    try {
      const response = await API.get(`/pacote/getbyname/${name}`);
      setPackages(response.data);
    } catch (error) {
      console.error("Erro ao buscar pacotes por nome:", error);
    }
    setIsLoading(false);
  }, 300);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/pacote/");
      setPackages(response.data);
    } catch (error) {
      console.error("Erro ao buscar pacotes:", error);
    }
    setIsLoading(false);
  };

  const createPackage = async (
    packageData: PackageProp,
    sucessCallBack: Function
  ) => {
    setIsLoading(true);
    try {
      await API.post("/pacote/create", packageData);
      sucessCallBack();
    } catch (error) {
      console.error("Erro ao criar pacote:", error);
    }
    setIsLoading(false);
  };

  const updatePackage = async (
    id: string,
    packageData: Partial<PackageProp>,
    sucessCallBack: Function
  ) => {
    setIsLoading(true);
    try {
      await API.patch(`/pacote/update/${id}`, packageData);
      sucessCallBack();
    } catch (error) {
      console.error("Erro ao atualizar pacote:", error);
    }
    setIsLoading(false);
  };

  const deletePackage = async (id: string) => {
    setIsLoading(true);
    try {
      await API.delete(`/pacote/delete/${id}`);
      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg.id !== id)
      );
    } catch (error) {
      console.error("Erro ao remover pacote:", error);
    }
    setIsLoading(false);
  };

  const getPackageById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await API.get(`/pacote/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pacote por ID:", error);
    }
    setIsLoading(false);
  };

  return {
    packages,
    isLoading,
    fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    setSearchTermPackage,
    getPackageById,
  };
};

export default usePackages;
