import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/header";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import ConfirmationDialog from "../../shared/alertDialog";
import useAdvertisements, {
  AdvertisingProp,
} from "../../hooks/useAdvertisements";
import Spinner from "../../shared/Spinner";

const localStorage =
  "https://carmedia.online:5050/public/image/anuncio/";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")} ${
    minutes === 1 ? "minuto" : "minutos"
  }`;
}

const Advertising: React.FC = () => {
  const route = useNavigate();
  const { advertisements, isLoading, deleteAd } = useAdvertisements();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdvertisingProp>(
    {} as AdvertisingProp
  );

  console.log("advertisements", advertisements)
  const handleDelete = (ad: AdvertisingProp) => {
    setSelectedAd(ad);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    setIsDialogOpen(false);
    deleteAd(selectedAd.id);
  };

  return (
    <>
      <div>
        <Header />
        <div className="flex justify-center mt-6">
          <button
            onClick={() => route("/anuncio/create")}
            className="flex items-center justify-center w-54 h-12 mt-3 rounded-lg bg-black bg-opacity-80 px-6 py-4 text-white text-lg hover:bg-opacity-70 focus:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 active:scale-95 transition duration-150 ease-in-out"
          >
            <FiPlus className="mr-2 text-xl" />
            Adicionar Anuncio
          </button>
        </div>

        <div className="text-center mt-6">
          <h2 className="text-2xl font-semibold">Meus Anúncios</h2>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-8 mt-8 gap-y-8 px-12">
            {advertisements.map((ad) => (
              <div
                key={ad.id}
                className="relative bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div className="absolute bottom-0 right-0 m-2 flex">
                  {/* <button
                    onClick={() => route(`/anuncio/update/${ad.id}`)}
                    className="text-blue-500 p-1 hover:bg-blue-500 hover:text-white rounded-full transition duration-300"
                  >
                    <FiEdit size={20} />
                  </button> */}
                  <button
                    onClick={() => handleDelete(ad)}
                    className="text-red-500 p-1 hover:bg-red-500 hover:text-white rounded-full transition duration-300"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
                <img
                  src={`${localStorage}${ad.images[0]}`}
                  alt={ad.title}
                  className="w-full h-56 object-cover object-center"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{ad.title}</h3>
                  <p className="text-sm text-gray-600">{ad.description}</p>
                  <p className="text-sm text-gray-600">
                    Empresa {ad.company.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duração {formatTime(ad.pacote.addTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Exclusão de Anúncio"
        message="Você tem certeza que deseja excluir este anúncio?"
      />
    </>
  );
};

export default Advertising;
