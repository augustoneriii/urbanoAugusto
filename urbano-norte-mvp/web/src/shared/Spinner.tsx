// Spinner.tsx
const Spinner: React.FC = () => {
  return (
    <>
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full mt-8 h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    </>
  );
};

export default Spinner;
