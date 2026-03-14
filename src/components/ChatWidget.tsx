'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GREETING =
  'Hello! I\'m your clinic assistant. How can I help you today?';

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-show prompt bubble after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowPrompt(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setShowPrompt(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m.content !== GREETING)
            .map((m) => ({
              role: m.role,
              content: m.content,
            })),
        }),
      });

      const data = await res.json();

      if (res.ok && data.message) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.message },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Sorry, I\'m having trouble responding right now. Please contact the clinic for immediate help.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, something went wrong. Please contact the clinic for assistance.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Hide on admin/dashboard and registration pages
  const isHiddenPage = pathname.startsWith('/dashboard') || pathname.startsWith('/login') || pathname.startsWith('/register');
  if (isHiddenPage) return null;

  // Collapsed: chat bubble + prompt
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] no-print flex items-end gap-3">
        {showPrompt && (
          <div
            className="bg-card border border-line rounded-2xl shadow-xl px-4 py-3 max-w-[180px] sm:max-w-[220px] animate-fade-in-up cursor-pointer relative"
            onClick={() => setIsOpen(true)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setShowPrompt(false); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-card border border-line rounded-full flex items-center justify-center text-muted hover:text-heading transition-colors shadow-sm"
              aria-label="Dismiss"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <p className="text-sm font-semibold text-heading leading-snug">Need to book an appointment?</p>
            <p className="text-xs text-muted mt-1">Chat with us — we&apos;ll help you!</p>
          </div>
        )}
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center flex-shrink-0"
          aria-label="Open chat assistant"
          title="Chat with us"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    );
  }

  // Expanded: chat panel
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] no-print w-[min(340px,calc(100vw-32px))] sm:w-[400px] max-h-[min(600px,75vh)] bg-card rounded-2xl shadow-2xl border border-line flex flex-col overflow-hidden animate-chat-open">
      {/* Header */}
      <div className="px-4 py-3 bg-[var(--color-surface-deep)] text-[var(--color-text-on-deep)] flex items-center justify-between rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Clinic Assistant</p>
            <p className="text-[10px] opacity-70">Health Support</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-alt min-h-0" role="log" aria-live="polite" aria-label="Chat messages" style={{ maxHeight: 'calc(min(600px, 80vh) - 130px)', WebkitOverflowScrolling: 'touch' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-2xl rounded-br-sm'
                  : 'bg-card text-body border border-line rounded-2xl rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-line rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted chat-typing-dot" />
              <span className="w-2 h-2 rounded-full bg-muted chat-typing-dot" />
              <span className="w-2 h-2 rounded-full bg-muted chat-typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-line bg-card flex items-center gap-2 flex-shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          maxLength={500}
          aria-label="Type your question"
          className="flex-1 px-3 py-2.5 text-sm bg-surface-alt border border-line rounded-xl focus:border-primary-500 focus:ring-1 focus:ring-primary-200 focus:outline-none text-heading placeholder:text-faint"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Send message"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
