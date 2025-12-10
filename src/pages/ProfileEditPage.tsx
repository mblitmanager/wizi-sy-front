import { ProfileEditForm } from '@/components/profile/ProfileEditForm';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProfileEditPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Back button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>

                {/* Form */}
                <ProfileEditForm
                    onSuccess={() => {
                        // Redirect to dashboard or profile page
                        navigate('/dashboard');
                    }}
                    onCancel={() => {
                        navigate(-1);
                    }}
                />
            </div>
        </div>
    );
}
