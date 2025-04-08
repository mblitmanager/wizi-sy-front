import React, { useEffect, useState } from "react";
import {
  UserPlus,
  Search,
  Filter,
  ShieldMinus,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { json, Link } from "react-router-dom";
import { Edit2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
function UsersManagement() {
  interface Stagiaire {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    active: boolean;
  }

  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  useEffect(() => {
    fetchStagiaires();
  }, [currentPage]);
  const fetchStagiaires = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not found in local storage.");
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BACKEND_URL
        }/stagiaires?page=${currentPage}&itemsPerPage=${itemsPerPage}&active=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch stagiaires");
      }

      const data = await response.json();
      setStagiaires(data.member); // Set the list of stagiaires
      setTotalItems(data.totalItems); // Set the total number of items
    } catch (error) {
      toast.error("Error fetching stagiaires: " + error);
    } finally {
      setLoading(false);
    }
  };

  const desactivateStagiaire = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not found in local storage.");
      return;
    }

    if (
      !window.confirm("Êtes-vous sûr de vouloir désactiver cet utilisateur ?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/stagiaire/${id}/desactiver`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      toast.success("Utilisateur desactiver avec succès !");
      fetchStagiaires(); // Refetch the list of users after deletion
    } catch (error) {
      toast.error("Error desactivation user: " + error);
    }
  };

  const activateStagiaire = async (id: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not found in local storage.");
      alert("Failed to delete user. Token not found.");
      return;
    }

    if (
      !window.confirm("Êtes-vous sûr de vouloir d'activer cet utilisateur ?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/stagiaire/${id}/activer`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to active user");
      }

      toast.success("Utilisateur activer avec succès !");
      fetchStagiaires(); // Refetch the list of users after deletion
    } catch (error) {
      toast.error("Error activation user: " + error);
    }
  };
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des utilisateurs
        </h1>
        <button className="btn btn-primary flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <Link to="/admin/users/create">Ajouter un utilisateur</Link>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher des utilisateurs..."
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="btn btn-secondary flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prénom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600" colSpan={4}>
                    <div className="flex justify-center items-center h-screen">
                      <ClipLoader color="#4A90E2" size={50} /> {/* Spinner */}
                    </div>
                  </td>
                </tr>
              ) : stagiaires.length > 0 ? (
                stagiaires.map((stagiaire) => (
                  <tr key={stagiaire.id}>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {stagiaire.nom}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {stagiaire.prenom}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {stagiaire.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {stagiaire.active ? (
                        <span className="text-green-500">Actif</span>
                      ) : (
                        <span className="text-red-500">Inactif</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 flex space-x-4">
                      <Link
                        to={`/admin/users/${stagiaire.id}/update`}
                        className="text-blue-500 hover:underline">
                        <span className="flex items-center">
                          {" "}
                          <Edit2 /> Modifier
                        </span>
                      </Link>
                      <Link
                        to={`/admin/users/${stagiaire.id}/details`}
                        className="text-yellow-500 hover:underline">
                        <span className="flex items-center">
                          {" "}
                          <Eye /> Details
                        </span>
                      </Link>
                      {stagiaire.active ? (
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => desactivateStagiaire(stagiaire.id)}>
                          <span className="flex items-center">
                            <ShieldMinus /> Désactiver
                          </span>
                        </button>
                      ) : (
                        <button
                          className="text-green-500 hover:underline"
                          onClick={() => activateStagiaire(stagiaire.id)}>
                          <span className="flex items-center">
                            <ShieldCheck /> Activer
                          </span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600" colSpan={4}>
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              {`Affichage de ${stagiaires.length} sur ${totalItems} utilisateurs`}
            </p>
            <div className="space-x-2">
              <button
                className="btn btn-secondary"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}>
                Précédent
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}>
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersManagement;
