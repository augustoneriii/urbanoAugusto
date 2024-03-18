import React, { useCallback, useEffect, useState } from "react";
import Header from "../../shared/header";
import ReactPlayer from "react-player";
import { FiSearch } from "react-icons/fi";
import useCompanies, { CompanyProp } from "../../hooks/useCompanies";
import usePackages, { PackageProp } from "../../hooks/usePackages";
import { useNavigate, useParams } from "react-router-dom";
import SuccessDialog from "../../shared/SuccesDialog";
import useAdvertisements, { AdCreateProp } from "../../hooks/useAdvertisements";

const errorsInitialState = {
  title: "",
  description: "",
  file: "",
  company: "",
  pack: "",
};

const CreateAd: React.FC = () => {
  const route = useNavigate();
  const { advertisingId } = useParams<{ advertisingId?: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState(errorsInitialState);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [preview, setPreview] = useState<any>("");
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [inputCompany, setInputCompany] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyProp | null>(
    null
  );
  const [inputPackage, setInputPackage] = useState<string>("");
  const [selectedPackage, setSelectedPackage] = useState<PackageProp | null>(
    null
  );
  const [isSearchActivePg, setIsSearchActivePg] = useState(false);
  const { companies, setSearchTerm, refetchCompanies } = useCompanies();
  const { packages, setSearchTermPackage, fetchPackages } = usePackages();

  const [dialogIsOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState("");

  const { createAd, isLoading, updateAd, getAdById } = useAdvertisements();

  useEffect(() => {
    const loadPackageData = async () => {
      if (advertisingId) {
        const data = await getAdById(advertisingId);
        if (data) {
          setTitle(data.title);
          setDescription(data.description);
          setSelectedCompany({
            name: {
              _id: data.company.id,
              name: data.company.name,
              representative: "",
              cnpj: "",
              email: "",
              phone: "",
              address: {
                rua: "",
                bairro: "",
                cep: "",
              },
            },
          });
          setInputCompany(data.company.name);
          setSearchTerm(data.company.name);

          setSelectedPackage({
            id: data.pacote.id,
            name: data.pacote.name,
            description: data.pacote.description,
            price: data.pacote.price,
            addTime: data.pacote.addTime,
            available: true,
          });

          setInputPackage(data.pacote.name);

          setSearchTermPackage(data.pacote.name);
        }
      }
    };
    loadPackageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advertisingId]);

  const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const fileType = file.type.split("/")[0];
      setMediaType(fileType);
      setPreview(URL.createObjectURL(file));
      setErrors({ ...errors, file: "" });
    }
  };

  const handleResetPreview = () => {
    setPreview(null);
    setFile(null);
    setMediaType(null);
  };

  const successCalbackEdit = () => {
    setDialogOpen(true);
    setDialogTitle("Anuncioatualizado com sucesso!");
  };

  const successCalbackCreate = () => {
    setDialogOpen(true);
    setDialogTitle("Anúncio adicionado com sucesso!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // if (isLoading) return;

    const payload: AdCreateProp = {
      title,
      description,
      images: file,
      companyId: selectedCompany?.name._id ?? "",
      packageId: selectedPackage?.id ?? "",
    };

    if (advertisingId) {
      updateAd(advertisingId, payload, successCalbackEdit);
    } else {
      console.log("PASS HERE");
      createAd(payload, successCalbackCreate);
    }
  };

  const validateForm = () => {
    let newErrors: any = {};
    let valid = true;

    if (!title) {
      newErrors.title = "O título do anúncio é obrigatório";
      valid = false;
    }

    if (!description) {
      newErrors.description = "A descrição é obrigatória";
      valid = false;
    }

    if (!file) {
      newErrors.file = "O arquivo é obrigatório";
      valid = false;
    }

    if (!selectedCompany) {
      newErrors.company = "É necessário selecionar a empresa";
      valid = false;
    }

    if (!selectedPackage) {
      newErrors.pack = "É necessário selecionar o pacote";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputCompany(value);
    if (value.length >= 2) {
      setSearchTerm(value);
      setIsSearchActive(true);
    } else if (value.length === 0) {
      handleClearSearch();
      refetchCompanies();
    }
  };

  const handleClearSearch = () => {
    setInputCompany("");
    setIsSearchActive(false);
    setSelectedCompany(null);
    setSearchTerm("");
    refetchCompanies();
  };

  const handleSelectCompany = (company: CompanyProp) => {
    setSelectedCompany(company);
    setInputCompany(company.name.name);
    setSearchTerm(company.name.name);
    setErrors({ ...errors, company: "" });
  };

  const handleSearchChangePackage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setInputPackage(value);
    if (value.length >= 2) {
      setSearchTermPackage(value);
      setIsSearchActivePg(true);
    } else if (value.length === 0) {
      handleClearSearchPacakge();
      fetchPackages();
    }
  };

  const handleClearSearchPacakge = () => {
    setInputPackage("");
    setIsSearchActivePg(false);
    setSelectedPackage(null);
    setSearchTermPackage("");
    fetchPackages();
  };

  const handleSelectPackage = (pack: PackageProp) => {
    setSelectedPackage(pack);
    setInputPackage(pack.name);
    setSearchTermPackage(pack.name);
    setErrors({ ...errors, pack: "" });
  };

  const onCancel = useCallback(() => {
    setDialogOpen(false);
    route("/anuncio");
  }, [route]);

  const onConfirm = useCallback(() => {
    setDialogOpen(false);

    setErrors(errorsInitialState);

    setTitle("");
    setDescription("");
    handleClearSearch();
    handleClearSearchPacakge();
    handleResetPreview();

    if (advertisingId) {
      route("/empresa/create");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advertisingId, route]);

  return (
    <>
      <div>
        <Header />
        <div className="text-center mt-8">
          <h2 className="text-2xl font-semibold">Adicionar um novo anúncio</h2>
        </div>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-8">
          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: "" });
              }}
              className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
              placeholder="Titulo"
            />
            {errors.title && (
              <p className="text-red-500 text-xs italic mx-2">{errors.title}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: "" });
              }}
              className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
              placeholder="Descrição"
            />
            {errors.description && (
              <p className="text-red-500 text-xs italic mx-2">
                {errors.description}
              </p>
            )}
          </div>
          <div className="mb-4">
            <div className="flex-grow" style={{ flexBasis: "80%" }}>
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                <FiSearch className="text-gray-500 mx-3" />
                <input
                  type="text"
                  className=" p-2 w-full outline-none"
                  placeholder="Empresa"
                  value={inputCompany}
                  onChange={handleSearchChange}
                />
                {isSearchActive && (
                  <button
                    onClick={handleClearSearch}
                    className="text-gray-500 mx-3 transition duration-150 ease-in-out transform hover:rotate-180"
                  >
                    &#10005;
                  </button>
                )}
              </div>
            </div>
            {errors.company && (
              <p className="text-red-500 text-xs italic mx-2">
                {errors.company}
              </p>
            )}
          </div>

          {companies.length > 0 &&
            inputCompany.length >= 2 &&
            companies.map((company) => (
              <li
                key={company.name._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectCompany(company)}
              >
                <input
                  type="checkbox"
                  checked={selectedCompany?.name._id === company.name._id}
                  onChange={() => handleSelectCompany(company)}
                  className="mr-2"
                />
                {company.name.name}
              </li>
            ))}

          <div className="mb-4">
            <div className="flex-grow" style={{ flexBasis: "80%" }}>
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                <FiSearch className="text-gray-500 mx-3" />
                <input
                  type="text"
                  className=" p-2 w-full outline-none"
                  placeholder="Pacote"
                  value={inputPackage}
                  onChange={handleSearchChangePackage}
                />
                {isSearchActivePg && (
                  <button
                    onClick={handleClearSearchPacakge}
                    className="text-gray-500 mx-3 transition duration-150 ease-in-out transform hover:rotate-180"
                  >
                    &#10005;
                  </button>
                )}
              </div>
            </div>
            {errors.pack && (
              <p className="text-red-500 text-xs italic mx-2">{errors.pack}</p>
            )}
          </div>

          {packages.length > 0 &&
            inputPackage.length >= 2 &&
            packages.map((pack) => (
              <li
                key={pack.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectPackage(pack)}
              >
                <input
                  type="checkbox"
                  checked={selectedPackage?.id === pack.id}
                  onChange={() => handleSelectPackage(pack)}
                  className="mr-2"
                />
                {pack.name}
              </li>
            ))}

          {preview && mediaType === "video" && (
            <div className="rounded-lg mb-4 mt-8">
              <ReactPlayer
                url={preview}
                width="100%"
                height="100%"
                controls={true}
              />
            </div>
          )}
          {preview && mediaType === "image" && (
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg mb-4 mt-8 max-w-full h-auto"
            />
          )}

          {!preview ? (
            <div className="flex items-center justify-center w-full mt-4 mb-4">
              <label className="flex flex-col items-center justify-center w-full h-64 border-1 border-gray-100 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-100 dark:bg-gray-200 hover:bg-gray-100 dark:border-gray-300 dark:hover:border-gray-100 dark:hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-700 dark:text-gray-80"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-700 dark:text-gray-700">
                    <span className="font-semibold">
                      Clique para fazer upload
                    </span>{" "}
                    ou arraste e solte
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    PNG, JPG, GIF, JPEG, WEBP or MP4
                  </p>
                </div>

                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleMediaChange}
                />
                {errors.file && (
                  <p className="text-red-600 text-xs italic mx-2">
                    {errors.file}
                  </p>
                )}
              </label>
            </div>
          ) : (
            <div className="flex justify-center mt-4 mb-4">
              <button
                type="button"
                onClick={handleResetPreview}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition duration-150 ease-in-out"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12H9m2.879-4.121l-3.879 3.879 3.879 3.879"
                  ></path>
                </svg>
                Alterar arquivo
              </button>
            </div>
          )}

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
              ) : (
                "Criar anúncio"
              )}
            </button>
          </div>
        </form>
      </div>
      <SuccessDialog
        isOpen={dialogIsOpen}
        onCancel={onCancel}
        onConfirm={onConfirm}
        title={dialogTitle}
        message={"Deseja adicionar um novo anúncio?"}
      />
    </>
  );
};

export default CreateAd;
