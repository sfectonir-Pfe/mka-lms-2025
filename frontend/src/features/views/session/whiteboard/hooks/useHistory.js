import { useState, useCallback } from "react"

export const useHistory = (actions) => {
  const [pastStates, setPastStates] = useState([])
  const [futureStates, setFutureStates] = useState([])
  
  const pushHistory = useCallback(() => {
    setPastStates(prev => [...prev, JSON.parse(JSON.stringify(actions))])
    setFutureStates([])
  }, [actions])
  
  const undo = useCallback(() => {
    if (pastStates.length === 0) return null
    const prev = pastStates[pastStates.length - 1]
    setPastStates(p => p.slice(0, -1))
    setFutureStates(f => [...f, JSON.parse(JSON.stringify(actions))])
    return prev
  }, [pastStates, actions])
  
  const redo = useCallback(() => {
    if (futureStates.length === 0) return null
    const next = futureStates[futureStates.length - 1]
    setFutureStates(f => f.slice(0, -1))
    setPastStates(p => [...p, JSON.parse(JSON.stringify(actions))])
    return next
  }, [futureStates, actions])
  
  return { pushHistory, undo, redo, pastStates, futureStates }
}


