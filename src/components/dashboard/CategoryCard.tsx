import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Category } from '@/types';
import { cn } from '@/lib/utils';
import { FileText, Globe, MessageSquare, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
    category: Category;
}

const FORMATION_COUNTS: Record<string, number> = {
    bureautique: 12,
    creation: 6,
    internet: 3,
    langues: 2,
    IA: 2,
};

export function CategoryCard({ category }: CategoryCardProps) {
    const icons = {
        'file-text': <FileText className="h-5 w-5" />,
        'message-square': <MessageSquare className="h-5 w-5" />,
        globe: <Globe className="h-5 w-5" />,
        'pen-tool': <PenTool className="h-5 w-5" />,
    };

    const icon = icons[category.icon as keyof typeof icons] || <FileText className="h-5 w-5" />;

    const count = FORMATION_COUNTS[category.slug] ?? category.formations?.length ?? 0;
    const isLight = category.slug === 'internet';

    const headerClass = cn(
        'rounded-t-xl',
        isLight ? 'text-black' : 'text-white',
        category.slug === 'bureautique' && 'bg-bureautique',
        category.slug === 'langues' && 'bg-langues',
        category.slug === 'internet' && 'bg-internet',
        category.slug === 'creation' && 'bg-creation',
        category.slug === 'IA' && 'bg-ia'
    );

    return (
        <Link to={`/catalogue/${category.slug}`} className="block h-full">
            <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                <CardHeader className={headerClass}>
                    <div className="flex items-center gap-2">
                        {icon}
                        <CardTitle className="text-base font-medium">{category.name}</CardTitle>
                    </div>
                    <CardDescription
                        className={cn('text-sm', isLight ? 'text-black/70' : 'text-white/75')}
                    >
                        {count} formation{count > 1 ? 's' : ''}
                    </CardDescription>
                </CardHeader>

                {/* flex-1 = toutes les cartes ont la même hauteur peu importe la description */}
                <CardContent className="flex-1 p-4">
                    <p className="text-sm text-gray-500 leading-relaxed">{category.description}</p>
                </CardContent>
            </Card>
        </Link>
    );
}
