import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TableAdmin } from "@/components/admin/TableAdmin";
import { FormAdmin } from "@/components/admin/FormAdmin";
import { Button } from "@/components/ui/button";
import { AdminQuizAPI } from "@/services/admin/adminApi";
import { toast } from "sonner";
import { Plus, Search, Power } from "lucide-react";

export default function AdminQuiz() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formValues, setFormValues] = useState({
    titre: "",
    description: "",
    formation_id: "",
    statut: "1",
  });

  const fetchQuizzes = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const result = await AdminQuizAPI.getAll(pageNum, searchTerm);
      setQuizzes(result.data || []);
      setTotalPages(result.pagination?.total_pages || 1);
    } catch (error) {
      toast.error("Erreur lors du chargement des quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes(search, page);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchQuizzes(e.target.value, 1);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormValues({
      titre: "",
      description: "",
      formation_id: "",
      statut: "1",
    });
    setShowForm(true);
  };

  const handleEdit = (row: any) => {
    setEditingId(row.id);
    setFormValues({
      titre: row.titre || "",
      description: row.description || "",
      formation_id: row.formation_id || "",
      statut: row.statut || "1",
    });
    setShowForm(true);
  };

  const handleDelete = async (row: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le quiz "${row.titre}" ?`))
      return;

    try {
      await AdminQuizAPI.delete(row.id);
      toast.success("Quiz supprimé");
      fetchQuizzes(search, page);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleDuplicate = async (row: any) => {
    try {
      await AdminQuizAPI.duplicate(row.id);
      toast.success("Quiz dupliqué");
      fetchQuizzes(search, page);
    } catch (error) {
      toast.error("Erreur lors de la duplication");
    }
  };

  const handleToggle = async (row: any) => {
    try {
      if (row.statut === "1") {
        await AdminQuizAPI.disable(row.id);
        toast.success("Quiz désactivé");
      } else {
        await AdminQuizAPI.enable(row.id);
        toast.success("Quiz activé");
      }
      fetchQuizzes(search, page);
    } catch (error) {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await AdminQuizAPI.update(editingId, formValues);
        toast.success("Quiz mis à jour");
      } else {
        await AdminQuizAPI.create(formValues);
        toast.success("Quiz créé");
      }
      setShowForm(false);
      fetchQuizzes(search, page);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "titre", label: "Titre" },
    { key: "description", label: "Description", render: (v: any) => v?.substring(0, 50) + "..." },
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
          <h1 className="text-3xl font-bold text-gray-900">Quiz</h1>
          <Button
            onClick={handleAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus size={20} className="mr-2" />
            Ajouter un quiz
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un quiz..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Additional Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            Importer
          </Button>
        </div>

        {/* Table */}
        <TableAdmin
          columns={columns}
          data={quizzes}
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
          title={editingId ? "Éditer un quiz" : "Ajouter un quiz"}
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
              name: "formation_id",
              label: "Formation",
              type: "select",
              options: [
                { value: "1", label: "Formation 1" },
                { value: "2", label: "Formation 2" },
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
