import React from 'react';
import { Layout } from '@/components/layout/Layout';
import NotificationPanel from '@/components/formateur/NotificationPanel';
import EmailPanel from '@/components/formateur/EmailPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail } from 'lucide-react';

export function FormateurCommunicationsPage() {
    return (
        <Layout>
            <div className="container mx-auto py-6 px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Communications
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Envoyez des notifications et emails à vos stagiaires
                    </p>
                </div>

                <Tabs defaultValue="notifications" className="space-y-4">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Notifications FCM
                        </TabsTrigger>
                        <TabsTrigger value="emails" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Emails
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="notifications">
                        <NotificationPanel />
                    </TabsContent>

                    <TabsContent value="emails">
                        <EmailPanel />
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
}

export default FormateurCommunicationsPage;
