import { createSlice } from "@reduxjs/toolkit";
import {
  fetchConversation,
  fetchConversations,
  sendChatMessage,
} from "./sessionThunk";

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
          updatedAt: aiMessage.createdAt,
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
    streamFinished(state, action) {
      const { aiMessageId } = action.payload;

      for (const session of state.sessions) {
        const aiMessage = session.messages?.find(
          (message) => message.id === aiMessageId,
        );

        if (aiMessage) {
          aiMessage.isStreaming = false;
          break;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        ((state.listStatus = "loading"), (state.error = null));
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        const localSessions = state.sessions.filter((item) => item.isLocal);
        const serverSessions = action.payload.map((conversation) => {
          const cached = state.sessions.find(
            (item) => item.id === conversation.id,
          );
          return cached?.messages
            ? { ...conversation, messages: cached.messages }
            : conversation;
        });
        state.sessions = [...localSessions, ...serverSessions];
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.listStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchConversation.pending, (state, action) => {
        state.detailStatus[action.meta.arg] = "loading";
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.detailStatus[action.payload.id] = "succeeded";
        const index = state.sessions.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index >= 0) {
          state.sessions[index] = action.payload;
        } else {
          state.sessions.unshift(action.payload);
        }
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.detailStatus[action.meta.arg] = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.sendStatus = "loading";
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state) => {
        state.sendStatus = "succeeded";
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.sendStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setSessions,
  createLocalSession,
  setActiveSession,
  streamStarted,
  streamChunkAppended,
  clearSessions,
  streamFinished,
} = sessionSlice.actions;

export default sessionSlice.reducer;
