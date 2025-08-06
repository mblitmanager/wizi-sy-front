import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import axios from "axios";
import { motion } from "framer-motion";

const ContactSupportPage = () => {
  const [form, setForm] = useState({
    objet: "",
    type: "",
    description: "",
    email: "",
    files: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({
        ...prev,
        files: Array.from(e.target.files as FileList),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("subject", form.objet);
      formData.append("problem_type", form.type);
      formData.append("message", form.description);

      form.files.forEach((file) => {
        formData.append("attachments[]", file);
      });

      await axios.post(`${import.meta.env.VITE_API_URL}/contact`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSubmitStatus("success");
      setForm({
        objet: "",
        type: "",
        description: "",
        email: "",
        files: [],
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto py-8 px-4 max-w-2xl">
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mb-6">
          <img src="/assets/logo.png" alt="Logo" className="h-16 mb-2" />
          <h1 className="text-3xl font-bold text-brown-shade">
            Comment peut-on t'aider ?
          </h1>
        </motion.div>

        {/* Feedback Message */}
        {submitStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-lg shadow-md ${
              submitStatus === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
            <div className="flex items-center">
              {submitStatus === "success" ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Votre message a été envoyé avec succès !</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Une erreur est survenue. Veuillez réessayer.</span>
                </>
              )}
            </div>
          </motion.div>
        )}

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-6">
          <motion.div variants={itemVariants} className="mb-4">
            <label className="block font-medium mb-1" htmlFor="objet">
              Objet
            </label>
            <input
              type="text"
              id="objet"
              name="objet"
              value={form.objet}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Objet de votre demande"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-4">
            <label className="block font-medium mb-1" htmlFor="type">
              Type de problème
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required>
              <option value="">Sélectionner...</option>
              <option value="abus">Signaler un abus</option>
              <option value="acces">
                Je n'arrive pas à accéder à mon compte
              </option>
              <option value="bug">Signalement bug</option>
              <option value="compte">Problème lié à mon compte</option>
              <option value="autre">Autre bug</option>
              <option value="suppression">
                Demande de suppression de compte
              </option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-4">
            <label className="block font-medium mb-1" htmlFor="description">
              Décris ton problème
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Décris ton problème ici..."
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-4">
            <label className="block font-medium mb-1" htmlFor="email">
              Ton adresse mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="exemple@domaine.com"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <label className="block font-medium mb-1" htmlFor="file">
              Pièces jointes
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="file"
                name="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              />
              <label
                htmlFor="file"
                className="cursor-pointer flex flex-col items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                </span>
                {form.files.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-medium text-gray-500">
                      {form.files.length} fichier(s) sélectionné(s)
                    </span>
                  </div>
                )}
              </label>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <button
              type="submit"
              className="relative bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="opacity-0">Envoyer</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                </>
              ) : (
                "Envoyer"
              )}
            </button>
          </motion.div>
        </motion.form>

        <motion.footer
          variants={itemVariants}
          className="mt-12 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Wizi Learn. Tous droits réservés.
        </motion.footer>
      </motion.div>
    </Layout>
  );
};

export default ContactSupportPage;
