import React, { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { ComposeAnnouncement } from "@/components/announcements/ComposeAnnouncement";
import { AnnouncementHistory } from "@/components/announcements/AnnouncementHistory";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AnnouncementsPage = () => {
    const navigate = useNavigate();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSent = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-[#222] rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Announcements</h1>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Compose Section */}
                        <ComposeAnnouncement onSent={handleSent} />

                        {/* Recent History Section */}
                        <AnnouncementHistory refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};
