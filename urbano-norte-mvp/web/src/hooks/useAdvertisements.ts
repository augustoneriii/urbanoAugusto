import { useState, useEffect } from "react";
import API from "../api/api"; // Certifique-se de que o caminho para sua instância de API está correto

export type AdvertisingProp = {
  id: string;
  title: string;
  description: string;
  images: string[];
  company: {
    email: string;
    id: string;
    name: string;
    phone: string;
  };
  pacote: {
    id: string;
    description: string;
    name: string;
    price: number;
    addTime: number;
    available: boolean;
  };
  user: {
    id: string;
    name: string;
    phone: string;
  };
};

export type AdCreateProp = {
  title: string;
  description: string;
  images: any;
  companyId: string;
  packageId: string;
};

const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<AdvertisingProp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/anuncio/");
      setAdvertisements(response.data.anuncio);
    } catch (error) {
      alert(error);
      console.error("Erro ao buscar anúncios:", error);
    }
    setIsLoading(false);
  };

  const deleteAd = async (id: string) => {
    try {
      await API.delete(`/anuncio/delete/${id}`);
      setAdvertisements((prevAds) => prevAds.filter((ad) => ad.id !== id));
      fetchAds();
    } catch (error) {
      console.error("Erro ao excluir anúncio:", error);
    }
  };

  const createAd = async (payload: AdCreateProp, sucessCallBack: Function) => {
    
    setIsLoading(true);

    const formData = new FormData();
    const packageId = JSON.stringify([{"_id":payload.packageId}])

    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("images", payload.images);
    formData.append("company", payload.companyId);
    formData.append("pacote", packageId);
    
    try {
      await API.post("/anuncio/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      
      sucessCallBack();
    } catch (error) {
      
      console.error("Erro ao adicionar anúncio:", error);
      console.error(error);
    }
    setIsLoading(false);
  };

  const updateAd = async (
    id: string,
    payload: AdCreateProp,
    sucessCallBack: Function
  ) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("description", payload.description);
      formData.append("images", payload.images);
      formData.append("company", payload.companyId);
      formData.append("pacote", payload.packageId);

      await API.patch(`/anuncio/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      sucessCallBack();
    } catch (error) {
      console.error("Erro ao atualizar anúncio:", error);
    }
    setIsLoading(false);
  };

  const refetchAds = () => {
    fetchAds();
  };

  const getAdById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await API.get<{ anuncio: AdvertisingProp }>(
        `/anuncio/getbyid/${id}`
      );
      setIsLoading(false);
      return response.data.anuncio;
    } catch (error) {
      console.error("Erro ao buscar anúncio:", error);
      setIsLoading(false);
      return null;
    }
  };

  return {
    advertisements,
    isLoading,
    refetchAds,
    deleteAd,
    createAd,
    updateAd,
    getAdById,
  };
};

export default useAdvertisements;
