import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  Clock,
  Mic,
  MicOff,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage } from '../types';
import { api } from '../api';

interface AiAssistantPanelProps {
  operatorId: string;
  machineId: string;
}

const DEFAULT_SUGGESTIONS = [
  "How much have I idled today?",
  "What is my safety score?",
  "When is next maintenance?",
  "What are my high risk tasks?",
  "Who is leading the leaderboard?"
];

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({ operatorId, machineId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `OperatorOS Cab Assistant online for ${operatorId}. I have direct telemetry link to your ${machineId}. How can I assist your shift?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'SYSTEM',
      quick_actions: ["How much have I idled?", "What is my safety score?", "When is next maintenance?"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(queryText, operatorId, machineId);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: res.category,
        quick_actions: res.quick_actions
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Failed to get chat response', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateMic = () => {
    setMicActive(true);
    setTimeout(() => {
      setMicActive(false);
      handleSend("How much have I idled today?");
    }, 1500);
  };

  return (
    <div className="bg-cab-card border border-cab-border rounded-xl p-4 sm:p-5 shadow-lg flex flex-col h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-cab-border">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cat-yellow" />
          <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
            In-Cab AI Co-Pilot
          </h2>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/30">
          NLP Engine Grounded to Live Telemetry
        </span>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
        {DEFAULT_SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="touch-btn shrink-0 bg-cab-dark hover:bg-cab-black border border-cab-border text-gray-200 text-xs px-3 py-1.5 font-medium rounded-full"
          >
            <span>{s}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2 max-h-[360px]">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isUser ? 'bg-cat-yellow text-cab-black font-bold' : 'bg-cab-dark border border-cab-border text-cat-yellow'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cat-yellow text-cab-black font-bold'
                    : 'bg-cab-dark border border-cab-border text-gray-200'
                }`}
              >
                {m.category && !isUser && (
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono opacity-75 border-b border-white/10 pb-1">
                    <span className="uppercase font-bold tracking-wider">{m.category}</span>
                    <span>{m.timestamp}</span>
                  </div>
                )}
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Follow-up Quick Action Chips */}
                {m.quick_actions && m.quick_actions.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-white/10">
                    {m.quick_actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(act)}
                        className="bg-cab-black/40 hover:bg-cab-black text-[10px] px-2 py-1 rounded text-cat-yellow border border-cat-yellow/30 font-medium"
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-cat-yellow font-mono italic p-2">
            <span className="animate-spin">⚙️</span>
            <span>Querying machine telemetry database...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box & Voice Trigger */}
      <div className="pt-2 border-t border-cab-border flex items-center gap-2">
        <button
          onClick={handleSimulateMic}
          className={`p-3 rounded-lg border flex items-center justify-center ${
            micActive
              ? 'bg-red-600 text-white border-red-500 animate-pulse'
              : 'bg-cab-dark hover:bg-cab-black text-gray-300 border-cab-border'
          }`}
          title="Simulate In-Cab Radio Voice Command"
        >
          {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-gray-400" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Co-Pilot (e.g. 'How much have I idled?')..."
          className="flex-1 bg-cab-dark text-white text-xs px-3.5 py-3 rounded-lg border border-cab-border focus:border-cat-yellow focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="touch-btn bg-cat-yellow hover:bg-cat-yellow-hover disabled:opacity-40 text-cab-black font-black text-xs px-4 py-3 shadow-cat-glow"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </div>
    </div>
  );
};
