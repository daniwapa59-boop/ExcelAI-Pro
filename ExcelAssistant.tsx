import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  Bot, 
  User, 
  Keyboard, 
  Compass, 
  RotateCcw 
} from 'lucide-react';
import { AssistantMessage } from '../types';

export const ExcelAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre copilote Excel. Décrivez-moi librement votre projet ou votre difficulté :\n\n• "Je veux consolider deux tableaux avec des colonnes différentes"\n• "Comment créer un Tableau Croisé Dynamique avec des tranches d\'âge ?"\n• "Je cherche à colorer en rouge les dates dépassées"\n• "Comment importer un fichier CSV avec des accents sans bug ?"',
      shortcuts: ['Ctrl + T : Créer un tableau structuré', 'F4 : Répéter la dernière action ou figer ($) une référence'],
      nextSteps: [
        'Comment faire un TCD ?',
        'Comment surligner les doublons ?',
        'Comment figer les volets ?'
      ],
      timestamp: Date.now()
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/freeform-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          history
        })
      });

      if (!res.ok) throw new Error('Erreur API');

      const data = await res.json();

      const assistantMsg: AssistantMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        suggestedFormulas: data.suggestedFormulas,
        shortcuts: data.shortcuts,
        nextSteps: data.nextSteps,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Désolé, une erreur temporaire est survenue. Veuillez reformuler votre demande ou choisir un exemple ci-dessous.',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Nouvelle conversation démarrée ! Que voulez-vous faire dans Excel aujourd\'hui ?',
        shortcuts: ['Alt + Entrée : Saut de ligne dans une cellule'],
        timestamp: Date.now()
      }
    ]);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[750px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              Espace Conseil & Projets Excel
            </h2>
            <p className="text-[11px] text-slate-500">
              Posez n'importe quelle question sur vos fichiers, tableaux et flux de travail
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="p-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition flex items-center gap-1"
          title="Effacer la conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Effacer</span>
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser ? 'bg-slate-800 text-white' : 'bg-emerald-700 text-white'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Suggested formulas */}
                {msg.suggestedFormulas && msg.suggestedFormulas.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Formule suggérée :
                    </span>
                    {msg.suggestedFormulas.map((f, i) => (
                      <code
                        key={i}
                        className="block font-mono text-xs bg-white text-emerald-900 p-2 rounded border border-slate-200 font-semibold"
                      >
                        {f}
                      </code>
                    ))}
                  </div>
                )}

                {/* Shortcuts */}
                {msg.shortcuts && msg.shortcuts.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                      <Keyboard className="w-3 h-3 text-emerald-600" />
                      Raccourci Excel utile :
                    </span>
                    <ul className="space-y-0.5 pl-1">
                      {msg.shortcuts.map((sc, i) => (
                        <li key={i} className="text-[11px] font-mono text-slate-600">
                          {sc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next suggested follow-ups */}
                {msg.nextSteps && msg.nextSteps.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                    {msg.nextSteps.map((step, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(step)}
                        className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2 py-0.5 rounded-md transition"
                      >
                        {step}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>ExcelAI Pro réfléchit à la meilleure solution...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex : Comment convertir une date texte '2026-03-15' en vraie date Excel ?"
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none bg-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white text-xs sm:text-sm font-semibold rounded-lg transition shrink-0 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};
