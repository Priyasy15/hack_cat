import React, { useState } from 'react';
import { Sparkles, Send, Mic, MicOff, User, Bot, X, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { api } from '../api';

interface InCabAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorId: string;
  machineId: string;
}

const DEFAULT_PROMPTS = [
  "Why did I get this alert?",
  "Why is my task taking longer?",
  "What is my safety score?",
  "How much have I idled today?"
];

export const InCabAiModal: React.FC<InCabAiModalProps> = ({
  isOpen,
  onClose,
  operatorId,
  machineId
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: `CAT Smart Operator AI Co-Pilot active for ${operatorId} on ${machineId}. I am connected directly to your machine LiDAR and engine sensors. How can I assist?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quick_actions: ["Why did I get this alert?", "Why is my task taking longer?", "What is my safety score?"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(text, operatorId, machineId);
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
      console.error('Failed to send chat', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMicSim = () => {
    setMicActive(true);
    setTimeout(() => {
      setMicActive(false);
      handleSend("Why did I get this alert?");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-nordic-card border border-nordic-border rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-nordic-border flex items-center justify-between bg-nordic-base">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ice-blue flex items-center justify-center text-nordic-base font-black shadow-ice-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-industrial text-white tracking-wide uppercase">
                In-Cab AI Assistant (Operator Co-Pilot)
              </h2>
              <p className="text-xs text-nordic-muted font-mono">
                Zero Cloud Delay • Grounded in Live Telemetry & Scikit-Learn Models
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-nordic-card text-nordic-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-nordic-base/60 border-b border-nordic-border flex items-center gap-2 overflow-x-auto no-scrollbar">
          {DEFAULT_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="touch-btn shrink-0 bg-nordic-card hover:bg-nordic-card-hover border border-nordic-border text-xs px-3 py-1.5 rounded-full text-nordic-text font-mono"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 max-h-[380px]">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-ice-blue text-nordic-base font-bold' : 'bg-nordic-base border border-nordic-border text-ice-blue'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  isUser ? 'bg-ice-blue text-nordic-base font-bold font-sans' : 'bg-nordic-base border border-nordic-border text-nordic-text'
                }`}>
                  <p>{m.text}</p>

                  {m.quick_actions && !isUser && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-nordic-border">
                      {m.quick_actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleSend(act)}
                          className="bg-nordic-card hover:bg-nordic-card-hover text-ice-blue border border-ice-blue/30 text-[10px] px-2 py-1 rounded font-mono"
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
        </div>

        {/* Footer Input */}
        <div className="p-4 border-t border-nordic-border bg-nordic-base flex items-center gap-2">
          <button
            onClick={handleMicSim}
            className={`p-3 rounded-lg border ${
              micActive ? 'bg-coral-red text-white border-coral-red animate-pulse' : 'bg-nordic-card text-nordic-muted border-nordic-border hover:text-white'
            }`}
            title="Simulate In-Cab Radio Voice Input"
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Co-Pilot (e.g., 'Why did I get this alert?')..."
            className="flex-1 bg-nordic-card text-white text-xs px-4 py-3 rounded-lg border border-nordic-border focus:border-ice-blue focus:outline-none"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="touch-btn bg-ice-blue hover:bg-ice-blue-light disabled:opacity-40 text-nordic-base font-black text-xs px-5 py-3 shadow-ice-glow"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
