import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TableAdmin } from "@/components/admin/TableAdmin";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { api } from "@/lib/api";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAchievements = async (searchTerm = "", pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get("/admin/achievements", {
        params: { page: pageNum, search: searchTerm },
      });
      setAchievements(response.data.data || []);
      setTotalPages(response.data.pagination?.total_pages || 1);
    } catch (error) {
      toast.error("Erreur lors du chargement des achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements(search, page);
  }, [page]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
    fetchAchievements(e.target.value, 1);
  };

  const handleDelete = async (row: any) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer cet achievement ?`)) return;

    try {
      await api.delete(`/admin/achievements/${row.id}`);
      toast.success("Achievement supprimé");
      fetchAchievements(search, page);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "titre", label: "Titre" },
    { key: "description", label: "Description" },
    { key: "points", label: "Points" },
    { key: "icone", label: "Icône" },
    {
      key: "statut",
      label: "Statut",
      render: (value: any, row: any) => (
        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
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
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <Button disabled className="bg-gray-400 text-white">
            Géré par système
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un achievement..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            Les achievements sont générés automatiquement par le système selon les actions des stagiaires.
            Vous pouvez les consulter et les supprimer si nécessaire.
          </p>
        </div>

        {/* Table */}
        <TableAdmin
          columns={columns}
          data={achievements}
          loading={loading}
          onDelete={handleDelete}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          hideEdit={true}
        />
      </div>
    </AdminLayout>
  );
}
