import api from "@/lib/api";
import {
  AIChatRequest,
  AIChatResponse,
  ChatMessage,
  SuggestedProduct,
} from "@/types/ai-chat";

export const aiChatService = {
  // Send message to AI agent
  sendMessage: async (request: AIChatRequest): Promise<AIChatResponse> => {
    try {
      const response = await api.post("/ai/chat", request);
      return response.data;
    } catch (error) {
      console.error("AI chat error:", error);
      throw error;
    }
  },

  // Search products via AI
  searchProducts: async (query: string): Promise<SuggestedProduct[]> => {
    try {
      const response = await api.post("/ai/search-products", { query });
      return response.data;
    } catch (error) {
      console.error("Product search error:", error);
      throw error;
    }
  },

  // Get chat history
  getChatHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    try {
      const response = await api.get(`/ai/chat-history/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Get chat history error:", error);
      throw error;
    }
  },

  // Create new chat session
  createChatSession: async (): Promise<string> => {
    try {
      const response = await api.post("/ai/chat-session", {});
      return response.data.sessionId;
    } catch (error) {
      console.error("Create chat session error:", error);
      throw error;
    }
  },
};
