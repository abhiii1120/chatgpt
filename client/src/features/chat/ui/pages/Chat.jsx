import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import IconPlus from '@/shared/ui/icons/IconPlus'
import IconUser from '@/shared/ui/icons/IconUser'
import IconLogout from '@/shared/ui/icons/IconLogout'
import IconChevron from '@/shared/ui/icons/IconChevron'
import IconMenu from '@/shared/ui/icons/IconMenu'
import IconSend from '@/shared/ui/icons/IconSend'
import { getInitials } from '@/shared/utils/utils'
// import { logout } from '../state/authThunk'


const initialChats = [
  { id: 1, title: 'Fixing auth refresh flow', time: '2m' },
  { id: 2, title: 'Sliding window question', time: '1h' },
  { id: 3, title: 'Socket.IO room setup', time: 'Yesterday' },
  { id: 4, title: 'Component structure ideas', time: '2d' },
]

const Chat = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [chats] = useState(initialChats)
  const [activeChatId, setActiveChatId] = useState(initialChats[0].id)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuRef = useRef(null)
  const textareaRef = useRef(null)
  const messagesEndRef = useRef(null)

  const activeChat = chats.find((c) => c.id === activeChatId)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleTextareaInput = (e) => {
    setDraft(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
  }

  const handleSend = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text }])
    setDraft('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleLogout = async () => {
    setMenuOpen(false)
    // await dispatch(logout())
    navigate('/')
  }

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
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-3">
          <button
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
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id)
                setSidebarOpen(false)
              }}
              className={`group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2
                text-left text-sm transition-colors
                ${
                  chat.id === activeChatId
                    ? 'bg-[#5EEAD4]/10 text-[#5EEAD4]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className="truncate">{chat.title}</span>
              <span className="shrink-0 text-xs text-white/30 group-hover:text-white/40">
                {chat.time}
              </span>
            </button>
          ))}
        </nav>

        {/* User menu */}
        <div className="relative border-t border-white/5 p-3" ref={menuRef}>
          {menuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-lg
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
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              bg-[#5EEAD4]/15 text-xs font-semibold text-[#5EEAD4]"
            >
              {getInitials(user?.name)}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium">
                {user?.name || 'Guest'}
              </span>
              <span className="block truncate text-xs text-white/40">
                {user?.email || 'Not signed in'}
              </span>
            </span>
            <IconChevron className="h-4 w-4 shrink-0 text-white/40" />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <button
            className="text-white/60 hover:text-white md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <IconMenu className="h-5 w-5" />
          </button>
          <h1 className="truncate text-sm font-medium text-white/90">
            {activeChat?.title || 'New chat'}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <h2 className="text-lg font-medium text-white/80">
                Start the conversation
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-white/40">
                Type a message below to begin. Your chats are saved on the left
                as you go.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
              {messages.map((m) => (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-[#5EEAD4]/10
                    px-4 py-2.5 text-sm leading-relaxed text-[#E7E7EA]"
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-white/5 px-4 py-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl
            border border-white/10 bg-[#22252C] px-3 py-2 focus-within:border-[#5EEAD4]/40"
          >
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message..."
              className="max-h-50 flex-1 resize-none bg-transparent py-1.5 text-sm
                text-[#E7E7EA] placeholder-white/30 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                bg-[#5EEAD4] text-[#12141A] transition-opacity disabled:opacity-30"
            >
              <IconSend className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat