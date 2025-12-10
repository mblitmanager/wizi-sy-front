import { useState, useEffect } from "react";

interface Achievement {
    id: number | string;
    name: string;
    description?: string;
    type?: string;
    level?: "bronze" | "argent" | "or" | "platine";
    unlockedAt?: string;
}

/**
 * Hook pour détecter les nouveaux badges débloqués aujourd'hui
 */
export function useNewBadges() {
    const [newBadges, setNewBadges] = useState<Achievement[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

    const checkForNewBadges = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/stagiaire/achievements`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) return;

            const badges: Achievement[] = await response.json();

            // Filtrer les badges débloqués aujourd'hui
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const newOnes = badges.filter((b) => {
                if (!b.unlockedAt) return false;
                const unlockedDate = new Date(b.unlockedAt);
                unlockedDate.setHours(0, 0, 0, 0);
                return unlockedDate.getTime() === today.getTime();
            });

            if (newOnes.length > 0) {
                setNewBadges(newOnes);
                setCurrentBadgeIndex(0);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Erreur vérification nouveaux badges:", error);
        }
    };

    const handleCloseModal = () => {
        if (currentBadgeIndex < newBadges.length - 1) {
            // Afficher le prochain badge
            setCurrentBadgeIndex((prev) => prev + 1);
        } else {
            // Fermer complètement
            setShowModal(false);
            setCurrentBadgeIndex(0);
        }
    };

    const currentBadge = newBadges[currentBadgeIndex];

    return {
        newBadges,
        currentBadge,
        showModal,
        setShowModal: handleCloseModal,
        checkForNewBadges,
    };
}
