import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, PhoneCall, ShieldCheck, User } from 'lucide-react';

export const ChatModal: React.FC = () => {
  const { activeChatBooking, closeChat, chatMessages, sendChatMessage, customer, role, lang, t } =
    useApp();
  const [inputText, setInputText] = useState('');

  if (!activeChatBooking) return null;

  const b = activeChatBooking;
  const messages = chatMessages[b.id] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const senderRole = role === 'provider' ? 'provider' : 'customer';
    const senderName = role === 'provider' ? (b.assignedProviderName || 'Pro') : customer.name;

    sendChatMessage(b.id, inputText.trim(), senderRole, senderName);
    setInputText('');

    // Optional simulated provider/customer response after 1s
    if (role === 'customer') {
      setTimeout(() => {
        sendChatMessage(
          b.id,
          lang === 'hi'
            ? 'जी बिल्कुल, मैं रास्ते में हूँ। 5-10 मिनट में पहुँच रहा हूँ।'
            : 'Got it! I am just nearby and will be there in 5-10 minutes.',
          'provider',
          b.assignedProviderName || 'Pro'
        );
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[520px]">
        
        {/* Chat Header */}
        <div className="p-4 bg-blue-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  b.assignedProviderAvatar ||
                  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80'
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-blue-900" />
            </div>

            <div>
              <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                <span>{b.assignedProviderName || 'Ghar Seva Pro'}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </h4>
              <p className="text-[11px] text-blue-200">
                Booking #{b.id} · {b.serviceNameEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${b.assignedProviderPhone || '+919876543210'}`}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <button
              onClick={closeChat}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-800/40">
          <div className="text-center my-2">
            <span className="text-[10px] text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              {lang === 'hi' ? 'सुरक्षित अंत-से-अंत संचार' : 'Safe & Encrypted Conversation'}
            </span>
          </div>

          {messages.map((m) => {
            const isMe =
              (role === 'customer' && m.senderRole === 'customer') ||
              (role === 'provider' && m.senderRole === 'provider');

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 mb-0.5 px-1">
                  {m.senderName} · {m.timestamp}
                </span>
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {m.message}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              lang === 'hi' ? 'संदेश लिखें...' : 'Type a message to professional...'
            }
            className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
