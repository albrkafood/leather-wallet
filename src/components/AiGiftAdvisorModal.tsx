import React, { useState } from 'react';
import { HelpCircle, Sparkles, X, Send, Bot, User, ArrowRight } from 'lucide-react';

interface AiGiftAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProductByName: (productName: string) => void;
}

export const AiGiftAdvisorModal: React.FC<AiGiftAdvisorModalProps> = ({
  isOpen,
  onClose,
  onSelectProductByName
}) => {
  if (!isOpen) return null;

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content:
        "Assalam o Alaikum! I am your AI Leather Craftsman & Gift Advisor at LeatherCraft PK. Tell me who you are shopping for, your budget in PKR, or ask any question about full-grain leather care, hot-foil embossing, or delivery across Pakistan!"
    }
  ]);

  const suggestedQueries = [
    'Suggest a gift under Rs. 6,000 for my brother in Lahore',
    'Which wallet fits big PKR 5,000 note bundles easily?',
    'What is the difference between Italian Calfskin & Crazy Horse leather?',
    'Does RFID protection block Pakistani debit card theft?'
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMsg = text.trim();
    setInputQuery('');
    setChatHistory((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-gift-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: userMsg })
      });

      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', content: data.advice || 'Thank you for asking! The Sovereign Bifold (Rs. 5,499) with 24k Gold Monogram is our #1 rated gift choice in Pakistan.' }
      ]);
    } catch (err) {
      console.error('AI Advisor error:', err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'For a classic luxury gift in Pakistan, we highly recommend **The Sovereign Italian Bifold** (Rs. 5,499) or **The Obsidian Pop-Up Vault** (Rs. 3,499). Both feature genuine full-grain leather, dual PKR currency slots, and free hot-foil initial engraving!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-advisor-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-zinc-900 border border-amber-700/50 rounded-2xl max-w-2xl w-full text-amber-50 shadow-2xl overflow-hidden flex flex-col h-[80vh] my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-zinc-950 to-amber-950 p-4 border-b border-amber-800/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif font-extrabold text-lg text-amber-100 flex items-center gap-1.5">
                AI Leather & Gift Advisor
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h2>
              <p className="text-[10px] text-amber-300/80">Powered by Gemini AI • Leather Craftsman Assistant</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:text-amber-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Stream Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-300 shrink-0">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl space-y-2 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-600 text-zinc-950 font-semibold rounded-tr-none'
                    : 'bg-zinc-950 border border-amber-900/40 text-amber-100 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-amber-600 text-zinc-950 flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-center text-xs text-amber-400 animate-pulse bg-zinc-950 p-3 rounded-xl border border-amber-900/30 w-fit">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Consulting Master Artisan Knowledge Base...</span>
            </div>
          )}
        </div>

        {/* Suggested Queries Chips */}
        <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {suggestedQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="px-3 py-1 bg-zinc-900 hover:bg-amber-950/80 text-amber-200 border border-amber-800/30 rounded-full text-[10px] whitespace-nowrap transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-zinc-950 border-t border-amber-900/40 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about leather gift ideas, PKR notes fit, initial embossing..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-zinc-900 border border-amber-800/40 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
