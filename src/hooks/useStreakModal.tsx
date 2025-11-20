import { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useStreakModal = (user: any, loginStreak: number) => {
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [hideStreakFor7Days, setHideStreakFor7Days] = useState(false);

  useEffect(() => {
    try {
      if (!user || !localStorage.getItem("token")) return;

      const hideUntil = localStorage.getItem("streakModalHideUntil");
      if (hideUntil) {
        const today = dayjs().tz("Europe/Paris");
        const hideDate = dayjs(hideUntil);
        if (today.isBefore(hideDate)) return;
      }

      const today = dayjs().tz("Europe/Paris").format("YYYY-MM-DD");
      const lastShown = localStorage.getItem("lastStreakModalDate");

      if (lastShown === today) return;

      if (typeof loginStreak === "number" && loginStreak > 0) {
        setShowStreakModal(true);
      }
    } catch (e) {
      // ignore errors
    }
  }, [user, loginStreak]);

  const closeStreakModal = () => {
    try {
      const today = dayjs().tz("Europe/Paris").format("YYYY-MM-DD");
      localStorage.setItem("lastStreakModalDate", today);

      if (hideStreakFor7Days) {
        const hideUntil = dayjs()
          .tz("Europe/Paris")
          .add(7, "day")
          .format("YYYY-MM-DD");
        localStorage.setItem("streakModalHideUntil", hideUntil);
      } else {
        localStorage.removeItem("streakModalHideUntil");
      }
    } catch (e) {
      // ignore errors
    }
    setShowStreakModal(false);
  };

  return {
    showStreakModal,
    hideStreakFor7Days,
    setHideStreakFor7Days,
    closeStreakModal,
  };
};
