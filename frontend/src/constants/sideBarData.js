import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { PiPathBold } from "react-icons/pi";
import { TbListDetails } from "react-icons/tb";
import { MdFeedback } from "react-icons/md";

export const sideBarData = [
  { text: "Home", icon: <MdSpaceDashboard />, path: "/" },
  { text: "Users", icon: <FaUsers />, path: "users" },
  { text: "Admin View", icon: <PiPathBold />, path: "programs" },
  { text: "dashPages admin", icon: <TbListDetails />, path: "all" },
  { text: "Feedback", icon: <MdFeedback />, path: "feedback" },
  { text: "Student View", icon: <MdSpaceDashboard />, path: "student" }
];
