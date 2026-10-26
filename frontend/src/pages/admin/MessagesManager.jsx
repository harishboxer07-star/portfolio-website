import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Trash2, 
  CheckCircle, 
  Clock, 
  MailOpen, 
  Search, 
  User, 
  X,
  MessageSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';

export const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, unread, read
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const { success, error } = useToast();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getMessages();
      setMessages(res.messages || []);
    } catch (err) {
      error(err.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await api.admin.toggleMessageRead(id, !currentStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: !currentStatus } : m))
      );
      success(!currentStatus ? "Marked as read." : "Marked as unread.");
    } catch (err) {
      error(err.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.admin.deleteMessage(id);
      success("Message deleted.");
      setDeleteConfirmId(null);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      error(err.message || "Failed to delete message.");
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filterType === 'unread' && m.is_read) return false;
    if (filterType === 'read' && !m.is_read) return false;

    const term = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term)
    );
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Messages <span className="gradient-text">Inbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Inquiries and correspondence sent through your public portfolio contact form.
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-950/70 text-rose-300 border border-rose-800/40">
            {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'unread', 'read'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filterType === type
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'glass-panel text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sender or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-violet-500/20 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/10 p-8">
          <MailOpen className="w-12 h-12 mx-auto text-slate-500 mb-3" />
          <div className="text-base font-semibold text-white">Inbox is empty</div>
          <p className="text-xs text-slate-400 mt-1">
            {messages.length === 0
              ? 'No messages have been submitted through the contact form yet.'
              : 'No messages match the chosen filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`glass-card p-6 rounded-2xl border transition-all ${
                msg.is_read
                  ? 'border-white/5 bg-slate-900/40 opacity-80'
                  : 'border-violet-500/30 bg-slate-900/75 shadow-lg shadow-violet-950/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      msg.is_read
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-gradient-to-tr from-brand-purple to-brand-cyan text-white shadow-md'
                    }`}
                  >
                    {msg.name ? msg.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{msg.name}</span>
                      {!msg.is_read && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          New
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-cyan-300 font-mono hover:underline"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center gap-1.5 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(msg.created_at).toLocaleDateString()} at{' '}
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(msg.id, msg.is_read)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel text-slate-300 hover:text-white transition-colors"
                  >
                    <MailOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{msg.is_read ? 'Mark as Unread' : 'Mark as Read'}</span>
                  </button>

                  <a
                    href={`mailto:${msg.email}?subject=Regarding your message on Harish Kumar's Portfolio`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel text-cyan-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                </div>

                {deleteConfirmId === msg.id ? (
                  <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-lg border border-rose-500/40">
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-300"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(msg.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
