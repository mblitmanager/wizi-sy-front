import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Trophy,
    Flame,
    Medal,
    BrainCircuit,
    Star,
    Zap,
    Lock,
    CheckCircle,
} from "lucide-react";

interface Achievement {
    id: number | string;
    name: string;
    description?: string;
    type?: string;
    level?: "bronze" | "argent" | "or" | "platine";
    unlockedAt?: string;
}

interface BadgeUnlockModalProps {
    badge: Achievement;
    otherBadges?: Achievement[];
    isOpen: boolean;
    onClose: () => void;
    onViewAll?: () => void;
}

export function BadgeUnlockModal({
    badge,
    otherBadges,
    isOpen,
    onClose,
    onViewAll,
}: BadgeUnlockModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                {/* Container with gradient background */}
                <div className="relative bg-gradient-to-b from-amber-50 to-orange-50 p-6 animate-in fade-in-0 zoom-in-95 duration-300">
                    {/* Badge rond orange en haut (dépassant) - Animation scale */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 animate-in zoom-in-0 duration-500 delay-100">
                        <div className="w-20 h-20 rounded-full bg-amber-500 shadow-lg flex items-center justify-center animate-pulse">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Contenu du modal */}
                    <div className="mt-12 space-y-5">
                        {/* Titre - Animation slide from top */}
                        <h2 className="text-2xl font-bold text-orange-900 text-center animate-in slide-in-from-top-4 duration-500 delay-200">
                            Nouveau badge débloqué !
                        </h2>

                        {/* Message - Animation fade */}
                        <p className="text-orange-700 text-center text-sm animate-in fade-in-0 duration-500 delay-300">
                            Félicitations pour votre accomplissement !
                        </p>

                        {/* Badge débloqué card - Animation scale */}
                        <div className="bg-orange-50 rounded-lg p-4 space-y-3 animate-in zoom-in-95 duration-500 delay-400">
                            <BadgeCard badge={badge} />

                            {/* Badge "Nouveau" - Animation bounce */}
                            <div className="flex justify-center animate-in zoom-in-50 duration-500 delay-500">
                                <Badge className="bg-yellow-400 text-black hover:bg-yellow-400 font-semibold animate-bounce">
                                    Nouveau
                                </Badge>
                            </div>

                            {badge.description && (
                                <p className="text-sm text-orange-800 text-center mt-2 animate-in fade-in-0 duration-500 delay-600">
                                    {badge.description}
                                </p>
                            )}
                        </div>

                        {/* Section découverte autres badges - Animation slide from bottom */}
                        {otherBadges && otherBadges.length > 0 && (
                            <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-700">
                                <h3 className="text-base font-semibold text-orange-900 text-center">
                                    Découvrez d'autres badges
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {otherBadges.slice(0, 2).map((b, index) => (
                                        <div
                                            key={b.id}
                                            className="animate-in fade-in-0 zoom-in-95 duration-300"
                                            style={{ animationDelay: `${800 + index * 100}ms` }}
                                        >
                                            <BadgeCard badge={b} locked />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Boutons - Animation slide from bottom */}
                        <div className="flex gap-3 pt-2 animate-in slide-in-from-bottom-4 duration-500 delay-900">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 border-orange-300 text-orange-900 hover:bg-orange-50 transition-all hover:scale-105"
                            >
                                Continuer
                            </Button>
                            <Button
                                onClick={() => {
                                    onClose();
                                    onViewAll?.();
                                }}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white transition-all hover:scale-105"
                            >
                                <Trophy className="w-4 h-4 mr-2" />
                                Voir
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Composant BadgeCard pour afficher un badge
function BadgeCard({ badge, locked = false }: { badge: Achievement; locked?: boolean }) {
    const getBadgeIcon = (type?: string) => {
        const iconProps = {
            size: 24,
            className: locked ? "text-gray-400" : getIconColor(badge.level),
        };

        switch (type) {
            case "connexion_serie":
                return <Flame {...iconProps} />;
            case "points_total":
                return <Trophy {...iconProps} />;
            case "palier":
                return <Medal {...iconProps} />;
            case "quiz":
                return <BrainCircuit {...iconProps} />;
            case "premium":
                return <Star {...iconProps} />;
            case "challenge":
                return <Zap {...iconProps} />;
            case "exclusif":
                return <Lock {...iconProps} />;
            default:
                return <CheckCircle {...iconProps} />;
        }
    };

    const getIconColor = (level?: string) => {
        if (locked) return "text-gray-400";

        switch (level) {
            case "bronze":
                return "text-amber-600";
            case "argent":
                return "text-gray-600";
            case "or":
                return "text-orange-500";
            case "platine":
                return "text-blue-600";
            default:
                return "text-purple-600";
        }
    };

    const getBgColor = (level?: string) => {
        if (locked) return "bg-gray-100";

        switch (level) {
            case "bronze":
                return "bg-amber-100";
            case "argent":
                return "bg-gray-100";
            case "or":
                return "bg-orange-50";
            case "platine":
                return "bg-blue-100";
            default:
                return "bg-purple-100";
        }
    };

    const getLevelBadgeColor = (level?: string) => {
        switch (level) {
            case "bronze":
                return "bg-amber-100 text-amber-800";
            case "argent":
                return "bg-gray-100 text-gray-800";
            case "or":
                return "bg-orange-100 text-orange-800";
            case "platine":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-purple-100 text-purple-800";
        }
    };

    return (
        <div className="flex flex-col items-center p-3 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className={`w-12 h-12 rounded-full ${getBgColor(badge.level)} flex items-center justify-center mb-3`}>
                {getBadgeIcon(badge.type)}
            </div>
            <p className={`text-sm font-medium text-center line-clamp-2 ${locked ? "text-gray-400" : "text-gray-900"}`}>
                {badge.name}
            </p>
            {!locked && badge.level && (
                <Badge
                    variant="secondary"
                    className={`mt-2 text-xs font-semibold ${getLevelBadgeColor(badge.level)}`}
                >
                    {badge.level}
                </Badge>
            )}
        </div>
    );
}
