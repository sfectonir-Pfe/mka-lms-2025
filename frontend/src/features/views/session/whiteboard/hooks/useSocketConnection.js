import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { SOCKET_URL } from "../constants"

export const useSocketConnection = (validSeanceId, setActions) => {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!validSeanceId) {
      console.warn("No seanceId provided, skipping socket connection")
      return
    }

    const s = io(SOCKET_URL, { transports: ["websocket"] })
    setSocket(s)

    s.on("connect", () => console.log("✅ Socket.io connected"))
    s.on("connect_error", (err) => console.error("❌ Socket.io connection error:", err))
    s.emit("join-seance", validSeanceId)
    
    s.on("whiteboard-sync", (actions) => {
      setActions(actions || [])
    })
    
    s.on("whiteboard-action", (action) => {
      console.log(`📥 Received whiteboard-action:`, action)
      
      setActions(prev => {
        // Upsert by id when possible to avoid duplicates on moves/edits
        const actionId = action?.id
        if (!actionId) {
          console.log(`📝 No action ID, adding new action`)
          return [...prev, action]
        }
        
        const idx = prev.findIndex(a => a?.id === actionId)
        if (idx === -1) {
          console.log(`📝 Action ID not found, adding new action`)
          return [...prev, action]
        }
        
        console.log(`🔄 Updating existing action at index ${idx}`)
        const next = [...prev]
        next[idx] = action
        return next
      })
    })
    
    s.on("whiteboard-clear", () => {
      setActions([])
    })

    // Receive real-time deletions
    s.on("whiteboard-delete", (payload) => {
      const ids = payload?.ids || []
      if (!Array.isArray(ids) || ids.length === 0) return
      setActions(prev => prev.filter(action => !ids.includes(action?.id)))
    })

    return () => {
      s.disconnect()
    }
  }, [validSeanceId, setActions])

  return socket
}


