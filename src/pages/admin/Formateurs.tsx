import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TableAdmin } from "@/components/admin/TableAdmin";
import { FormAdmin } from "@/components/admin/FormAdmin";
import { Button } from "@/components/ui/button";
import { AdminFormateurAPI } from "@/services/admin/adminApi";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

export default function AdminFormateurs() {
  const [formateurs, setFormateurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formValues, setFormValues] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    specialite: "",
    bio: "",
  });

  const fetchFormateurs = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const result = await AdminFormateurAPI.getAll(pageNum, searchTerm);
      setFormateurs(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (error) {
      toast.error("Erreur lors du chargement des formateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormateurs(search, page);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchFormateurs(e.target.value, 1);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormValues({
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      specialite: "",
      bio: "",
    });
    setShowForm(true);
  };

  const handleEdit = (row: any) => {
    setEditingId(row.id);
    setFormValues({
      prenom: row.prenom || "",
      nom: row.nom || "",
      email: row.email || "",
      telephone: row.telephone || "",
      specialite: row.specialite || "",
      bio: row.bio || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (row: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${row.prenom} ${row.nom} ?`)) return;

    try {
      await AdminFormateurAPI.delete(row.id);
      toast.success("Formateur supprimé");
      fetchFormateurs(search, page);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await AdminFormateurAPI.update(editingId, formValues);
        toast.success("Formateur mis à jour");
      } else {
        await AdminFormateurAPI.create(formValues);
        toast.success("Formateur créé");
      }
      setShowForm(false);
      fetchFormateurs(search, page);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "prenom", label: "Prénom" },
    { key: "nom", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "telephone", label: "Téléphone" },
    { key: "specialite", label: "Spécialité" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Formateurs</h1>
          <Button
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus size={20} className="mr-2" />
            Ajouter un formateur
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un formateur..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Table */}
        <TableAdmin
          columns={columns}
          data={formateurs}
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
          title={editingId ? "Éditer un formateur" : "Ajouter un formateur"}
          fields={[
            {
              name: "prenom",
              label: "Prénom",
              type: "text",
              required: true,
            },
            {
              name: "nom",
              label: "Nom",
              type: "text",
              required: true,
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              required: true,
            },
            {
              name: "telephone",
              label: "Téléphone",
              type: "text",
            },
            {
              name: "specialite",
              label: "Spécialité",
              type: "text",
            },
            {
              name: "bio",
              label: "Biographie",
              type: "textarea",
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
