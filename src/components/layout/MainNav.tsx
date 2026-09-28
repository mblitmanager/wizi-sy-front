import { useNavigation } from "@/hooks/useNavigation";
import { NavSection } from "@/components/navigation/NavSection";
import { LoadingNav } from "@/components/navigation/LoadingNav";

interface MainNavProps {
  showBottomNav?: boolean;
  onItemClick?: () => void;
}

export default function MainNav({ onItemClick }: MainNavProps) {
  const { items, isLoading } = useNavigation();

  if (isLoading) {
    return <LoadingNav />;
  }

  return (
    <nav aria-label="Navigation principale" className="space-y-5 px-3 py-4">
      {items.mainSections.map((section) => (
        <NavSection
          key={section.title}
          title={section.title}
          items={section.items}
          onItemClick={onItemClick}
        />
      ))}

      <NavSection title="Mon profil" items={items.profile} onItemClick={onItemClick} />

      <NavSection title="Aide & informations" items={items.help} onItemClick={onItemClick} collapsible />
    </nav>
  );
}
