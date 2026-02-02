import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

const HRContact = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:5000/api/contact', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Contact Inbox</h1>
                    <p className="text-gray-400">View and manage inquiries.</p>
                </div>
                <div className="bg-surface px-4 py-2 rounded-lg border border-white/10 flex items-center">
                    <Mail className="text-primary mr-2" size={20} />
                    <span className="text-white font-bold">{messages.length}</span>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-white/10 overflow-hidden min-h-[400px]">
                <div className="p-6">
                    {loading ? (
                        <p className="text-gray-400 text-center py-10">Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p className="text-gray-400 text-center py-10">No messages found.</p>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg: any) => (
                                <div key={msg._id} className="bg-background p-4 rounded-lg border border-white/5 hover:border-primary/30 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{msg.subject || 'No Subject'}</h3>
                                            <div className="text-sm text-primary">{msg.name} &lt;{msg.email}&gt;</div>
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HRContact;
