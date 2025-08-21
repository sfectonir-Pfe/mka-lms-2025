import { useState } from "react"
import { TOOLS } from "../constants"

export const useWhiteboardState = () => {
  const [tool, setTool] = useState(TOOLS.PEN)
  const [color, setColor] = useState("#1976d2")
  const [actions, setActions] = useState([])
  const [selectedElements, setSelectedElements] = useState([])
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  
  return {
    tool, setTool, color, setColor, actions, setActions,
    selectedElements, setSelectedElements, zoom, setZoom,
    panOffset, setPanOffset
  }
}


