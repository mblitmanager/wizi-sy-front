import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Star, UserCheck, Calendar, Send } from 'lucide-react';
import { toast } from "sonner";
import { AnnouncementService } from "@/services/AnnouncementService";

export const ComposeAnnouncement = ({ onSent }: { onSent?: () => void }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState<'all' | 'creators' | 'subscribers'>('all');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!title || !message) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await AnnouncementService.sendAnnouncement({
                title,
                message,
                target_audience: target,
                status: 'sent'
            });
            toast.success("Announcement sent successfully!");
            setTitle('');
            setMessage('');
            setTarget('all');
            if (onSent) onSent();
        } catch (error) {
            console.error(error);
            toast.error("Failed to send announcement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Compose New</h2>
                <span className="text-xs text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                    Draft Saved
                </span>
            </div>

            <Card className="p-6 bg-[#1a1a1a] border-[#333] space-y-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Subject Line</label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Platform Maintenance Window"
                        className="bg-[#111] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-yellow-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Message Content</label>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message here..."
                        className="min-h-[150px] bg-[#111] border-[#333] text-white placeholder:text-gray-600 focus-visible:ring-yellow-500 resize-none"
                    />
                    <div className="text-right text-xs text-gray-600">
                        {message.length}/500
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm text-gray-400">Target Audience</label>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setTarget('all')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${target === 'all'
                                    ? 'bg-yellow-500 text-black font-semibold'
                                    : 'bg-[#111] text-gray-400 border border-[#333] hover:border-gray-500'
                                }`}
                        >
                            <Users size={16} /> All Users
                        </button>
                        <button
                            onClick={() => setTarget('creators')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${target === 'creators'
                                    ? 'bg-yellow-500 text-black font-semibold'
                                    : 'bg-[#111] text-gray-400 border border-[#333] hover:border-gray-500'
                                }`}
                        >
                            <Star size={16} /> Creators
                        </button>
                        <button
                            onClick={() => setTarget('subscribers')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${target === 'subscribers'
                                    ? 'bg-yellow-500 text-black font-semibold'
                                    : 'bg-[#111] text-gray-400 border border-[#333] hover:border-gray-500'
                                }`}
                        >
                            <UserCheck size={16} /> Subscribers
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 pt-2">
                    <Button
                        variant="outline"
                        className="flex-1 bg-transparent border-[#333] text-yellow-500 hover:bg-[#222] hover:text-yellow-400"
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule
                    </Button>
                    <Button
                        onClick={handleSend}
                        disabled={loading}
                        className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400 font-semibold"
                    >
                        {loading ? 'Sending...' : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Now
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
};
