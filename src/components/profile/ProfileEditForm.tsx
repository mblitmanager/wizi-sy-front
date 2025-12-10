import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, X, User, Phone, MapPin, Mail } from "lucide-react";

interface ProfileData {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
    ville: string;
    code_postal: string;
    adresse: string;
}

interface ProfileEditFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ProfileEditForm({ onSuccess, onCancel }: ProfileEditFormProps) {
    const [formData, setFormData] = useState<ProfileData>({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        ville: '',
        code_postal: '',
        adresse: '',
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch current profile
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setFetching(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stagiaires/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Erreur lors du chargement du profil');

            const data = await response.json();
            setFormData({
                prenom: data.prenom || '',
                nom: data.nom || '',
                email: data.email || '',
                telephone: data.telephone || '',
                ville: data.ville || '',
                code_postal: data.code_postal || '',
                adresse: data.adresse || '',
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Impossible de charger le profil');
        } finally {
            setFetching(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.prenom.trim() || formData.prenom.length < 2) {
            newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
        }

        if (!formData.nom.trim() || formData.nom.length < 2) {
            newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
        }

        if (formData.telephone && !/^0[0-9]{9}$/.test(formData.telephone)) {
            newErrors.telephone = 'Le téléphone doit être au format 0XXXXXXXXX';
        }

        if (formData.code_postal && !/^[0-9]{5}$/.test(formData.code_postal)) {
            newErrors.code_postal = 'Le code postal doit contenir 5 chiffres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stagiaires/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prenom: formData.prenom,
                    nom: formData.nom,
                    telephone: formData.telephone || null,
                    ville: formData.ville || null,
                    code_postal: formData.code_postal || null,
                    adresse: formData.adresse || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const serverErrors: Record<string, string> = {};
                    Object.keys(data.errors).forEach(key => {
                        serverErrors[key] = data.errors[key][0];
                    });
                    setErrors(serverErrors);
                    throw new Error('Erreur de validation');
                }
                throw new Error(data.error || 'Erreur lors de la mise à jour');
            }

            setSuccess(true);
            setTimeout(() => {
                onSuccess?.();
            }, 1500);

        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: keyof ProfileData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    if (fetching) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Modifier mon profil
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Success message */}
                    {success && (
                        <Alert className="bg-green-50 text-green-800 border-green-200">
                            <AlertDescription>✅ Profil mis à jour avec succès !</AlertDescription>
                        </Alert>
                    )}

                    {/* Prénom */}
                    <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom *</Label>
                        <Input
                            id="prenom"
                            value={formData.prenom}
                            onChange={(e) => handleChange('prenom', e.target.value)}
                            placeholder="Votre prénom"
                            disabled={loading}
                            className={errors.prenom ? 'border-red-500' : ''}
                        />
                        {errors.prenom && <p className="text-sm text-red-500">{errors.prenom}</p>}
                    </div>

                    {/* Nom */}
                    <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                            id="nom"
                            value={formData.nom}
                            onChange={(e) => handleChange('nom', e.target.value)}
                            placeholder="Votre nom"
                            disabled={loading}
                            className={errors.nom ? 'border-red-500' : ''}
                        />
                        {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={formData.email}
                            disabled
                            className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">L'email ne peut pas être modifié</p>
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-2">
                        <Label htmlFor="telephone" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Téléphone
                        </Label>
                        <Input
                            id="telephone"
                            value={formData.telephone}
                            onChange={(e) => handleChange('telephone', e.target.value)}
                            placeholder="0612345678"
                            disabled={loading}
                            className={errors.telephone ? 'border-red-500' : ''}
                        />
                        {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
                    </div>

                    {/* Adresse */}
                    <div className="space-y-2">
                        <Label htmlFor="adresse" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Adresse
                        </Label>
                        <Input
                            id="adresse"
                            value={formData.adresse}
                            onChange={(e) => handleChange('adresse', e.target.value)}
                            placeholder="1 rue de la Paix"
                            disabled={loading}
                        />
                    </div>

                    {/* Code Postal et Ville */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code_postal">Code Postal</Label>
                            <Input
                                id="code_postal"
                                value={formData.code_postal}
                                onChange={(e) => handleChange('code_postal', e.target.value)}
                                placeholder="75001"
                                disabled={loading}
                                className={errors.code_postal ? 'border-red-500' : ''}
                            />
                            {errors.code_postal && <p className="text-sm text-red-500">{errors.code_postal}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ville">Ville</Label>
                            <Input
                                id="ville"
                                value={formData.ville}
                                onChange={(e) => handleChange('ville', e.target.value)}
                                placeholder="Paris"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Enregistrer
                                </>
                            )}
                        </Button>

                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Annuler
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
