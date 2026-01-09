import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TableAdmin } from "@/components/admin/TableAdmin";
import { FormAdmin } from "@/components/admin/FormAdmin";
import { Button } from "@/components/ui/button";
import { AdminFormationAPI } from "@/services/admin/adminApi";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

export default function AdminFormations() {
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formValues, setFormValues] = useState({
    titre: "",
    description: "",
    categorie: "",
    statut: "1",
  });

  const fetchFormations = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const result = await AdminFormationAPI.getAll(pageNum, searchTerm);
      setFormations(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (error) {
      toast.error("Erreur lors du chargement des formations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations(search, page);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchFormations(e.target.value, 1);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormValues({
      titre: "",
      description: "",
      categorie: "",
      statut: "1",
    });
    setShowForm(true);
  };

  const handleEdit = (row: any) => {
    setEditingId(row.id);
    setFormValues({
      titre: row.titre || "",
      description: row.description || "",
      categorie: row.categorie || "",
      statut: row.statut || "1",
    });
    setShowForm(true);
  };

  const handleDelete = async (row: any) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer la formation "${row.titre}" ?`
      )
    )
      return;

    try {
      await AdminFormationAPI.delete(row.id);
      toast.success("Formation supprimée");
      fetchFormations(search, page);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleDuplicate = async (row: any) => {
    try {
      await AdminFormationAPI.duplicate(row.id);
      toast.success("Formation dupliquée");
      fetchFormations(search, page);
    } catch (error) {
      toast.error("Erreur lors de la duplication");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await AdminFormationAPI.update(editingId, formValues);
        toast.success("Formation mise à jour");
      } else {
        await AdminFormationAPI.create(formValues);
        toast.success("Formation créée");
      }
      setShowForm(false);
      fetchFormations(search, page);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "titre", label: "Titre" },
    { key: "categorie", label: "Catégorie" },
    {
      key: "statut",
      label: "Statut",
      render: (value: any) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            value === "1"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
          {value === "1" ? "Actif" : "Inactif"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Formations</h1>
          <Button
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus size={20} className="mr-2" />
            Ajouter une formation
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Table */}
        <TableAdmin
          columns={columns}
          data={formations}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <FormAdmin
          title={
            editingId ? "Éditer une formation" : "Ajouter une formation"
          }
          fields={[
            {
              name: "titre",
              label: "Titre",
              type: "text",
              required: true,
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
            },
            {
              name: "categorie",
              label: "Catégorie",
              type: "select",
              options: [
                { value: "Bureautique", label: "Bureautique" },
                { value: "Langues", label: "Langues" },
                { value: "Internet", label: "Internet" },
                { value: "Création", label: "Création" },
                { value: "IA", label: "Intelligence Artificielle" },
              ],
            },
            {
              name: "statut",
              label: "Statut",
              type: "select",
              options: [
                { value: "1", label: "Actif" },
                { value: "0", label: "Inactif" },
              ],
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
