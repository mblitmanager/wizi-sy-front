import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TableAdmin } from "@/components/admin/TableAdmin";
import { FormAdmin } from "@/components/admin/FormAdmin";
import { Button } from "@/components/ui/button";
import { AdminStagiaireAPI } from "@/services/admin/adminApi";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

export default function AdminStagiaires() {
  const [stagiaires, setStagiaires] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formValues, setFormValues] = useState({
    prenom: "",
    civilite: "",
    telephone: "",
    adresse: "",
    date_naissance: "",
    ville: "",
    code_postal: "",
  });

  const fetchStagiaires = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const result = await AdminStagiaireAPI.getAll(pageNum, searchTerm);
      setStagiaires(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (error) {
      toast.error("Erreur lors du chargement des stagiaires");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStagiaires(search, page);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchStagiaires(e.target.value, 1);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormValues({
      prenom: "",
      civilite: "",
      telephone: "",
      adresse: "",
      date_naissance: "",
      ville: "",
      code_postal: "",
    });
    setShowForm(true);
  };

  const handleEdit = (row: any) => {
    setEditingId(row.id);
    setFormValues({
      prenom: row.prenom || "",
      civilite: row.civilite || "",
      telephone: row.telephone || "",
      adresse: row.adresse || "",
      date_naissance: row.date_naissance || "",
      ville: row.ville || "",
      code_postal: row.code_postal || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (row: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${row.prenom} ?`)) return;

    try {
      await AdminStagiaireAPI.delete(row.id);
      toast.success("Stagiaire supprimé");
      fetchStagiaires(search, page);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await AdminStagiaireAPI.update(editingId, formValues);
        toast.success("Stagiaire mis à jour");
      } else {
        await AdminStagiaireAPI.create(formValues);
        toast.success("Stagiaire créé");
      }
      setShowForm(false);
      fetchStagiaires(search, page);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "prenom", label: "Prénom" },
    { key: "civilite", label: "Civilité" },
    { key: "telephone", label: "Téléphone" },
    { key: "ville", label: "Ville" },
    {
      key: "user_id",
      label: "Statut",
      render: (value: any, row: any) => (
        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
          {row.statut === "actif" ? "Actif" : "Inactif"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Stagiaires</h1>
          <Button
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus size={20} className="mr-2" />
            Ajouter un stagiaire
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un stagiaire..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Table */}
        <TableAdmin
          columns={columns}
          data={stagiaires}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <FormAdmin
          title={editingId ? "Éditer un stagiaire" : "Ajouter un stagiaire"}
          fields={[
            {
              name: "prenom",
              label: "Prénom",
              type: "text",
              required: true,
            },
            {
              name: "civilite",
              label: "Civilité",
              type: "select",
              options: [
                { value: "M", label: "Monsieur" },
                { value: "Mme", label: "Madame" },
                { value: "Mlle", label: "Mademoiselle" },
              ],
            },
            {
              name: "telephone",
              label: "Téléphone",
              type: "text",
            },
            {
              name: "adresse",
              label: "Adresse",
              type: "text",
            },
            {
              name: "date_naissance",
              label: "Date de naissance",
              type: "date",
            },
            {
              name: "ville",
              label: "Ville",
              type: "text",
            },
            {
              name: "code_postal",
              label: "Code postal",
              type: "text",
            },
          ]}
          values={formValues}
          onChange={(name, value) =>
            setFormValues({ ...formValues, [name]: value })
          }
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          loading={loading}
          submitLabel={editingId ? "Mettre à jour" : "Créer"}
        />
      )}
    </AdminLayout>
  );
}
