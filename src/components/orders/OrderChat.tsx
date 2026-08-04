"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface OrderMessage {
  id: string;
  message: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

interface OrderChatProps {
  orderId: string;
  currentUserId: string;
  isAdmin: boolean;
}

export function OrderChat({ orderId, currentUserId, isAdmin }: OrderChatProps) {
  const [messages, setMessages] = useState<OrderMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`);
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...messages, data.message]);
        setNewMessage("");
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card className="clay-card border-none bg-white dark:bg-slate-950 flex flex-col h-[500px]">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Order Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-2">
            <MessageSquare className="w-8 h-8 opacity-20" />
            <p className="text-sm">No messages yet.</p>
            <p className="text-xs">Start the conversation if you have an issue.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user.id === currentUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-baseline gap-2 mb-1 px-1">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {msg.user.name} {msg.user.role === "ADMIN" && <span className="text-blue-500">(Admin)</span>}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {format(new Date(msg.createdAt), "h:mm a")}
                  </span>
                </div>
                <div 
                  className={`px-4 py-2 rounded-2xl max-w-[85%] text-sm ${
                    isMe 
                      ? "bg-slate-900 text-white dark:bg-slate-700 dark:text-white rounded-tr-sm" 
                      : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-tl-sm"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </CardContent>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
        <form onSubmit={sendMessage} className="relative flex items-end gap-2">
          <Textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="min-h-[60px] max-h-[120px] resize-y bg-slate-50 dark:bg-slate-900 border-none focus-visible:ring-1 pr-12 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isSending || !newMessage.trim()}
            className="absolute bottom-2 right-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 h-8 w-8"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </Card>
  );
}
