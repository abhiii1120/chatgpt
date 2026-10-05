import { logout } from "@/features/auth/state/authThunk";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchConversation, fetchConversations, sendChatMessage } from "../state/sessionThunk";
import { createLocalSession, setActiveSession } from "../state/sessionSlice";

export let useChat = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const {
    sessions,
    activeSessionId,
    listStatus,
    detailStatus,
    sendStatus,
    error,
  } = useSelector((state) => state.chatSession);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const activeSession = useMemo(
    () => sessions.find((item) => item.id === activeSessionId) || null,
    [sessions, activeSessionId],
  );

  const createSession = (title = "New Chat") => {
    const session = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      messages: [],
      isLocal: true,
    };
    dispatch(createLocalSession(session));
    return session;
  };

  const setActive = (id) => {
    dispatch(setActiveSession(id));
    dispatch(fetchConversation(id));
  };

  const sendMessage = (message) =>
    dispatch(
      sendChatMessage({
        message,
        conversationId: activeSession?.isLocal ? undefined : activeSession?.id,
        localSessionId: activeSession?.isLocal ? activeSession.id : undefined,
      }),
    ).unwrap();

  return {
    handleLogout,
    activeSession,
    activeSessionId,
    listStatus,
    sendStatus,
    activeSessionStatus : activeSessionId ? detailStatus[activeSessionId]:null,
    error,
    createSession,
    setActive,
    sendMessage,
    sessions
  };
};
