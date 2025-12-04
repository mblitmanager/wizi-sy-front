import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const EmailSenderSkeleton: React.FC = () => (
    <Card className="border-orange-200 shadow-lg bg-gradient-to-br from-white to-orange-50/30 animate-pulse">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-t-lg h-16" />
        <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-10 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-10 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-28" />
                <div className="h-32 bg-gray-200 rounded" />
            </div>
            <div className="h-12 bg-gray-300 rounded" />
        </CardContent>
    </Card>
);

export const NotificationSenderSkeleton: React.FC = () => (
    <Card className="border-yellow-200 shadow-lg bg-gradient-to-br from-white to-yellow-50/30 mt-6 animate-pulse">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-t-lg h-16" />
        <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-10 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48" />
                <div className="h-32 bg-gray-200 rounded" />
            </div>
            <div className="h-12 bg-gray-300 rounded" />
        </CardContent>
    </Card>
);

export const StatsDashboardSkeleton: React.FC = () => (
    <div className="mt-6 space-y-4 animate-pulse">
        <Card className="border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-t-lg h-20" />
            <CardContent className="p-4 space-y-3">
                <div className="flex gap-3">
                    <div className="h-10 bg-gray-200 rounded w-40" />
                    <div className="h-10 bg-gray-200 rounded w-56" />
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
                <Card key={i} className="border-orange-200 shadow-lg">
                    <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                        <div className="h-8 bg-gray-300 rounded w-32" />
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card className="border-orange-200 shadow-lg">
            <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
                <div className="h-64 bg-gray-200 rounded" />
            </CardContent>
        </Card>
    </div>
);

export const OnlineUsersListSkeleton: React.FC = () => (
    <Card className="border-orange-200 shadow-lg bg-gradient-to-br from-white to-orange-50/20 mt-6 animate-pulse">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-t-lg h-16" />
        <CardContent className="p-4 space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-32" />
                            <div className="h-3 bg-gray-200 rounded w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);
