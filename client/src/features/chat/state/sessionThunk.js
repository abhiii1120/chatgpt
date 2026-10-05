import { parseError } from "@/shared/utils/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { chatService } from "../service/chatService";
import {
  streamChunkAppended,
  streamStarted,
  streamFinished,
} from "./sessionSlice";

export const fetchConversations = createAsyncThunk(
  "chatSession/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await chatService.listConversations();
      return data.conversations;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  },
  {
    condition: (_, { getState }) =>
      getState().chatSession.listStatus !== "loading",
  },
);

export const fetchConversation = createAsyncThunk(
  "chatSession/fetchConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.getConversation(conversationId);
      return data.conversation;
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  },
  {
    condition: (conversationId, { getState }) => {
      const { sessions, detailStatus } = getState().chatSession;
      const conversation = sessions.find((item) => item.id === conversationId);
      return (
        conversation?.messages === undefined &&
        detailStatus[conversationId] !== "loading"
      );
    },
  },
);

export const sendChatMessage = createAsyncThunk(
  "chatSession/sendChatMessage",
  async (
    { message, conversationId, localSessionId },
    { dispatch, rejectWithValue },
  ) => {
    const userMessage = {
      id: crypto.randomUUID(),
      author: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };
    const aiMessageId = crypto.randomUUID();

    try {
      await chatService.sendMessageStream(message, conversationId, {
        onStart: ({ conversationId: serverConversationId, title }) => {
          if (!serverConversationId) {
            throw new Error("Conversation ID is missing from the response");
          }
          dispatch(
            streamStarted({
              conversationId: serverConversationId,
              localSessionId,
              title,
              userMessage,
              aiMessage: {
                id: aiMessageId,
                author: "ai",
                content: "",
                createdAt: new Date().toISOString(),
                isStreaming: true,
              },
            }),
          );
        },
        onChunk: (text) => {
          dispatch(streamChunkAppended({ aiMessageId, text: String(text) }));
        },
      });

      dispatch(
        streamFinished({
          aiMessageId,
        }),
      );
    } catch (error) {
      return rejectWithValue(parseError(error));
    }
  },
  {
    condition: (_, { getState }) =>
      getState().chatSession.sendStatus !== "loading",
  },
);
