import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Divider,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  TextField,
  Badge,
} from "@mui/material";
import {
    ExpandLess,
    ExpandMore,
    Delete as DeleteIcon,
  } from "@mui/icons-material";
  import { useNavigate } from "react-router-dom";
  import { toast } from "react-toastify";
  import ScrollToTopButton from "../components/ScrollToTopButton";


  
  // Section Component
  const Section = ({ title, items, onDelete, renderItem, expanded, onToggle }) => (
    <Box component={Paper} elevation={2} sx={{ p: 2, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Badge badgeContent={items.length} color="primary">
          <Typography variant="h6">{title}</Typography>
        </Badge>
        <IconButton onClick={onToggle}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
  
      <Collapse in={expanded}>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No {title.toLowerCase()} found.
          </Typography>
        ) : (
          <List dense>
            {items.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => onDelete(item.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={renderItem(item)}
                  secondary={`ID: ${item.id}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Collapse>
    </Box>
  );
  
  export default function AllPages() {
    const [programs, setPrograms] = useState([]);
    const [modules, setModules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
  
    const [showPrograms, setShowPrograms] = useState(true);
    const [showModules, setShowModules] = useState(true);
    const [showCourses, setShowCourses] = useState(true);
  
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchAllData();
    }, []);
  
    const fetchAllData = () => {
      axios.get("http://localhost:8000/programs").then((res) => setPrograms(res.data));
      axios.get("http://localhost:8000/modules").then((res) => setModules(res.data));
      axios.get("http://localhost:8000/courses").then((res) => setCourses(res.data));
    };
  
    const searchFilter = (item) =>
      (item.title || item.name || "").toLowerCase().includes(search.toLowerCase());
  
    // DELETE HANDLERS
  
    const deleteProgram = async (id) => {
        if (!window.confirm("Are you sure you want to delete this program?")) return;
        try {
          await axios.delete(`http://localhost:8000/programs/${id}`);
          setPrograms((prev) => prev.filter((p) => p.id !== id));
          toast.success(" Program deleted");
        } catch (err) {
          toast.error("Failed to delete program");
          console.error(err);
        }
      };
  
      const deleteModule = async (id) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;
        try {
          await axios.delete(`http://localhost:8000/modules/${id}`);
          setModules((prev) => prev.filter((m) => m.id !== id));
          toast.success("Module deleted");
        } catch (err) {
          toast.error(" Failed to delete module");
          console.error(err);
        }
      };
      
      const deleteCourse = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
          await axios.delete(`http://localhost:8000/courses/${id}`);
          setCourses((prev) => prev.filter((c) => c.id !== id));
          toast.success("Course deleted");
        } catch (err) {
          toast.error("Failed to delete course");
          console.error(err);
        }
      };
      
  
      return (
        <>
          <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>📊 Admin/etud Overview</Typography>
            <Divider sx={{ mb: 2 }} />
      
            <TextField
              fullWidth
              label="Search Programs, Modules, or Courses"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 3 }}
            />
      
            <Section
              title="Programs"
              items={programs.filter(searchFilter)}
              onDelete={deleteProgram}
              expanded={showPrograms}
              onToggle={() => setShowPrograms((prev) => !prev)}
              renderItem={(item) => (
                <span
                  onClick={() => navigate(`/programs/${item.id}/modules`)}
                  style={{ cursor: "pointer", color: "#1976d2" }}
                >
                  {item.name || item.title || `Program ${item.id}`}
                </span>
              )}
            />
      
            <Section
              title="Modules"
              items={modules.filter(searchFilter)}
              onDelete={deleteModule}
              expanded={showModules}
              onToggle={() => setShowModules((prev) => !prev)}
              renderItem={(item) => (
                <span
                  onClick={() => navigate(`/module/cours/${item.id}`)}
                  style={{ cursor: "pointer", color: "#1976d2" }}
                >
                  {item.name || item.title || `Module ${item.id}`}
                </span>
              )}
            />
      
            <Section
              title="Courses"
              items={courses.filter(searchFilter)}
              onDelete={deleteCourse}
              expanded={showCourses}
              onToggle={() => setShowCourses((prev) => !prev)}
              renderItem={(item) => (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#1976d2" }}
                >
                  {item.title || item.name || `Course ${item.id}`}
                </a>
              )}
            />
          </Container>
      
          <ScrollToTopButton />
        </>
      );
      
      
    
  }