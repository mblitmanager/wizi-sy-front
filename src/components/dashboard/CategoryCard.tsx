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

    const categoryImages: Record<string, string> = {
        bureautique: '/assets/splash1.jpeg',
        langues: '/assets/splash2.jpeg',
        internet: '/assets/splash3.jpeg',
        creation: '/assets/splash1.jpeg',
        IA: '/assets/splash2.jpeg',
    };

    const categoryImage = categoryImages[category.slug] ?? '/assets/splash1.jpeg';
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
            <Card className="group h-full flex flex-col overflow-hidden rounded-2xl border-[#d3e2de] bg-[#fbfaf6] transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-28 overflow-hidden">
                    <img
                        src={categoryImage}
                        alt={`Illustration de la formation ${category.name}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={cn('absolute inset-0 opacity-75 mix-blend-multiply', headerClass)} />
                    <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-white">
                        <span className="flex items-center gap-2 text-sm font-bold drop-shadow-sm">
                            {icon}
                            {category.name}
                        </span>
                        <span className={cn('text-xs font-semibold', isLight ? 'text-black/80' : 'text-white/85')}>
                            {count}
                        </span>
                    </div>
                </div>
                <CardHeader className={cn(headerClass, 'rounded-none px-4 py-3')}>
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-[0.12em]">Parcours de formation</CardTitle>
                    </div>
                    <CardDescription
                        className={cn('text-xs', isLight ? 'text-black/70' : 'text-white/75')}
                    >
                        {count} formation{count > 1 ? 's' : ''}
                    </CardDescription>
                </CardHeader>

                {/* flex-1 = toutes les cartes ont la même hauteur peu importe la description */}
                <CardContent className="flex-1 p-5">
                    <p className="text-sm leading-relaxed text-[#526b70]">{category.description}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#b47700]">
                        Explorer <span aria-hidden="true">→</span>
                    </span>
                </CardContent>
            </Card>
        </Link>
    );
}
