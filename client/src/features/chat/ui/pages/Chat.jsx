import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import IconPlus from "@/shared/ui/icons/IconPlus";
import IconUser from "@/shared/ui/icons/IconUser";
import IconLogout from "@/shared/ui/icons/IconLogout";
import IconChevron from "@/shared/ui/icons/IconChevron";
import IconMenu from "@/shared/ui/icons/IconMenu";
import IconSend from "@/shared/ui/icons/IconSend";
import { getInitials } from "@/shared/utils/utils";
import { useChat } from "../../hooks/useChat";
import MessageContent from "../component/MessageContent"

function BrandMark() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#5EEAD4]/20">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5 text-[#5EEAD4]"
      >
        <path
          d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const initialChats = [
  { id: 1, title: "Fixing auth refresh flow", time: "2m" },
  { id: 2, title: "Sliding window question", time: "1h" },
  { id: 3, title: "Socket.IO room setup", time: "Yesterday" },
  { id: 4, title: "Component structure ideas", time: "2d" },
];

const Chat = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    handleLogout,
    activeSession,
    activeSessionId,
    activeSessionStatus,
    createSession,
    error,
    listStatus,
    sendMessage,
    sendStatus,
    sessions,
    setActive,
  } = useChat();

  const activeMessages = activeSession?.messages;
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = message.trim();
    if (!content || sendStatus === "loading") return;

    setMessage("");
    try {
      await sendMessage(content);
    } catch {
      setMessage(content);
    }
  };

  const sortedSessions = useMemo(() =>
    [...sessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  );

  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id);
  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="flex h-screen w-full bg-[#1B1E24] text-[#E7E7EA]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-30 flex h-full w-72 flex-col border-r border-white/5 bg-[#15171C]
          transition-transform duration-200 md:static md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-2 px-3 pb-1 pt-3">
          <BrandMark />
          <span className="text-sm font-medium tracking-tight text-white/90">
            Cove
          </span>
        </div>

        <div className="p-3">
          <button
            onClick={() => createSession("Untitled chat")}
            className="flex w-full items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5
              text-sm font-medium text-[#E7E7EA] transition-colors hover:bg-white/5"
          >
            <IconPlus className="h-4 w-4" />
            New chat
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
          <p className="px-2 pb-1 pt-2 text-xs font-medium text-white/35">
            Recent
          </p>
          {listStatus === "loading" && (
            <p className="px-2 py-1 text-[13px] text-[#8E8E9E]">
              Loading conversations...
            </p>
          )}
          {sortedSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => {
                setActive(session.id);
              }}
              className={`group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2
                text-left text-sm transition-colors
                ${
                  session.id === activeSession?.id
                    ? "bg-[#5EEAD4]/10 text-[#5EEAD4]"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
            >
              <span className="truncate">{session.title}</span>
              {/* <span className="shrink-0 text-xs text-white/30 group-hover:text-white/40">
                {chat.time}
              </span> */}
            </button>
          ))}
          {listStatus !== "loading" && !sortedSessions.length && (
            <p className="px-2 py-1 text-[13px] text-[#8E8E9E]">No chats yet</p>
          )}
        </nav>

        {/* User menu */}
        <div className="relative border-t border-white/5 p-3">
          {menuOpen && (
            <div
              className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-lg
              border border-white/10 bg-[#1F222A] shadow-lg shadow-black/30"
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-white/80
                  transition-colors hover:bg-white/5"
              >
                <IconUser className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm text-white/80
                  transition-colors hover:bg-white/5"
              >
                <IconLogout className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 transition-colors
              hover:bg-white/5"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              bg-[#5EEAD4]/15 text-xs font-semibold text-[#5EEAD4]"
            >
              {getInitials(user?.name)}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium">
                {user?.name || "Guest"}
              </span>
              <span className="block truncate text-xs text-white/40">
                {user?.email || "Not signed in"}
              </span>
            </span>
            <IconChevron className="h-4 w-4 shrink-0 text-white/40" />
          </button>
        </div>
      </aside>

      {/* Main */}
      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <button
            type="button"
            className="text-white/60 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <IconMenu className="h-5 w-5" />
          </button>

          <h1 className="truncate text-sm font-medium text-white/90">
            {activeSession?.title || "New chat"}
          </h1>
        </header>

        {/* Messages */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeSessionStatus === "loading" ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-white/40">Loading messages...</p>
            </div>
          ) : !activeSession ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <BrandMark />

              <h2 className="mt-4 text-lg font-medium text-white/80">
                Start the conversation
              </h2>

              <p className="mt-1.5 max-w-sm text-sm text-white/40">
                Type a message below to begin. Your chats are saved on the left
                as you go.
              </p>
            </div>
          ) : activeSession.messages?.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <BrandMark />

              <h2 className="mt-4 text-lg font-medium text-white/80">
                Start the conversation
              </h2>

              <p className="mt-1.5 max-w-sm text-sm text-white/40">
                Type a message below to begin.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
          {activeSession.messages?.map((message) => (
            <div
              key={message.id}
              className={`mb-6 flex ${
                message.author === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.author === "user" ? (
                <div className="max-w-[75%] rounded-3xl bg-[#303030] px-4 py-2.5">
                  <MessageContent message={message} />
                </div>
              ) : (
                <div className="w-full">
                  {message.content ? (
                    <MessageContent message={message} />
                  ) : (
                    sendStatus === "loading" && (
                      <p className="text-[15px] text-[#8E8E9E]">
                        Thinking...
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          ))}

              <div ref={messagesEndRef} />
            </div>
          )}

          {error && (
            <div className="mx-auto max-w-3xl px-4 pb-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-white/5 px-4 py-4">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl
        border border-white/10 bg-[#22252C] px-3 py-2
        focus-within:border-[#5EEAD4]/40"
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={1}
              placeholder="Message..."
              disabled={sendStatus === "loading"}
              className="max-h-50 flex-1 resize-none bg-transparent py-1.5 text-sm
    text-[#E7E7EA] placeholder-white/30 outline-none
    disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!message.trim() || sendStatus === "loading"}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
          bg-[#5EEAD4] text-[#12141A] transition-opacity
          disabled:cursor-not-allowed disabled:opacity-30"
            >
              <IconSend className="h-4 w-4" />
            </button>
          </form>

          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-white/30">
            Cove can make mistakes. Check important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
