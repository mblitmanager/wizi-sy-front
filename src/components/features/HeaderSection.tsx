import { useNavigate } from "react-router-dom";

export default function HeaderSection({
  titre,
  buttonText,
}: {
  titre: string;
  buttonText: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-primary">{titre}</h1>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition">
        {buttonText}
      </button>
    </div>
  );
}
