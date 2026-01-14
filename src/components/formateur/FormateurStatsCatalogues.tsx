import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List, Archive } from 'lucide-react';
import { api } from '@/lib/api';

interface CatalogueStat {
  id: number;
  title: string;
  formations_count?: number;
  stagiaires_count?: number;
}

export function FormateurStatsCatalogues() {
  const [catalogues, setCatalogues] = useState<CatalogueStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const res = await api.get('/formateur/dashboard/catalogues');
        if (!mounted) return;
        setCatalogues(res.data?.catalogues || res.data || []);
      } catch (e) {
        console.warn('FormateurStatsCatalogues: unable to load catalogues', e);
        if (mounted) setCatalogues([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Stats par Catalogue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  if (!catalogues || catalogues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Stats par Catalogue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Aucun catalogue disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          Stats par Catalogue ({catalogues.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {catalogues.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.formations_count ?? 0} formation(s)</div>
              </div>
              <div className="text-sm text-gray-700">{c.stagiaires_count ?? 0} stagiaire(s)</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default FormateurStatsCatalogues;
