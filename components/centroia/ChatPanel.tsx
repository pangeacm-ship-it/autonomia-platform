"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface CompanyContext {
  name?: string;
  sector?: string;
  tone?: string;
  mainServices?: string;
  targetAudience?: string;
  city?: string;
}

interface Props {
  messages: Message[];
  quickPrompts: string[];
  companyContext?: CompanyContext;
}

export default function ChatPanel({ messages: initialMessages, quickPrompts, companyContext }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", text: text.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    const assistantMessage: Message = { role: "assistant", text: "" };
    setMessages([...updatedMessages, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.text,
          })),
          companyContext,
        }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({ error: "Error del servidor." })) as { error?: string };
        setMessages([
          ...updatedMessages,
          { role: "assistant", text: errorData.error ?? "Error al contactar con la IA." },
        ]);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        setMessages([
          ...updatedMessages,
          { role: "assistant", text: accumulated },
        ]);
      }
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "assistant", text: "No se pudo conectar con la IA. Inténtalo de nuevo." },
      ]);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleQuickPrompt(prompt: string) {
    void sendMessage(prompt);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
      <div className="border-b border-white/10 bg-[#0b1024] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">Asistente AutonomIA</h2>
            <p className="mt-1 text-sm text-slate-400">
              Marketing · Redes Sociales · Ventas · Reseñas · Reservas
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-black ${
              isStreaming
                ? "bg-amber-500/20 text-amber-300"
                : "bg-emerald-500/20 text-emerald-300"
            }`}
          >
            {isStreaming ? "Respondiendo..." : "Online"}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-6" style={{ maxHeight: "480px" }}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[92%] rounded-3xl p-4 sm:max-w-[80%] sm:p-5 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-violet-600"
                  : "border border-white/10 bg-[#0b1024]"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-7">
                {message.text}
                {isStreaming &&
                  index === messages.length - 1 &&
                  message.role === "assistant" && (
                    <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded-sm bg-violet-400" />
                  )}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/10 bg-[#0b1024] p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {quickPrompts.slice(0, 4).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleQuickPrompt(prompt)}
              disabled={isStreaming}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe aquí tu petición..."
            disabled={isStreaming}
            className="flex-1 rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 outline-none placeholder:text-slate-600 focus:border-violet-400 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
