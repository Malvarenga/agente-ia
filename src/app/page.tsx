'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatVentas() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(-20) }),
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`La solicitud falló con el estado ${response.status}`);
      }

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: responseText || 'No recibí una respuesta. Inténtalo nuevamente.',
        },
      ]);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '⚠️ Hubo un error al procesar tu solicitud.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-50">
      <header className="py-4 border-b border-gray-200 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Asistente de ventas</h1>
        <p className="text-sm text-gray-500">
          Te ayudo a encontrar productos del catálogo según tu presupuesto y disponibilidad.
        </p>
      </header>

      <div
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2"
        aria-live="polite"
        aria-label="Conversación"
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            Pregúntame por laptops, monitores o accesorios. También puedo filtrar por marca,
            presupuesto y disponibilidad.
          </div>
        )}

        {messages.map((m, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-sm ${
              m.role === 'user'
                ? 'bg-blue-600 text-white ml-auto max-w-[80%]'
                : 'bg-white text-gray-800 border border-gray-200 mr-auto max-w-[90%]'
            }`}
          >
            <span className="font-semibold block mb-1">
              {m.role === 'user' ? 'Tú' : 'Agente'}
            </span>
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
        {isLoading && <p className="text-sm text-gray-500">Buscando en el catálogo...</p>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej.: ¿Tienes una laptop Dell por menos de $700?"
          aria-label="Escribe tu consulta sobre productos"
          maxLength={2000}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isLoading ? 'Pensando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}