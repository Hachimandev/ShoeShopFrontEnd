"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/ai-chat";
import { aiChatService } from "@/services/ai-chat.service";
import { toast } from "sonner";

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const newSessionId = await aiChatService.createChatSession();
        setSessionId(newSessionId);
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
        toast.error("Không thể khởi tạo phiên chat");
      }
    };

    initializeSession();
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  // Send message
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || !sessionId) {
        toast.error("Vui lòng nhập nội dung tin nhắn");
        return;
      }

      // Add user message to chat
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        // Call AI service
        const response = await aiChatService.sendMessage({
          message: userMessage,
          conversationHistory: messages,
          userId: sessionId,
        });

        // Add assistant message
        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
          metadata: {
            suggestedProducts: response.suggestedProducts,
            orderCreated: response.autoOrderCreated,
            actionTaken: response.actionPerformed,
          },
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Show notifications
        if (response.autoOrderCreated) {
          toast.success(
            `Đã tạo đơn hàng thành công! Mã đơn: ${response.autoOrderCreated.orderId}`,
          );
        }

        if (
          response.suggestedProducts &&
          response.suggestedProducts.length > 0
        ) {
          toast.info(
            `Tìm thấy ${response.suggestedProducts.length} sản phẩm phù hợp`,
          );
        }

        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Không gửi được tin nhắn. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, sessionId, scrollToBottom],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sessionId,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
};
