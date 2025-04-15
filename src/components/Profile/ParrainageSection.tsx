import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Link as LinkIcon, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const API_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';

const ParrainageSection = () => {
  const [parrainageLink, setParrainageLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateLink = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/stagiaire/parrainage/generate-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du lien');
      }

      const data = await response.json();
      setParrainageLink(data.link);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien de parrainage",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(parrainageLink);
    toast({
      title: "Succès",
      description: "Lien copié dans le presse-papiers",
    });
  };

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4 font-montserrat">Programme de parrainage</h2>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">Invitez vos amis</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Partagez votre lien de parrainage et gagnez des points à chaque fois qu'un ami s'inscrit et commence à apprendre !
          </p>

          <div className="space-y-4">
            <Button 
              onClick={generateLink} 
              disabled={isLoading}
              className="w-full"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              {isLoading ? 'Génération...' : 'Générer mon lien de parrainage'}
            </Button>

            {parrainageLink && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={parrainageLink}
                  readOnly
                  aria-label="Lien de parrainage"
                  className="flex-1 p-2 border rounded-md bg-gray-50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  aria-label="Copier le lien"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ParrainageSection; 