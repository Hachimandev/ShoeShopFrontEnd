"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { ChatMessage } from "@/types/ai-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Lightbulb, Send, Trash2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export const AIChatBox = () => {
  const { messages, isLoading, sendMessage, clearChat, messagesEndRef } =
    useAIChat();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Get last order step from messages
  const getLastOrderStep = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const step = messages[i].metadata?.orderStep;
      if (step) {
        return step;
      }
    }
    return null;
  };

  const getPlaceholder = () => {
    const lastStep = getLastOrderStep();
    switch (lastStep) {
      case "ASKING_FOR_ADDRESS":
        return "Nhập địa chỉ và số điện thoại (ví dụ: Địa chỉ: 123 Đường ABC, SĐT: 0123456789)";
      case "ASKING_FOR_CONFIRMATION":
        return "Xác nhận đặt hàng (gõ: có/không)";
      default:
        return "Bạn muốn tìm giày như thế nào?";
    }
  };

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
    <div className="flex flex-col h-full max-h-[600px] bg-white rounded-lg border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-blue-600">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bot className="h-5 w-5" /> Trợ lý mua sắm AI
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="hover:bg-blue-400 text-white"
          title="Xóa cuộc trò chuyện"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-gray-500">
              <ShoppingCart className="mx-auto mb-2 h-10 w-10" />
              <p className="font-semibold">
                Chào mừng bạn đến với trợ lý mua sắm AI!
              </p>
              <p className="text-sm mt-2">
                Hãy nhắn để tìm giày, gợi ý sản phẩm hoặc hỗ trợ đặt hàng
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex gap-2 items-end">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholder()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <Lightbulb className="h-3 w-3" />
          <span>
            Thử: &quot;Tìm giày Nike dưới 500000&quot; hoặc &quot;Đặt đôi giày
            này&quot;
          </span>
        </p>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs px-4 py-2 rounded-lg",
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none",
        )}
      >
        <p className="text-sm">{message.content}</p>

        {/* Suggested Products */}
        {message.metadata?.suggestedProducts &&
          message.metadata.suggestedProducts.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold opacity-75">
                Sản phẩm gợi ý:
              </p>
              {message.metadata.suggestedProducts.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    "p-2 rounded text-xs",
                    isUser ? "bg-blue-400" : "bg-white border border-gray-200",
                  )}
                >
                  <p className="font-semibold">{product.name}</p>
                  <p className="opacity-75">${product.price}</p>
                  {product.relevanceScore && (
                    <p className="opacity-60">
                      Phù hợp: {(product.relevanceScore * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Order Created Notification */}
        {message.metadata?.orderCreated && (
          <div className="mt-3 p-2 bg-green-100 text-green-800 rounded text-xs">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <ShoppingCart className="w-3 h-3" />
              Đã tạo đơn hàng!
            </div>
            <p>Mã đơn: {message.metadata.orderCreated.orderId}</p>
            <p>
              Tổng tiền:{" "}
              {message.metadata.orderCreated.totalAmount.toLocaleString()} ₫
            </p>
            {message.metadata.orderCreated.orderLink && (
              <a
                href={message.metadata.orderCreated.orderLink}
                className="mt-2 inline-block text-blue-600 hover:text-blue-800 underline font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem chi tiết đơn hàng →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
