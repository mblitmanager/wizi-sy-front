import { UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../../../components/form/FormField";
import { FormProvider, useForm } from "react-hook-form";
import FormSelect2 from "../../../components/form/FormSelect2";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function CreateUser() {
  const navigate = useNavigate();
  const methods = useForm();
  const [formations, setFormations] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingFormations, setLoadingFormations] = useState(true);

  useEffect(() => {
    const fetchFormations = async () => {
      setLoadingFormations(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Token not found in local storage.");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BACKEND_URL}/formations`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch formations");
        }
        const data = await response.json();
        console.log("Fetched formations:", data);
        // Map the formations to the format required by FormSelect2
        const formattedFormations = data.member.map((formation: any) => ({
          value: formation.id.toString(),
          label: formation.titre,
        }));
        setFormations(formattedFormations);
      } catch (error) {
        console.error("Error fetching formations:", error);
        toast.error("Failed to fetch formations.");
      } finally {
        setLoadingFormations(false);
      }
    };

    fetchFormations();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User creation failed. Token not found.");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/stagiaire/ajouter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            nom: data.name,
            prenom: data.prenom,
            email: data.email,
            password: data.password,
            formations: data.formations,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const result = await response.json();
      toast.success("Stagiaire créé avec succès!");
      navigate("/admin/users");
    } catch (error) {
      toast.error("Échec de la création de l'utilisateur.");
    }
  };
  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Créer un utilisateur
        </h1>
        <button className="btn btn-primary flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <Link to="/admin/users"> Retour à la liste des utilisateurs</Link>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm py-3">
        <FormProvider {...methods}>
          <form
            className="max-w-2xl mx-auto"
            onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="mb-5">
              <FormField
                label="Nom"
                name="name"
                placeholder="John Doe"
                required
                helperText="Please enter the user's full name."
              />
            </div>
            <div className="mb-5">
              <FormField
                label="Prénom"
                name="prenom"
                placeholder="Jane"
                required
                helperText="Please enter the user's first name."
              />
            </div>
            <div className="mb-5">
              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="example@example.com"
                required
                helperText="Please enter a valid email address."
              />
            </div>
            <div className="mb-5">
              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="********"
                required
                helperText="Password must be at least 8 characters long."
              />
            </div>
            <div className="mb-5">
              {loadingFormations ? (
                <div className="flex justify-center items-center h-screen">
                  <ClipLoader color="#4A90E2" size={50} />
                </div>
              ) : (
                <FormSelect2
                  label="Formations"
                  name="formations"
                  options={formations}
                  required
                  helperText="Select one or more formations."
                />
              )}
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Ajouter
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
