import React, { useCallback, useEffect, useState } from "react";
import useCompanies from "../../hooks/useCompanies";
import Header from "../../shared/header";
import SuccessDialog from "../../shared/SuccesDialog";
import { useNavigate, useParams } from "react-router-dom";

const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  phone: /^\(\d{2}\) \d{4,5}-\d{4}$/,
  cep: /^\d{5}-\d{3}$/,
};

const companyInitialState = {
  name: "",
  representative: "",
  cnpj: "",
  email: "",
  phone: "",
  address: {
    rua: "",
    bairro: "",
    cep: "",
  },
  pacotes: [],
};

const errorsInitialState = {
  name: "",
  representative: "",
  cnpj: "",
  email: "",
  phone: "",
  rua: "",
  bairro: "",
  cep: "",
};

const CreateOrEditCompany: React.FC = () => {
  const { createCompany, updateCompany, getCompanyById, isLoading } =
    useCompanies();
  const route = useNavigate();
  const { companyId } = useParams<{ companyId?: string }>();
  const [companyData, setCompanyData] = useState(companyInitialState);
  const [errors, setErrors] = useState(errorsInitialState);

  const [dialogIsOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState("");

  useEffect(() => {
    const loadCompanyData = async () => {
      if (companyId) {
        const data = await getCompanyById(companyId);
        if (data) {
          setCompanyData({
            name: data.name.name,
            representative: data.name.representative,
            cnpj: data.name.cnpj,
            email: data.name.email,
            phone: data.name.phone,
            address: {
              rua: data.name.address.rua,
              bairro: data.name.address.bairro,
              cep: data.name.address.cep,
            },
            pacotes: [],
          });
        }
      }
    };
    loadCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const validateForm = () => {
    let newErrors: any = {};
    let valid = true;

    if (!companyData.name) {
      newErrors.name = "Nome da empresa é obrigatório";
      valid = false;
    }

    if (!companyData.representative) {
      newErrors.representative = "Nome do representante é obrigatório";
      valid = false;
    }

    if (!companyData.cnpj || !regex.cnpj.test(companyData.cnpj)) {
      newErrors.cnpj = "CNPJ inválido ou não preenchido";
      valid = false;
    }

    if (!companyData.email || !regex.email.test(companyData.email)) {
      newErrors.email = "E-mail inválido ou não preenchido";
      valid = false;
    }

    if (!companyData.phone || !regex.phone.test(companyData.phone)) {
      newErrors.phone = "Telefone inválido ou não preenchido";
      valid = false;
    }

    if (!companyData.address.cep || !regex.cep.test(companyData.address.cep)) {
      newErrors.cep = "CEP inválido ou não preenchido";
      valid = false;
    }

    if (!companyData.address.rua) {
      newErrors.rua = "Rua é obrigatória";
      valid = false;
    }

    if (!companyData.address.bairro) {
      newErrors.bairro = "Bairro é obrigatório";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "phone") {
      setCompanyData({ ...companyData, phone: formatPhone(value) });
    } else if (name === "cnpj") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/g, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/g, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/g, ".$1/$2")
        .replace(/(\d{4})(\d)/g, "$1-$2")
        .substring(0, 18);
      setCompanyData({ ...companyData, cnpj: formattedValue });
    } else if (name === "cep") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{5})(\d)/g, "$1-$2")
        .substring(0, 9);
      setCompanyData({
        ...companyData,
        address: { ...companyData.address, cep: formattedValue },
      });
    } else if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setCompanyData({
        ...companyData,
        address: { ...companyData.address, [field]: value },
      });
    } else {
      setCompanyData({ ...companyData, [name]: value });
    }
  };

  const successCalbackCreate = useCallback(() => {
    setDialogOpen(true);
    setDialogTitle("Empresa adicionada com sucesso!");
  }, []);

  const successCalbackEdit = useCallback(() => {
    setDialogOpen(true);
    setDialogTitle("Empresa atualizada com sucesso!");
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    if (validateForm()) {
      if (companyId) {
        await updateCompany(companyId, companyData, successCalbackEdit);
      } else {
        await createCompany(companyData, successCalbackCreate);
      }
    }
  };

  const formatPhone = useCallback((value: string) => {
    const numbers = value.replace(/\D/g, "");

    const trimmed = numbers.slice(0, 11);

    if (trimmed.length <= 10) {
      return trimmed.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      return trimmed.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }
  }, []);

  const onCancel = useCallback(() => {
    setDialogOpen(false);
    route("/empresa");
  }, [route]);

  const onConfirm = useCallback(() => {
    setDialogOpen(false);
    setCompanyData(companyInitialState);
    setErrors(errorsInitialState);

    if (companyId) {
      route("/empresa/create");
    }
  }, [companyId, route]);

  return (
    <>
      <Header />
      <div className="text-center mt-8">
        <h2 className="text-2xl font-semibold">
          {companyId ? "Atualizar dados da empresa" : "Adicionar nova empresa"}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto my-8">
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={companyData.name}
            onChange={handleChange}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="Nome da empresa"
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic mx-2">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="representative"
            value={companyData.representative}
            onChange={handleChange}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="Representante"
          />
          {errors.representative && (
            <p className="text-red-500 text-xs italic mx-2">
              {errors.representative}
            </p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="cnpj"
            value={companyData.cnpj}
            onChange={handleChange}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="CNPJ"
          />
          {errors.cnpj && (
            <p className="text-red-500 text-xs italic mx-2">{errors.cnpj}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={companyData.email}
            onChange={handleChange}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="Endereço de e-mail"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mx-2">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="phone"
            value={companyData.phone}
            onChange={handleChange}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="Telefone para contato"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs italic mx-2">{errors.phone}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="text"
            name="cep"
            value={companyData.address.cep}
            onChange={handleChange}
            className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
            placeholder="CEP"
          />
          {errors.cep && (
            <p className="text-red-500 text-xs italic mx-2">{errors.cep}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="address.rua"
              id="address_rua"
              value={companyData.address.rua}
              onChange={handleChange}
              className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
              placeholder="Rua"
            />
            {errors.rua && (
              <p className="text-red-500 text-xs italic mx-2">{errors.rua}</p>
            )}
          </div>

          <div className="relative z-0 w-full mb-6 group">
            <input
              type="text"
              name="address.bairro"
              id="address_bairro"
              value={companyData.address.bairro}
              onChange={handleChange}
              className="block py-2 px-4 w-full text-sm border-2 border-gray-300 rounded-md focus:border-custom-black focus:outline-none"
              placeholder="Bairro"
            />
            {errors.bairro && (
              <p className="text-red-500 text-xs italic mx-2">
                {errors.bairro}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-center ">
          <button
            type="submit"
            className="text-white bg-black hover:bg-opacity-70 focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
            ) : companyId ? (
              "Atualizar Empresa"
            ) : (
              "Criar Empresa"
            )}
          </button>
        </div>
      </form>
      <SuccessDialog
        isOpen={dialogIsOpen}
        onCancel={onCancel}
        onConfirm={onConfirm}
        title={dialogTitle}
        message={"Deseja adicionar um novo cadastro?"}
      />
    </>
  );
};

export default CreateOrEditCompany;
