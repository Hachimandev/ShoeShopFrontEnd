"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { ChatMessage } from "@/types/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Lightbulb, Send, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const AIChatBox = () => {
  const { messages, isLoading, sendMessage, clearChat, messagesEndRef } =
    useAIChat();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage(input);
        setInput("");
      }
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col h-[600px] bg-white/90 backdrop-blur-md rounded-[2.25rem] border border-slate-100/80 shadow-2xl shadow-primary/5 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-gradient-to-r from-primary to-indigo-650">
        <h2 className="text-base font-black text-white flex items-center gap-2.5 tracking-tight">
          <div className="bg-white/10 p-1.5 rounded-xl">
            <Bot className="h-5 w-5" />
          </div>
          <span>AI SHOPPING ASSISTANT</span>
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearChat}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl h-9 w-9 transition-colors"
          title="Xóa cuộc trò chuyện"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto">
            <div className="bg-primary/5 p-5 rounded-3xl mb-4 text-primary animate-pulse">
              <ShoppingCart className="h-10 w-10" />
            </div>
            <p className="font-black text-lg text-slate-800 tracking-tight">Trò chuyện với AI</p>
            <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
              Nhập yêu cầu bằng tiếng Việt tự nhiên để tìm giày, nhận gợi ý size hoặc tự động tạo đơn hàng của bạn.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex gap-2 items-center">
            <div className="bg-slate-100 border border-slate-200/50 rounded-2xl rounded-tl-none px-4.5 py-3">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-100 p-4.5 bg-slate-50/50 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="flex gap-2.5">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bạn muốn tìm giày thế nào? (vd: Nike dưới $150)"
            disabled={isLoading}
            className="flex-1 h-12 px-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-medium"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-12 w-12 rounded-2xl bg-primary text-white shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-transform shrink-0 p-0"
          >
            <Send className="w-4.5 h-4.5" />
          </Button>
        </form>
        <div className="text-[10px] text-slate-400 mt-2.5 flex items-center gap-1.5 font-semibold tracking-wide uppercase px-1">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10" />
          <span>
            Gợi ý: &quot;Tìm giày Adidas màu đen&quot; hoặc &quot;Tạo đơn hàng này&quot;
          </span>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] px-4.5 py-3.5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed transition-all duration-300",
          isUser
            ? "bg-gradient-to-br from-primary to-indigo-600 text-white rounded-tr-none shadow-md shadow-primary/5"
            : "bg-slate-100 border border-slate-200/40 text-slate-800 rounded-tl-none",
        )}
      >
        <p>{message.content}</p>

        {/* Suggested Products */}
        {message.metadata?.suggestedProducts &&
          message.metadata.suggestedProducts.length > 0 && (
            <div className="mt-4.5 space-y-3 pt-3 border-t border-slate-200/50">
              <p className="text-[10px] font-black uppercase tracking-wider opacity-80 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-500/15" />
                <span>Gợi ý tốt nhất cho bạn:</span>
              </p>
              <div className="grid gap-2.5">
                {message.metadata.suggestedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={cn(
                      "p-3 rounded-xl transition-all duration-200 flex flex-col gap-1 shadow-sm border",
                      isUser
                        ? "bg-white/10 hover:bg-white/15 border-white/10 text-white"
                        : "bg-white hover:shadow-md border-slate-100 text-slate-800",
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-bold text-xs line-clamp-1">{product.name}</p>
                      <span className="font-black text-xs shrink-0">${product.price}</span>
                    </div>
                    {product.relevanceScore && (
                      <div className="flex items-center gap-1 mt-1 text-[9px] font-black uppercase tracking-wider opacity-75">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Độ phù hợp: {(product.relevanceScore * 100).toFixed(0)}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Order Created Notification */}
        {message.metadata?.orderCreated && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 font-black uppercase tracking-wider text-emerald-700 mb-1.5">
              <div className="bg-emerald-500 text-white p-1 rounded-lg">
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
              <span>Đơn hàng đã được tạo!</span>
            </div>
            <div className="space-y-1 text-[11px] font-medium text-emerald-600">
              <p>Mã đơn hàng: <strong className="font-bold text-emerald-800">{message.metadata.orderCreated.orderId}</strong></p>
              <p>Tổng thanh toán: <strong className="font-bold text-emerald-800">{message.metadata.orderCreated.totalAmount}</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
