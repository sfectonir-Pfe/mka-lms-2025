import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
// import { PiPathBold } from "react-icons/pi";
// import { TbListDetails } from "react-icons/tb";
import { MdFeedback } from "react-icons/md";
import { FaGraduationCap, FaBook, FaFileAlt } from "react-icons/fa"; // additional icons for clarity
import { BiBookBookmark, } from "react-icons/bi";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import SchoolIcon from "@mui/icons-material/School";
// import DesktopMacIcon from '@mui/icons-material/DesktopMac';



import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { getCurrentRole } from '../../pages/auth/token';

// Base sidebar items that all authenticated users can see
const baseSidebarItems = [
  { text: "sidebar.home", icon: <MdSpaceDashboard />, path: "/" },
];

// Role-specific sidebar items
const roleBasedItems = {
  admin: [
    { text: "sidebar.users", icon: <FaUsers />, path: "users" },
    { text: "sidebar.modules", icon: <BiBookBookmark />, path: "module" },
    { text: "sidebar.courses", icon: <FaBook />, path: "courses" },
    { text: "sidebar.contents", icon: <FaFileAlt />, path: "contenus" },
    { 
      text: "sidebar.programs", 
      icon: <FaGraduationCap />, 
      path: "/programs",
      children: [
        { text: "sidebar.programsOverview", icon: <LibraryBooksIcon />, path: "/programs/overview" }
      ]
    },
    { 
      text: "sidebar.sessions", 
      icon: <CalendarMonthIcon />, 
      path: "/sessions",
      children: [
        { text: "sidebar.assignableSessions", icon: <CalendarMonthIcon />, path: "/sessions/assignable" }
      ]
    },
    { text: "sidebar.Réclamation", icon: <MdFeedback />, path: "/Réclamation" },
    { text: "sidebar.RéclamationList", icon: <MdFeedback />, path: "/Réclamationlist" },
  ],
  
  createurdeformation: [
    { text: "sidebar.modules", icon: <BiBookBookmark />, path: "module" },
    { text: "sidebar.courses", icon: <FaBook />, path: "courses" },
    { text: "sidebar.contents", icon: <FaFileAlt />, path: "contenus" },
    { 
      text: "sidebar.programs", 
      icon: <FaGraduationCap />, 
      path: "/programs",
      children: [
        { text: "sidebar.programsOverview", icon: <LibraryBooksIcon />, path: "/programs/overview" }
      ]
    },
    { 
      text: "sidebar.sessions", 
      icon: <CalendarMonthIcon />, 
      path: "/sessions",
      children: [
        { text: "sidebar.assignableSessions", icon: <CalendarMonthIcon />, path: "/sessions/assignable" }
      ]
    },
    { text: "sidebar.Réclamation", icon: <MdFeedback />, path: "/Réclamation" },
    
  ],
  
  formateur: [
   
    { 
      text: "sidebar.sessions", 
      icon: <CalendarMonthIcon />, 
      path: "/sessions",
      children: [
        { text: "sidebar.assignableSessions", icon: <CalendarMonthIcon />, path: "/sessions/assignable" }
      ]
    },
    { text: "sidebar.Réclamation", icon: <MdFeedback />, path: "/Réclamation" },
  ],
  
  // apprenant: [
  //   { 
  //     text: "sidebar.programs", 
  //     icon: <FaGraduationCap />, 
  //     path: "/programs",
  //     children: [
  //       { text: "sidebar.programsOverview", icon: <LibraryBooksIcon />, path: "/programs/overview" }
  //     ]
  //   },
  //   { text: "sidebar.Réclamation", icon: <MdFeedback />, path: "/Réclamation" },
  // ],

  // 

  etudiant: [
    
    
    { 
      text: "sidebar.sessions", 
      icon: <CalendarMonthIcon />, 
      path: "/sessions",
      children: [
        { text: "sidebar.assignableSessions", icon: <CalendarMonthIcon />, path: "/sessions/assignable" }
      ]
    },
    { text: "sidebar.Réclamation", icon: <MdFeedback />, path: "/Réclamation" },
  ],

  etablissement: [
    { text: "sidebar.users", icon: <FaUsers />, path: "users" },
    { 
      text: "sidebar.sessions", 
      icon: <CalendarMonthIcon />, 
      path: "/sessions",
      children: [
        { text: "sidebar.assignableSessions", icon: <CalendarMonthIcon />, path: "/sessions/assignable" }
      ]
    },
    { text: "sidebar.Réclamation", icon: <MdFeedback />, path: "/Réclamation" },
  ],

  // institution: [
  //   { text: "sidebar.users", icon: <FaUsers />, path: "users" },
  //   { text: "sidebar.modules", icon: <BiBookBookmark />, path: "module" },
  //   { text: "sidebar.courses", icon: <FaBook />, path: "courses" },
  //   { 
  //     text: "sidebar.programs", 
  //     icon: <FaGraduationCap />, 
  //     path: "/programs",
  //     children: [
  //       { text: "sidebar.programsOverview", icon: <LibraryBooksIcon />, path: "/programs/overview" }
  //     ]
  //   },
  //   { 
  //     text: "sidebar.sessions", 
  //     icon: <CalendarMonthIcon />, 
  //     path: "/sessions",
  //     children: [
  //       { text: "sidebar.assignableSessions", icon: <CalendarMonthIcon />, path: "/sessions/assignable" }
  //     ]
  //   },
  //   { text: "sidebar.RéclamationList", icon: <MdFeedback />, path: "/Réclamationlist" },
  // ],
};

// Function to get sidebar data based on current user role
export function getSidebarData() {
  const currentRole = getCurrentRole();
  
  if (!currentRole) {
    return baseSidebarItems; // Return minimal items if no role
  }
  
  const normalizedRole = currentRole.toLowerCase();
  const roleItems = roleBasedItems[normalizedRole] || [];
  
  return [...baseSidebarItems, ...roleItems];
}

// Legacy export for backward compatibility (returns all items)
export const sideBarData = [
  { text: "sidebar.home", icon: <MdSpaceDashboard />, path: "/" },
  { text: "sidebar.users", icon: <FaUsers />, path: "users" },
  { text: "sidebar.modules", icon: <BiBookBookmark />, path: "module", },
  { text: "sidebar.courses", icon: <FaBook />, path: "courses", },
  { text: "sidebar.contents", icon: <FaFileAlt />, path: "contenus" },
  { 
  text: "sidebar.programs", 
  icon: <FaGraduationCap />, 
  path: "/programs",
  children: [
    { text: "sidebar.programsOverview", icon: <LibraryBooksIcon />, path: "/programs/overview" }
  ]
},
  { 
    text: "sidebar.sessions", 
    icon: <CalendarMonthIcon />, 
    path: "/sessions",
    children: [
      { text: "sidebar.assignableSessions", icon: <CalendarMonthIcon />, path: "/sessions/assignable" }
    ]
  },
  { text: "sidebar.Réclamation", icon: <MdFeedback />, path: "/Réclamation" },
  { text: "sidebar.RéclamationList", icon: <MdFeedback />, path: "/Réclamationlist" },
];
