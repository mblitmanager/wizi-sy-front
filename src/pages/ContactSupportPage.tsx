import { useState } from "react";
import { Layout } from "@/components/layout/Layout";

const ContactSupportPage = () => {
  const [form, setForm] = useState({
    objet: "",
    type: "",
    description: "",
    email: "",
    files: [] as File[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, files: e.target.files ? Array.from(e.target.files) : [] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ajoutez ici la logique d'envoi (API, email, etc.)
    alert("Votre demande a été envoyée !");
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-brown-shade">Comment peut-on t'aider ?</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="objet">Objet</label>
            <input type="text" id="objet" name="objet" value={form.objet} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Objet de votre demande" />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="type">Type de problème</label>
            <select id="type" name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">Sélectionner...</option>
              <option value="abus">Signaler un abus</option>
              <option value="acces">Je n'arrive pas à accéder à mon compte</option>
              <option value="bug">Signalement bug</option>
              <option value="compte">Problème lié à mon compte</option>
              <option value="autre">Autre bug</option>
              <option value="suppression">Demande de suppression de compte</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="description">Décris ton problème</label>
            <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={5} className="w-full border rounded px-3 py-2" placeholder="Décris ton problème ici..." />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="email">Ton adresse mail</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="exemple@domaine.com" />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1" htmlFor="file">Pièces jointes</label>
            <input type="file" id="file" name="file" className="w-full" multiple onChange={handleFileChange} />
          </div>
          <button type="submit" className="bg-amber-600 text-white px-6 py-2 rounded font-semibold hover:bg-amber-700 transition">Envoyer</button>
        </form>
      </div>
    </Layout>
  );
};

export default ContactSupportPage;
