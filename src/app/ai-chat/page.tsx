"use client";

import React from "react";
import { AIChatBox } from "@/components/ai-chat/ai-chat-box";
import { Bot, MessageCircle, Search, ShoppingCart } from "lucide-react";

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-2">
              <span className="inline-flex items-center gap-2">
                <Bot className="h-8 w-8 text-blue-600" />
                Trợ lý mua sắm AI
              </span>
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Tìm sản phẩm, nhận gợi ý và đặt hàng bằng tiếng Việt tự nhiên
            </p>
          </div>

          <AIChatBox />

          {/* Features List */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800/80 p-4 rounded-xl shadow-sm text-center">
              <Search className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-gray-800 dark:text-slate-200">Tìm kiếm thông minh</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Tìm giày bằng ngôn ngữ tự nhiên
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800/80 p-4 rounded-xl shadow-sm text-center">
              <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-gray-800 dark:text-slate-200">Hỗ trợ đặt hàng</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Tạo đơn nhanh từ sản phẩm phù hợp
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800/80 p-4 rounded-xl shadow-sm text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <h3 className="font-semibold text-gray-800 dark:text-slate-200">Tư vấn tức thì</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                Nhận câu trả lời và gợi ý ngay trong chat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
