import React from 'react'
import { useSelector } from 'react-redux'

const Chat = () => {
  const {user} = useSelector((state) => state.auth);
  return (
    <div>Chat
      <p>{user?.name || "hehe"}</p>
    </div>
  )
}

export default Chat