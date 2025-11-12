import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetOverlay, SheetPortal } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Wrench, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const sampleQuestions = [
  "Why is quality down?",
  "Show lineage for Sales History",
  "Explain recent anomalies",
  "What's the impact of this fix?",
];

const botResponses: Record<string, string> = {
  default: "I'm SynqAI, your data steward. I can explain anomalies, show lineage, or apply fixes. How can I help you today?",
  quality: "Quality metrics dropped 3% due to missing product_id values in Sales History. The AutoFix panel has a high-confidence solution (94%) to auto-map using SKU lookups.",
  lineage: "Sales History entity is sourced from Oracle ERP → transformed via 'enrich_sales' job → feeds into Demand Forecasting and Inventory Optimization modules. Last refresh: 2 hours ago.",
  anomalies: "Recent anomalies detected: 342 null values in Sales History (product_id), 23 duplicate emails in Customer Master, and 12 invalid category codes in Product Master. AutoFix suggestions are ready for review.",
  impact: "Applying the suggested fix will resolve 94% of missing product_id issues and improve overall data quality by ~4.2%. This fix is reversible and will be logged in the version history.",
};

export const SynqAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi! I'm SynqAI, your data steward. I can explain anomalies, show lineage, or apply fixes.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      let responseText = botResponses.default;
      
      if (messageText.toLowerCase().includes("quality") || messageText.toLowerCase().includes("down")) {
        responseText = botResponses.quality;
      } else if (messageText.toLowerCase().includes("lineage")) {
        responseText = botResponses.lineage;
      } else if (messageText.toLowerCase().includes("anomal")) {
        responseText = botResponses.anomalies;
      } else if (messageText.toLowerCase().includes("impact") || messageText.toLowerCase().includes("fix")) {
        responseText = botResponses.impact;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow hover:shadow-elevated transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 z-50"
        size="icon"
      >
        <Sparkles className="w-6 h-6" />
      </Button>

      {/* Chat Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetPortal>
          <SheetOverlay className="bg-black/60 backdrop-blur-sm" />
          <SheetContent side="right" className="w-full sm:w-[480px] flex flex-col p-0">
            <SheetHeader className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-lg">SynqAI</SheetTitle>
                <p className="text-xs text-muted-foreground">Your Data Steward</p>
              </div>
              <Badge variant="secondary" className="ml-auto bg-success/10 text-success">
                Online
              </Badge>
            </div>
          </SheetHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                        : "bg-muted border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Sample Questions */}
          {messages.length <= 1 && (
            <div className="px-6 py-3 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(question)}
                    className="h-7 text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-6 py-3 border-t border-border bg-muted/30">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9"
                onClick={() => handleSendMessage("Apply AutoFix")}
              >
                <Wrench className="w-4 h-4 mr-1" />
                Apply AutoFix
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9"
                onClick={() => handleSendMessage("View Lineage")}
              >
                <GitBranch className="w-4 h-4 mr-1" />
                View Lineage
              </Button>
            </div>
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about anomalies, lineage, or fixes…"
                className="flex-1 h-11"
              />
              <Button
                onClick={() => handleSendMessage()}
                size="icon"
                className="h-11 w-11"
                disabled={!inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>
    </>
  );
};
