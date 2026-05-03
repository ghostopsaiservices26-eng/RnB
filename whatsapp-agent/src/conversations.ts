import Anthropic from "@anthropic-ai/sdk";

interface Conversation {
  messages: Anthropic.MessageParam[];
  lastActive: number;
}

// In-memory store. Replace with Redis/DB for multi-instance deployments.
const store = new Map<string, Conversation>();
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_MESSAGES = 30; // ~15 turns

export function getHistory(phone: string): Anthropic.MessageParam[] {
  const conv = store.get(phone);
  if (!conv || Date.now() - conv.lastActive > TTL_MS) return [];
  return conv.messages;
}

export function addTurn(
  phone: string,
  userMessage: string,
  assistantMessage: string
): void {
  const conv = store.get(phone) ?? { messages: [], lastActive: 0 };

  conv.messages.push(
    { role: "user", content: userMessage },
    { role: "assistant", content: assistantMessage }
  );
  conv.lastActive = Date.now();

  // Trim oldest turns while keeping an even number (user+assistant pairs)
  if (conv.messages.length > MAX_MESSAGES) {
    conv.messages = conv.messages.slice(conv.messages.length - MAX_MESSAGES);
  }

  store.set(phone, conv);
}

// Deduplicate WhatsApp message IDs (WhatsApp can redeliver the same webhook)
const processedIds = new Set<string>();
export function markSeen(messageId: string): boolean {
  if (processedIds.has(messageId)) return false;
  processedIds.add(messageId);
  // Prevent unbounded growth
  if (processedIds.size > 5000) {
    const first = processedIds.values().next().value;
    if (first) processedIds.delete(first);
  }
  return true;
}
