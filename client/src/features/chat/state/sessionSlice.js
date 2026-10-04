import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  activeSessionId: null, //which conversation is open right now
  sessions: [], // conversation objects - metadata and messages once loaded
  listStatus: "idle", // status of fetchConversations
  detailStatus: {}, // per-conversation-id status map for fetchConversations
  sendStatus: "idle", // status of sendChatMessage
  error: null,
};

const sessionSlice = createSlice({
  name: "chatSession",
  initialState,
  reducers: {
    setSessions(state, action) {
      state.sessions = action.payload;
    },
    createLocalSession(state, action) {
      state.sessions.unshift(action.payload);
      state.activeSessionId = action.payload.id;
    },
    setActiveSession(state, action) {
      state.activeSessionId = action.payload;
    },
    streamStarted(state, action) {
      const { conversationId, localSessionId, title, userMessage, aiMessage } =
        action.payload;
      const serverIndex = state.sessions.findIndex(
        (index) => index.id === conversationId,
      );
      const localIndex = localSessionId
        ? state.sessions.findIndex((index) => index.id === localSessionId)
        : -1;

      if (serverIndex >= 0) {
        state.sessions[serverIndex].messages = [
          ...(state.sessions[serverIndex].messages || []),
          userMessage,
          aiMessage,
        ];
        state.sessions[serverIndex].updatedAt = aiMessage.createdAt;
      } else {
        const conversation = {
          id: conversationId,
          title,
          createdAt: userMessage.createdAt,
          updatedAt: aiMessage.updatedAt,
          messages: [userMessage, aiMessage],
        };
        if (localIndex >= 0) {
          state.sessions[localIndex] = conversation;
        } else {
          state.sessions.unshift(conversation);
        }
      }

      state.activeSessionId = conversationId;
      state.detailStatus[conversationId] = "succeeded";
    },
    streamChunkAppended(state, action) {
      const { aiMessageId, text } = action.payload;
      const session = state.sessions.find(
        (item) => item.id === state.activeSessionId,
      );
      const aiMessage = session?.messages?.find(
        (item) => item.id === aiMessageId,
      );
      if (aiMessage) {
        aiMessage.content += text;
      }
    },
    clearSessions() {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // builder
  },
});

export const {
  setSessions,
  createLocalSession,
  setActiveSession,
  streamStarted,
  streamChunkAppended,
  clearSessions,
} = sessionSlice.actions;

export default sessionSlice.reducer;
