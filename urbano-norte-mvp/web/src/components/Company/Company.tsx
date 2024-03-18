import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/header";
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import ConfirmationDialog from "../../shared/alertDialog";
import Spinner from "../../shared/Spinner";
import useCompanies, { CompanyProp } from "../../hooks/useCompanies";

const Company: React.FC = () => {
  const route = useNavigate();
  const {
    companies,
    isLoading,
    deleteCompany,
    setSearchTerm,
    refetchCompanies,
  } = useCompanies();
  const [inputValue, setInputValue] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState<CompanyProp>(
    {} as CompanyProp
  );

  const handleDelete = (ad: CompanyProp) => {
    setSelectedCompany(ad);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    setIsDialogOpen(false);
    deleteCompany(selectedCompany.name._id);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.length >= 2) {
      setSearchTerm(value);
      setIsSearchActive(true);
    } else if (value.length === 0) {
      handleClearSearch();
      refetchCompanies();
    }
  };

  const handleClearSearch = () => {
    setInputValue("");
    setIsSearchActive(false);
    setSearchTerm("");
    refetchCompanies();
  };

  return (
    <>
      <div>
        <Header />

        <div className="container mx-auto mt-8 my-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-grow mr-4" style={{ flexBasis: "80%" }}>
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                <FiSearch className="text-gray-500 mx-3" />
                <input
                  type="text"
                  className="p-2 w-full outline-none"
                  placeholder="Pesquisar empresa"
                  value={inputValue}
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
            <button
              onClick={() => route("/empresa/create")}
              className="flex items-center justify-center px-6 py-2 rounded-lg bg-black text-white hover:bg-opacity-70 transition duration-150 ease-in-out"
            >
              <FiPlus className="mr-2" />
              Criar nova empresa
            </button>
          </div>
        </div>

        <div className="text-center mt-8 mb-8">
          <h2 className="text-2xl font-semibold">Empresas cadastradas</h2>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          companies.map((company) => (
            <div
              key={company.name._id}
              className="p-4 border-b flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{company.name.name}</h2>
                <p>{company.name.representative}</p>
              </div>
              <div>
                <button
                  onClick={() => route(`/empresa/update/${company.name._id}`)}
                  className="p-1 mr-2"
                >
                  <FiEdit
                    size={20}
                    className="text-blue-500 hover:text-blue-700"
                  />
                </button>
                <button onClick={() => handleDelete(company)} className="p-1">
                  <FiTrash2
                    size={20}
                    className="text-red-500 hover:text-red-700"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Exclusão de empresa"
        message="Você tem certeza que deseja excluir esta empresa?"
      />
    </>
  );
};

export default Company;
