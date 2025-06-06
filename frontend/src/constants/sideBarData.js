import { MdSpaceDashboard, MdEventAvailable } from "react-icons/md";
import { FaUsers, FaGraduationCap, FaBook, FaFileAlt } from "react-icons/fa";
import { BiBookBookmark } from "react-icons/bi";
import { AiOutlineSchedule } from "react-icons/ai";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const sideBarData = [
  { text: "Home", icon: <MdSpaceDashboard />, path: "/" },
  { text: "Users", icon: <FaUsers />, path: "users" },
  { text: "Programs", icon: <FaGraduationCap />, path: "/programs" },
  { text: "Modules", icon: <BiBookBookmark />, path: "module" },
  { text: "Courses", icon: <FaBook />, path: "courses" },
  { text: "Contenus", icon: <FaFileAlt />, path: "contenus" },
  { text: "Sessions", icon: <AiOutlineSchedule />, path: "sessions" },
  { text: "Vue Sessions", icon: <CalendarMonthIcon />, path: "/sessions/overview" },
  { text: "Séance", icon: <MdEventAvailable />, path: "/seancePage" }
];
