import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const dummyModules = [
  {
    id: 1,
    title: "Module 1: Introduction to Web",
    courses: [
      { id: 101, title: "HTML Basics", type: "PDF", fileUrl: "/uploads/html.pdf" },
      { id: 102, title: "CSS Styling", type: "VIDEO", fileUrl: "/uploads/css.mp4" },
    ],
  },
  {
    id: 2,
    title: "Module 2: JavaScript",
    courses: [
      { id: 201, title: "JS Fundamentals", type: "IMAGE", fileUrl: "/uploads/js.png" },
      { id: 202, title: "DOM Manipulation", type: "VIDEO", fileUrl: "/uploads/dom.mp4" },
    ],
  },
];

const StudentProgramPage = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [completedCourses, setCompletedCourses] = useState(() => {
    const saved = localStorage.getItem("completedCourses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/modules/by-program/${programId}`);
        setModules(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch modules, using dummy fallback:", err.message);
        setModules(dummyModules);
      }
    };

    fetchModules();
  }, [programId]);

  const toggleComplete = (courseId) => {
    let updated;
    if (completedCourses.includes(courseId)) {
      updated = completedCourses.filter(id => id !== courseId);
    } else {
      updated = [...completedCourses, courseId];
    }
    setCompletedCourses(updated);
    localStorage.setItem("completedCourses", JSON.stringify(updated));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📘 Program Overview
      </Typography>

      <Button variant="text" onClick={() => navigate("/student")} sx={{ mb: 2}}>
        🎓 All Programs
      </Button>

      {modules.length === 0 ? (
        <Typography>No modules available.</Typography>
      ) : (
        modules.map((module) => (
          <Accordion key={module.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">{module.title || module.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {!Array.isArray(module.courses) || module.courses.length === 0 ? (
                <Typography>No courses in this module.</Typography>
              ) : (
                module.courses.map((course) => (
                  <Card key={course.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">
                        {course.title}{" "}
                        {completedCourses.includes(course.id) && (
                          <span style={{ color: "green" }}>✅</span>
                        )}
                      </Typography>
                      <Typography variant="body2">Type: {course.type}</Typography>
                      <Button
                        variant="outlined"
                        href={course.fileUrl}
                        target="_blank"
                        sx={{ mt: 1, mr: 1 }}
                      >
                        View Course
                      </Button>
                      <Button
                        variant="contained"
                        color={completedCourses.includes(course.id) ? "success" : "primary"}
                        onClick={() => toggleComplete(course.id)}
                        sx={{ mt: 1 }}
                      >
                        {completedCourses.includes(course.id) ? "Completed" : "Mark as Done"}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
};

export default StudentProgramPage;
