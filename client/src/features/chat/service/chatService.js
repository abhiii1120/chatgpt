import { getAccessToken, httpClient } from "@/shared/service/httpClient";

export const chatService = {
  listConversations() {
    return httpClient.get("/chat/conversations");
  },
  getConversation(conversationId) {
    return httpClient.get(`/chat/conversations/${conversationId}`);
  },
  async sendMessageStream(
    message,
    conversationId,
    { onStart, onChunk, signal } = {},
  ) {
    const token = getAccessToken();
    const res = await fetch("/api/v1/chat/conversation", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        message,
        ...(conversationId ? { conversationId } : {}),
      }),
      signal,
    });

    if (!res.ok || !res.body) {
      let errorMessage = "Unable to send message";
      try {
        const data = await res.json();
        errorMessage = data?.message || errorMessage;
      } catch (error) {
        errorMessage = res.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const serverConversationId = res.headers.get("X-Conversation-Id");
    const title = decodeURIComponent(
      res.headers.get("X-Conversation-Title") || "New Chat",
    );
    onStart?.({ conversationId: serverConversationId, title });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let content = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        const line = event.trim();

        if (!line.startsWith("data:")) continue;

        const rawData = line.slice(5);

        if (!rawData || rawData === "[DONE]") {
          continue;
        }

        let text;

        try {
          text = JSON.parse(rawData);
        } catch {
          text = rawData;
        }

        content += text;
        onChunk?.(text);
      }
    }

    return { conversationId: serverConversationId, title, content };
  },
};
