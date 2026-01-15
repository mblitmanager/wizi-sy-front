import React, { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { ComposeAnnouncement } from "@/components/announcements/ComposeAnnouncement";
import { AnnouncementHistory } from "@/components/announcements/AnnouncementHistory";
import AutoReminderMonitoring from "@/components/reminders/AutoReminderMonitoring";
import NotificationPanel from '@/components/formateur/NotificationPanel';
import EmailPanel from '@/components/formateur/EmailPanel';
import { ArrowLeft, Megaphone, BellRing, Bell, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/hooks/useAuth';

export const AnnouncementsPage = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const isAdmin = user?.role === 'admin';
    const isFormateur = user?.role === 'formateur' || user?.role === 'formatrice';

    const handleSent = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Layout>
            <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-[#222] rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Centre de Communication</h1>
                    </div>

                    <Tabs defaultValue="announcements" className="w-full">
                        <TabsList className="  border-[#333] mb-6 flex-wrap">
                            <TabsTrigger value="announcements" className="flex items-center gap-2 data-[state=active]:bg-[#fff]">
                                <Megaphone size={16} /> Notifications & Annonces
                            </TabsTrigger>
                            <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-[#fff]">
                                <Mail size={16} /> Emails
                            </TabsTrigger>
                            {isAdmin && (
                                <TabsTrigger value="reminders" className="flex items-center gap-2 data-[state=active]:bg-[#fff]">
                                    <BellRing size={16} /> Monitoring Auto-Rappels
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value="announcements" className="space-y-8 animate-in fade-in duration-500">
                            <div className="max-w-4xl">
                                <ComposeAnnouncement onSuccess={handleSent} />
                                <div className="mt-8">
                                    <AnnouncementHistory refreshTrigger={refreshTrigger} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="email" className="animate-in fade-in duration-500">
                            <div className="max-w-4xl">
                                <EmailPanel />
                            </div>
                        </TabsContent>

                        {isAdmin && (
                            <TabsContent value="reminders" className="animate-in fade-in duration-500">
                                <AutoReminderMonitoring />
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};

export default AnnouncementsPage;
