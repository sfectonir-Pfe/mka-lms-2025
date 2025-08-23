import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Button, Checkbox,
  FormGroup, FormControlLabel, Stepper, Step, StepLabel
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";

const BuildProgramView = () => {
  const { t } = useTranslation();
  
  const steps = [
    t('buildProgram.modulesCoursesContents'),
    t('buildProgram.programLevel')
  ];

  const navigate = useNavigate();
  const { programId } = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [modules, setModules] = useState([]);
  const [coursesByModule, setCoursesByModule] = useState({});
  const [contenusByCourse, setContenusByCourse] = useState({});
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [selectedContenus, setSelectedContenus] = useState({});
  const [level, setLevel] = useState("");

  useEffect(() => {
    api.get("/modules").then(res => setModules(res.data));
  }, []);

  const handleModuleToggle = async (moduleId) => {
    const updated = selectedModules.includes(moduleId)
      ? selectedModules.filter(id => id !== moduleId)
      : [...selectedModules, moduleId];
    setSelectedModules(updated);

    if (!coursesByModule[moduleId]) {
      const res = await api.get("/courses");
      setCoursesByModule(prev => ({ ...prev, [moduleId]: res.data }));
    }
  };

  const handleCourseToggle = async (moduleId, courseId) => {
    const current = selectedCourses[moduleId] || [];
    const updated = current.includes(courseId)
      ? current.filter(id => id !== courseId)
      : [...current, courseId];
    setSelectedCourses(prev => ({ ...prev, [moduleId]: updated }));

    if (!contenusByCourse[courseId]) {
      const res = await api.get("/contenus");
      setContenusByCourse(prev => ({ ...prev, [courseId]: res.data }));
    }
  };

  const handleContenuToggle = (moduleId, courseId, contenuId) => {
    const key = `${moduleId}-${courseId}`;
    const current = selectedContenus[key] || [];
    const updated = current.includes(contenuId)
      ? current.filter(id => id !== contenuId)
      : [...current, contenuId];
    setSelectedContenus(prev => ({ ...prev, [key]: updated }));
  };

  const handleSubmit = async () => {
    if (!programId || !level || selectedModules.length === 0) {
      alert(t('buildProgram.fillAllFields'));
      return;
    }

    const formData = new FormData();
    formData.append("programId", programId);
    formData.append("level", level);

    formData.append("modules", JSON.stringify(
      selectedModules.map((moduleId) => {
        const courseIds = selectedCourses[moduleId] || [];
        return {
          moduleId,
          courses: courseIds.map((courseId) => {
            const key = `${moduleId}-${courseId}`;
            const contenuIds = selectedContenus[key] || [];
            return {
              courseId,
              contenus: contenuIds.map((contenuId) => ({ contenuId }))
            };
          })
        };
      })
    ));

    try {
      await api.post("/buildProgram", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert(t('buildProgram.buildSuccess'));
      navigate("/programs");
    } catch {
      alert(t('buildProgram.buildError'));
    }
  };

  return (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
    <Paper sx={{ p: 4, width: "100%", maxWidth: 1000, borderRadius: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        🎓 {t('buildProgram.buildProgram')}
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <>
          <Typography variant="h6">📦 {t('buildProgram.selectModules')}</Typography>
          <FormGroup>
            {modules.map((m) => (
              <FormControlLabel
                key={m.id}
                control={<Checkbox checked={selectedModules.includes(m.id)} onChange={() => handleModuleToggle(m.id)} />}
                label={m.name}
              />
            ))}
          </FormGroup>

          {selectedModules.map((moduleId) => (
            <Accordion key={moduleId} sx={{ mt: 2 }} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">
                  🧩 {modules.find(m => m.id === moduleId)?.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {(coursesByModule[moduleId] || []).map((course) => (
                  <Box key={course.id} ml={2} mt={1}>
                    <FormControlLabel
                      control={<Checkbox checked={(selectedCourses[moduleId] || []).includes(course.id)} onChange={() => handleCourseToggle(moduleId, course.id)} />}
                      label={course.title}
                    />
                    {(selectedCourses[moduleId] || []).includes(course.id) && contenusByCourse[course.id]?.length > 0 && (
                      <Box ml={4} mt={1}>
                        <Typography variant="body2" fontWeight="bold">📄 {t('buildProgram.contents')} :</Typography>
                        <FormGroup>
                          {contenusByCourse[course.id].map((ct) => (
                            <FormControlLabel
                              key={ct.id}
                              control={<Checkbox checked={(selectedContenus[`${moduleId}-${course.id}`] || []).includes(ct.id)} onChange={() => handleContenuToggle(moduleId, course.id, ct.id)} />}
                              label={ct.title}
                            />
                          ))}
                        </FormGroup>
                      </Box>
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="error" onClick={() => navigate("/programs")}>
              {t('common.cancel')}
            </Button>
            <Button variant="contained" onClick={() => setActiveStep(1)}>
              {t('common.next')}
            </Button>
          </Box>
        </>
      )}

      {activeStep === 1 && (
        <>
          <Typography variant="h6">🎯 {t('buildProgram.programLevel')}</Typography>
          <FormGroup>
            {[t('buildProgram.basic'), t('buildProgram.intermediate'), t('buildProgram.advanced')].map((lvl) => (
              <FormControlLabel
                key={lvl}
                control={<Checkbox checked={level === lvl} onChange={() => setLevel(lvl)} />}
                label={lvl}
              />
            ))}
          </FormGroup>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => setActiveStep(0)}>
              {t('common.back')}
            </Button>
            <Box>
              <Button variant="outlined" color="error" sx={{ mr: 2 }} onClick={() => navigate("/programs")}>
                {t('common.cancel')}
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                {t('common.save')}
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  </Box>
);

};

export default BuildProgramView;
