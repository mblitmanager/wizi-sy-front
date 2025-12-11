import { NavLink } from "react-router-dom";
import { NavItem } from "@/config/navigation/stagiaire";

interface NavSectionProps {
    title: string;
    items: NavItem[];
    onItemClick?: () => void;
}

export function NavSection({ title, items, onItemClick }: NavSectionProps) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-1">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {title}
            </h3>
            {items.map((item) => (
                <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onItemClick}
                    className={({ isActive }) =>
                        `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border-l-4 ${isActive
                            ? "bg-yellow-50 border-yellow-500 text-yellow-700 font-semibold shadow-sm"
                            : "border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <div
                                className={`p-2 rounded-lg ${isActive ? "bg-yellow-100" : "bg-gray-100"
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 ${isActive ? "text-yellow-600" : item.color
                                        }`}
                                />
                            </div>
                            <span className="text-sm">{item.title}</span>
                            {isActive && (
                                <div className="ml-auto w-2 h-2 bg-yellow-500 rounded-full" />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </div>
    );
}
