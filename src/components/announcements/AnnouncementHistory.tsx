import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Announcement, AnnouncementService } from "@/services/AnnouncementService";
import { Users, Star, Clock, CheckCircle } from 'lucide-react';

export const AnnouncementHistory = ({ refreshTrigger }: { refreshTrigger?: number }) => {
    const [history, setHistory] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, [refreshTrigger]);

    const loadHistory = async () => {
        try {
            const data = await AnnouncementService.getHistory();
            setHistory(data.data as Announcement[]);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Recent History</h2>
                <button className="text-sm text-yellow-500 hover:text-yellow-400">View All</button>
            </div>

            <div className="space-y-3">
                {history.map((item) => (
                    <Card key={item.id} className="p-4 bg-[#1a1a1a] border-[#333] hover:bg-[#222] transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-white">{item.title}</h3>
                            <span className={`px-2 py-1 rounded text-[10px] font-medium border ${
                                item.status === 'sent' 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }`}>
                                {item.status === 'sent' ? (
                                    <span className="flex items-center gap-1"><CheckCircle size={10} /> SENT</span>
                                ) : (
                                    <span className="flex items-center gap-1"><Clock size={10} /> SCHEDULED</span>
                                )}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                            {item.message}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                {new Date(item.created_at).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </div>
                            <div className="flex items-center gap-1">
                                {item.target_audience === 'creators' ? <Star size={12} className="text-yellow-500" /> : <Users size={12} />}
                                <span className={item.target_audience === 'creators' ? 'text-yellow-500' : ''}>
                                    {item.target_audience === 'all' ? 'All Users' : 
                                     item.target_audience === 'creators' ? 'Creators Only' : 'Subscribers'}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
