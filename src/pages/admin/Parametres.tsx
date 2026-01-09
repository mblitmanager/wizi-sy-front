import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FormAdmin } from "@/components/admin/FormAdmin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Settings, Save } from "lucide-react";
import { api } from "@/lib/api";

interface AppSettings {
  app_name: string;
  app_description: string;
  support_email: string;
  support_phone: string;
  address: string;
  maintenance_mode: boolean;
  max_upload_size: number;
  session_timeout: number;
  password_expiry_days: number;
}

export default function AdminParametres() {
  const [settings, setSettings] = useState<AppSettings>({
    app_name: "Wizi-Learn",
    app_description: "Plateforme de formation en ligne",
    support_email: "support@wizi-learn.com",
    support_phone: "+33 1 23 45 67 89",
    address: "123 Rue de la Paix, 75000 Paris",
    maintenance_mode: false,
    max_upload_size: 10,
    session_timeout: 30,
    password_expiry_days: 90,
  });

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/settings");
      if (response.data) {
        setSettings(response.data.data || settings);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des paramètres");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/admin/settings", settings);
      toast.success("Paramètres mis à jour avec succès");
      setShowForm(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={32} className="text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 hover:bg-orange-700 text-white">
            <Settings size={20} className="mr-2" />
            Modifier
          </Button>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Nom de l'application</h3>
            <p className="text-2xl font-bold text-orange-600">{settings.app_name}</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Email Support</h3>
            <p className="text-lg text-gray-800">{settings.support_email}</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Téléphone Support</h3>
            <p className="text-lg text-gray-800">{settings.support_phone}</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Mode Maintenance</h3>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              settings.maintenance_mode
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}>
              {settings.maintenance_mode ? "Activé" : "Désactivé"}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Taille Max Upload</h3>
            <p className="text-lg text-gray-800">{settings.max_upload_size} MB</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-700 mb-2">Timeout Session</h3>
            <p className="text-lg text-gray-800">{settings.session_timeout} min</p>
          </Card>
        </div>

        {/* Description */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
          <p className="text-gray-600">{settings.app_description}</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-700 mb-2">Adresse</h3>
          <p className="text-gray-600">{settings.address}</p>
        </Card>
      </div>

      {/* Edit Form */}
      {showForm && (
        <FormAdmin
          title="Modifier les paramètres"
          fields={[
            {
              name: "app_name",
              label: "Nom de l'application",
              type: "text",
              required: true,
            },
            {
              name: "app_description",
              label: "Description",
              type: "textarea",
            },
            {
              name: "support_email",
              label: "Email Support",
              type: "email",
            },
            {
              name: "support_phone",
              label: "Téléphone Support",
              type: "text",
            },
            {
              name: "address",
              label: "Adresse",
              type: "text",
            },
            {
              name: "max_upload_size",
              label: "Taille Max Upload (MB)",
              type: "number",
            },
            {
              name: "session_timeout",
              label: "Timeout Session (minutes)",
              type: "number",
            },
            {
              name: "password_expiry_days",
              label: "Expiration Mot de Passe (jours)",
              type: "number",
            },
            {
              name: "maintenance_mode",
              label: "Mode Maintenance",
              type: "checkbox",
            },
          ]}
          values={settings}
          onChange={(name, value) =>
            setSettings({ ...settings, [name]: value })
          }
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          loading={loading}
          submitLabel="Enregistrer"
        />
      )}
    </AdminLayout>
  );
}
