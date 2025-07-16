import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
// import { PiPathBold } from "react-icons/pi";
// import { TbListDetails } from "react-icons/tb";
// import { MdFeedback , FaBookOpen, FaFolderOpen} from "react-icons/md";
import { FaGraduationCap, FaBook, FaFileAlt } from "react-icons/fa"; // additional icons for clarity
import { BiBookBookmark, } from "react-icons/bi";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import SchoolIcon from "@mui/icons-material/School";
// import DesktopMacIcon from '@mui/icons-material/DesktopMac';



import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

export const sideBarData = [
  { text: "Home", icon: <MdSpaceDashboard />, path: "/" },
  { text: "Users", icon: <FaUsers />, path: "users" },
  { text: "Modules", icon: <BiBookBookmark />, path: "module", },
  { text: "Courses", icon: <FaBook />, path: "courses", },
  { text: "Contenus", icon: <FaFileAlt />, path: "contenus" },
  { 
  text: "Programs", 
  icon: <FaGraduationCap />, 
  path: "/programs",
  children: [
    { text: "Vue Programmes", icon: <LibraryBooksIcon />, path: "/programs/overview" }
  ]
},

  { text: "Sessions", icon: <CalendarMonthIcon />, path: "/sessions" },
//  {text: "Séances", icon: <DesktopMacIcon />, path: "/formateur/seances" },




  // { text: "Vue Programmes", icon: <LibraryBooksIcon />, path: "/programs/overview" }
  // { text: "Modules (Test)", icon: <FaBookOpen />, path: "/programs/1/modules" }, // temp path with test ID
  // { text: "Courses (Test)", icon: <FaFolderOpen />, path: "/modules/1/courses" }, // temp path with test ID
  // { text: "Contenus (Test)", icon: <FaFolderOpen />, path: "/courses/1/contenus" }, // temp path with test ID
  // { text: "Admin View", icon: <PiPathBold />, path: "programs" },
  // { text: "Feedback", icon: <MdFeedback />, path: "feedback" },
  // { text: "Student View", icon: <MdSpaceDashboard />, path: "student" }
// dropdown button
];
