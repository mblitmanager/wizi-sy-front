export type Achievement = {
  id: number;
  name: string;
  type: string;
  description?: string | null;
  icon?: string | null;
  level?: string | null;
  quiz_id?: number | null;
  code?: string | null;
  unlockedAt?: string | null;
};

export type CheckAchievementsParams = {
  code?: string;
  quizId?: number;
};

export const achievementsService = {
  async checkAchievements(params: CheckAchievementsParams = {}): Promise<Achievement[]> {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const resp = await fetch(`/api/stagiaire/achievements/check`, {
      method: "POST",
      headers,
      body: JSON.stringify({ code: params.code, quiz_id: params.quizId }),
    });
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const data = await resp.json();
    const list = (data?.new_achievements ?? data?.newAchievements ?? []) as Achievement[];
    return Array.isArray(list) ? list : [];
  },
};
