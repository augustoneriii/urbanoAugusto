import React, { useCallback, useState, useEffect } from "react";

import Header from "../../shared/header";
import SuccessDialog from "../../shared/SuccesDialog";
import { useNavigate, useParams } from "react-router-dom";
import usePackages from "../../hooks/usePackages";

const errorsInitialState = {
  name: "",
  description: "",
  price: "",
  addTime: "",
};

const CreateOrEditPackage: React.FC = () => {
  const route = useNavigate();
  const { packageId } = useParams<{ packageId?: string }>();
  const { isLoading, createPackage, updatePackage, getPackageById } =
    usePackages();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<string>("");
  const [addTime, setAddTime] = useState<string>("");

  const [errors, setErrors] = useState(errorsInitialState);

  const [dialogIsOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState("");

  useEffect(() => {
    const loadPackageData = async () => {
      if (packageId) {
        const data = await getPackageById(packageId);
        if (data) {
          setName(data.name);
          setDescription(data.description);
          setPrice(String(data.price));
          setAddTime(String(data.addTime));
        }
      }
    };
    loadPackageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId]);

  const validateForm = () => {
    let newErrors: any = {};
    let valid = true;

    if (!name) {
      newErrors.name = "Nome do pacote é obrigatório";
      valid = false;
    }

    if (!description) {
      newErrors.description = "Descrição do pacote é obrigatória";
      valid = false;
    }

    if (!price) {
      newErrors.price = "O preço é obrigatório";
      valid = false;
    }

    if (!addTime) {
      newErrors.addTime = "O tempo é obrigatório";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const successCalbackEdit = () => {
    setDialogOpen(true);
    setDialogTitle("Pacote atualizado com sucesso!");
  };

  const successCalbackCreate = () => {
    setDialogOpen(true);
    setDialogTitle("Pacote adicionado com sucesso!");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    if (validateForm()) {
      const numericPrice = parseFloat(price.replace(",", "."));
      const numericAddTime = parseInt(addTime);

      console.log("numericPrice", numericPrice);
      console.log("numericAddTime", numericAddTime);

      const payload = {
        id: packageId ?? "",
        name: name,
        description: description,
        price: numericPrice,
        addTime: numericAddTime,
        available: true,
      };
      if (packageId) {
        await updatePackage(packageId, payload, successCalbackEdit);
      } else {
        await createPackage(payload, successCalbackCreate);
      }
    }
  };

  const onCancel = useCallback(() => {
    setDialogOpen(false);
    route("/pacote");
  }, [route]);

  const onConfirm = useCallback(() => {
    setDialogOpen(false);

    setErrors(errorsInitialState);

    setName("");
    setDescription("");
    setPrice("");
    setAddTime("");

    if (packageId) {
      route("/empresa/create");
    }
  }, [packageId, route]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9,]/g, "").replace(",", ".");
    if (value.includes(".")) {
      const parts = value.split(".");
      if (parts[1].length > 2) {
        value = parts[0] + "." + parts[1].substr(0, 2);
      }
    }
    setPrice(value);
  };

  const formatDisplayPrice = (value: string): string => {
    return value ? `R$ ${value.replace(".", ",")}` : "";
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAddTime(value);
  };

  const formatDisplayTime = (value: string): string => {
    return value ? `${value} s` : "";
  };

  return (
    <>
      <Header />
      <div className="text-center mt-8">
        <h2 className="text-2xl font-semibold">
          {packageId ? "Atualizar dados do pacote" : "Adicionar novo pacote"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-8">
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="Nome do pacote"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mx-2">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="Descrição do pacote"
          />
          {errors.description && (
            <p className="text-red-500 text-xs italic mx-2">
              {errors.description}
            </p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="price"
            value={formatDisplayPrice(price)}
            onChange={handlePriceChange}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="Preço do pacote"
          />
          {errors.price && (
            <p className="text-red-500 text-xs italic mx-2">{errors.price}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="addTime"
            value={formatDisplayTime(addTime)}
            onChange={handleTimeChange}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="Duração em segundos"
          />
          {errors.addTime && (
            <p className="text-red-500 text-xs italic mx-2">{errors.addTime}</p>
          )}
        </div>

        <div className="flex justify-center ">
          <button
            type="submit"
            className="text-white bg-black hover:bg-opacity-70 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg w-full text-md px-5 py-2.5 text-center"
          >
            {isLoading ? (
              <div className="text-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : packageId ? (
              "Atualizar pacote"
            ) : (
              "Criar pacote"
            )}
          </button>
        </div>
      </form>

      <SuccessDialog
        isOpen={dialogIsOpen}
        onCancel={onCancel}
        onConfirm={onConfirm}
        title={dialogTitle}
        message={"Deseja adicionar um novo pacote?"}
      />
    </>
  );
};

export default CreateOrEditPackage;
