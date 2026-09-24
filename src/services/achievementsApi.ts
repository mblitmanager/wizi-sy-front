import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export interface UnlockedAchievement {
  id?: number | string;
  name?: string;
  titre?: string;
  title?: string;
}

/** Demande au backend de recalculer les succès du stagiaire (optionnellement pour un code précis). */
export async function checkAchievements(code?: string): Promise<UnlockedAchievement[]> {
  const res = await api.post("/stagiaire/achievements/check", code ? { code } : {});
  const unlocked = res.data?.new_achievements;
  return Array.isArray(unlocked) ? unlocked : [];
}

export function announceAchievements(achievements: UnlockedAchievement[]) {
  achievements.forEach((ach) => {
    toast({
      title: "🎉 Succès débloqué",
      description: `${ach.name || ach.titre || ach.title || "Nouveau badge"} !`,
      duration: 4000,
      className: "bg-orange-600 text-white",
    });
  });
}

/** Vérifie et affiche les nouveaux succès. Ne lève jamais : c'est une action de confort. */
export async function checkAndAnnounceAchievements(code?: string): Promise<UnlockedAchievement[]> {
  try {
    const unlocked = await checkAchievements(code);
    announceAchievements(unlocked);
    return unlocked;
  } catch {
    return [];
  }
}
