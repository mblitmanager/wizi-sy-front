import React, { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { ComposeAnnouncement } from "@/components/announcements/ComposeAnnouncement";
import { AnnouncementHistory } from "@/components/announcements/AnnouncementHistory";
import AutoReminderMonitoring from "@/components/reminders/AutoReminderMonitoring";
import { ArrowLeft, Megaphone, BellRing } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AnnouncementsPage = () => {
    const navigate = useNavigate();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSent = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-[#222] rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Communications & Rappels</h1>
                    </div>

                    <Tabs defaultValue="announcements" className="w-full">
                        <TabsList className="bg-[#1a1a1a] border-[#333] mb-6">
                            <TabsTrigger value="announcements" className="flex items-center gap-2 data-[state=active]:bg-[#333]">
                                <Megaphone size={16} /> Annonces
                            </TabsTrigger>
                            <TabsTrigger value="reminders" className="flex items-center gap-2 data-[state=active]:bg-[#333]">
                                <BellRing size={16} /> Monitoring Auto-Rappels
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="announcements" className="space-y-8 animate-in fade-in duration-500">
                            <div className="max-w-4xl">
                                <ComposeAnnouncement onSuccess={handleSent} />
                                <div className="mt-8">
                                    <AnnouncementHistory refreshTrigger={refreshTrigger} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="reminders" className="animate-in fade-in duration-500">
                            <AutoReminderMonitoring />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};

export default AnnouncementsPage;
