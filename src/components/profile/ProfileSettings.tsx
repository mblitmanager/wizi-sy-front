import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useUser } from "@/hooks/useAuth";
import { userProfileService } from "@/services/ProfileService";
import { Camera, Loader2 } from "lucide-react";

const ProfileSettings = () => {
  const { user, updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    quiz: true,
    formations: true,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const updatedProfile = await userProfileService.uploadStagiairePhoto(
        file
      );
      updateUser({ ...user, avatar: updatedProfile.photo_url });
      toast.success("Photo de profil mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      toast.error("Erreur lors de la mise à jour de la photo de profil");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: checked }));
    toast.success(
      `Notifications ${checked ? "activées" : "désactivées"} avec succès`
    );
  };

  const getInitials = () => {
    return user?.name ? user.name.substring(0, 2).toUpperCase() : "UN";
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Photo de profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} alt={user?.name || "Profil"} />
                <AvatarFallback className="text-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2">
                <Label
                  htmlFor="avatar-upload"
                  className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-medium text-lg">
                {user?.name || "Utilisateur"}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                Ajoutez une photo de profil pour personnaliser votre compte
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences de notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="font-medium">
                  Notifications par email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications par email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  handleNotificationChange("email", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="app-notifications" className="font-medium">
                  Notifications dans l'application
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications dans l'application
                </p>
              </div>
              <Switch
                id="app-notifications"
                checked={notifications.app}
                onCheckedChange={(checked) =>
                  handleNotificationChange("app", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quiz-notifications" className="font-medium">
                  Notifications de quiz
                </Label>
                <p className="text-sm text-muted-foreground">
                  Être notifié des nouveaux quiz disponibles
                </p>
              </div>
              <Switch
                id="quiz-notifications"
                checked={notifications.quiz}
                onCheckedChange={(checked) =>
                  handleNotificationChange("quiz", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="formation-notifications"
                  className="font-medium">
                  Notifications de formations
                </Label>
                <p className="text-sm text-muted-foreground">
                  Être notifié des nouvelles formations disponibles
                </p>
              </div>
              <Switch
                id="formation-notifications"
                checked={notifications.formations}
                onCheckedChange={(checked) =>
                  handleNotificationChange("formations", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
