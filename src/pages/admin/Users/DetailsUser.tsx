import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  active: boolean;
  formations: { id: number; titre: string }[];
}

export default function DetailUser() {
  const { id } = useParams<{ id: string }>(); // Récupère l'ID de l'utilisateur depuis l'URL
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Token not found in local storage.");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/stagiaires/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUser(data); // Stocke les détails de l'utilisateur
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#4A90E2" size={50} /> {/* Spinner */}
      </div>
    );
  }

  if (!user) {
    return <p>Aucun utilisateur trouvé.</p>;
  }

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Détails de l'utilisateur
        </h1>
        <Link
          to="/admin/users"
          className="btn btn-primary flex items-center space-x-2">
          Retour à la liste des utilisateurs
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Informations générales</h2>
        <p>
          <strong>Nom :</strong> {user.nom}
        </p>
        <p>
          <strong>Prénom :</strong> {user.prenom}
        </p>
        <p>
          <strong>Email :</strong> {user.email}
        </p>{" "}
        <p>
          <strong>Statut :</strong>{" "}
          {user.active ? (
            <span className="text-green-500">Actif</span>
          ) : (
            <span className="text-red-500">Inactif</span>
          )}
        </p>
        <h2 className="text-xl font-bold mt-6 mb-4">Formations</h2>
        {user.formations.length > 0 ? (
          <ul className="list-disc pl-5">
            {user.formations.map((formation) => (
              <li key={formation.id}>
                {formation.titre} (ID: {formation.id})
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune formation associée.</p>
        )}
      </div>
    </div>
  );
}
