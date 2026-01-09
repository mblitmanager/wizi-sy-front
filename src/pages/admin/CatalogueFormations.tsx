import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TableAdmin } from "@/components/admin/TableAdmin";
import { FormAdmin } from "@/components/admin/FormAdmin";
import { Button } from "@/components/ui/button";
import { AdminCatalogueAPI } from "@/services/admin/adminApi";
import { toast } from "sonner";
import { Plus, Search, Download } from "lucide-react";

export default function AdminCatalogueFormations() {
  const [catalogues, setCatalogues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formValues, setFormValues] = useState({
    nom: "",
    description: "",
    prix: "",
    duree: "",
    niveau: "",
  });

  const fetchCatalogues = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const result = await AdminCatalogueAPI.getAll(pageNum, searchTerm);
      setCatalogues(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (error) {
      toast.error("Erreur lors du chargement des formations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogues(search, page);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchCatalogues(e.target.value, 1);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormValues({
      nom: "",
      description: "",
      prix: "",
      duree: "",
      niveau: "",
    });
    setShowForm(true);
  };

  const handleEdit = (row: any) => {
    setEditingId(row.id);
    setFormValues({
      nom: row.nom || "",
      description: row.description || "",
      prix: row.prix || "",
      duree: row.duree || "",
      niveau: row.niveau || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (row: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${row.nom} ?`)) return;

    try {
      await AdminCatalogueAPI.delete(row.id);
      toast.success("Formation supprimée");
      fetchCatalogues(search, page);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleDuplicate = async (row: any) => {
    try {
      await AdminCatalogueAPI.duplicate(row.id);
      toast.success("Formation dupliquée");
      fetchCatalogues(search, page);
    } catch (error) {
      toast.error("Erreur lors de la duplication");
    }
  };

  const handleDownloadPdf = async (row: any) => {
    try {
      const pdf = await AdminCatalogueAPI.downloadPdf(row.id);
      const url = window.URL.createObjectURL(new Blob([pdf]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${row.nom}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      toast.success("PDF téléchargé");
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await AdminCatalogueAPI.update(editingId, formValues);
        toast.success("Formation mise à jour");
      } else {
        await AdminCatalogueAPI.create(formValues);
        toast.success("Formation créée");
      }
      setShowForm(false);
      fetchCatalogues(search, page);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nom", label: "Nom" },
    { key: "prix", label: "Prix (€)" },
    { key: "duree", label: "Durée" },
    { key: "niveau", label: "Niveau" },
    {
      key: "actions",
      label: "Actions",
      render: (value: any, row: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDuplicate(row)}>
            Dupliquer
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDownloadPdf(row)}>
            <Download size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Formations du Catalogue</h1>
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
          data={catalogues}
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
          title={editingId ? "Éditer une formation" : "Ajouter une formation"}
          fields={[
            {
              name: "nom",
              label: "Nom de la formation",
              type: "text",
              required: true,
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
            },
            {
              name: "prix",
              label: "Prix",
              type: "number",
            },
            {
              name: "duree",
              label: "Durée (en heures)",
              type: "number",
            },
            {
              name: "niveau",
              label: "Niveau",
              type: "select",
              options: [
                { value: "débutant", label: "Débutant" },
                { value: "intermédiaire", label: "Intermédiaire" },
                { value: "avancé", label: "Avancé" },
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
