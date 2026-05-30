"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChatMessage } from "@/types/ai-chat";
import { aiChatService } from "@/services/ai-chat.service";
import { customerService } from "@/services/customer.service";
import { toast } from "sonner";

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session and get customer ID
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const newSessionId = await aiChatService.createChatSession();
        setSessionId(newSessionId);

        // Get customer ID from localStorage
        const userStr = localStorage.getItem("user");
        const username = localStorage.getItem("username");
        
        let fetchedCustomerId = null;
        if (userStr) {
          const user = JSON.parse(userStr);
          fetchedCustomerId = user.customerId || user.id || null;
        }

        // Fallback if customerId is not in stored user object but username exists
        if (!fetchedCustomerId && username) {
          try {
            const customer = await customerService.getCustomer(username);
            if (customer && customer.customerId) {
              fetchedCustomerId = customer.customerId;
              // Update localStorage to cache it
              if (userStr) {
                const user = JSON.parse(userStr);
                user.customerId = customer.customerId;
                localStorage.setItem("user", JSON.stringify(user));
              }
            }
          } catch (e) {
            console.error("Failed to fetch customer by username in chat session:", e);
          }
        }

        setCustomerId(fetchedCustomerId);
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
        toast.error("Không thể khởi tạo phiên chat");
      }
    };

    initializeSession();
  }, []);

  // Listen for login/logout to update customerId
  useEffect(() => {
    const handleAuthChange = async () => {
      const userStr = localStorage.getItem("user");
      const username = localStorage.getItem("username");
      
      let fetchedCustomerId = null;
      if (userStr) {
        const user = JSON.parse(userStr);
        fetchedCustomerId = user.customerId || user.id || null;
      }

      if (!fetchedCustomerId && username) {
        try {
          const customer = await customerService.getCustomer(username);
          if (customer && customer.customerId) {
            fetchedCustomerId = customer.customerId;
            if (userStr) {
              const user = JSON.parse(userStr);
              user.customerId = customer.customerId;
              localStorage.setItem("user", JSON.stringify(user));
            }
          }
        } catch (e) {
          console.error("Failed to fetch customer in auth listener:", e);
        }
      }

      setCustomerId(fetchedCustomerId);
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
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
        // Call AI service with customer ID
        const response = await aiChatService.sendMessage({
          message: userMessage,
          conversationHistory: messages,
          userId: sessionId,
          customerId: customerId || undefined,
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
            orderStep: response.orderStep,
          },
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Show notifications based on order step
        if (response.orderStep === "ASKING_FOR_ADDRESS") {
          toast.info("Vui lòng cung cấp địa chỉ và số điện thoại");
        } else if (response.orderStep === "ASKING_FOR_CONFIRMATION") {
          toast.info("Vui lòng xác nhận đơn hàng");
        } else if (response.orderStep === "ORDER_CREATED") {
          toast.success(
            `Đã tạo đơn hàng thành công! Mã đơn: ${response.autoOrderCreated?.orderId}`,
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
    [messages, sessionId, customerId, scrollToBottom],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sessionId,
    customerId,
    sendMessage,
    clearChat,
    messagesEndRef,
  };
};
