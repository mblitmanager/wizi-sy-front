import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TableAdmin } from "@/components/admin/TableAdmin";
import { FormAdmin } from "@/components/admin/FormAdmin";
import { Button } from "@/components/ui/button";
import { AdminCommercialAPI } from "@/services/admin/adminApi";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";

export default function AdminCommerciaux() {
  const [commerciaux, setCommerciaux] = useState<any[]>([]);
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
    secteur: "",
    objectif: "",
  });

  const fetchCommerciaux = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const result = await AdminCommercialAPI.getAll(pageNum, searchTerm);
      setCommerciaux(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (error) {
      toast.error("Erreur lors du chargement des commerciaux");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommerciaux(search, page);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchCommerciaux(e.target.value, 1);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormValues({
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      secteur: "",
      objectif: "",
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
      secteur: row.secteur || "",
      objectif: row.objectif || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (row: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${row.prenom} ${row.nom} ?`)) return;

    try {
      await AdminCommercialAPI.delete(row.id);
      toast.success("Commercial supprimé");
      fetchCommerciaux(search, page);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await AdminCommercialAPI.update(editingId, formValues);
        toast.success("Commercial mis à jour");
      } else {
        await AdminCommercialAPI.create(formValues);
        toast.success("Commercial créé");
      }
      setShowForm(false);
      fetchCommerciaux(search, page);
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
    { key: "secteur", label: "Secteur" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Commerciaux</h1>
          <Button
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus size={20} className="mr-2" />
            Ajouter un commercial
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un commercial..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Table */}
        <TableAdmin
          columns={columns}
          data={commerciaux}
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
          title={editingId ? "Éditer un commercial" : "Ajouter un commercial"}
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
              name: "secteur",
              label: "Secteur",
              type: "text",
            },
            {
              name: "objectif",
              label: "Objectif",
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
