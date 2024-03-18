import React from "react";

const SuccessDialog = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
}: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="mb-6 text-gray-600">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-white rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Novo Cadastro
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog;
