import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category } from "@/types";
import { cn } from "@/lib/utils";
import { FileText, Globe, MessageSquare, PenTool } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const icons = {
    "file-text": <FileText className="h-5 w-5" />,
    "message-square": <MessageSquare className="h-5 w-5" />,
    globe: <Globe className="h-5 w-5" />,
    "pen-tool": <PenTool className="h-5 w-5" />,
  };

  const icon = icons[category.icon as keyof typeof icons] || (
    <FileText className="h-5 w-5" />
  );

  const totalFormations = category.formations?.length || 0;

  const headerTextClass = category.slug === "internet" ? "text-black" : "text-white";

  const headerClass = cn(
    headerTextClass,
    category.slug === "bureautique" && "bg-bureautique",
    category.slug === "langues" && "bg-langues",
    category.slug === "internet" && "bg-internet text-black",
    category.slug === "creation" && "bg-creation",
    category.slug === "IA" && "bg-ia"
  );

  return (
    <Link to={`/catalogue/${category.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className={headerClass}>
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle>{category.name}</CardTitle>
          </div>
<CardDescription className={cn(category.slug === "internet" ? "text-black/80" : "text-white/80")}>
  {category.slug === "bureautique"
  ? "12 formations"
  : category.slug === "creation"
  ? "6 formations"
  : category.slug === "internet"
  ? "3 formations"
  : category.slug === "langues"
  ? "2 formations"
  : category.slug === "IA"
  ? "2 formations"
  : `${totalFormations} formation${totalFormations > 1 ? "s" : ""}`}

</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-gray-600">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
