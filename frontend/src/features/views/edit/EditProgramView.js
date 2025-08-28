import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Button, Checkbox,
  FormGroup, FormControlLabel, Stepper, Step, StepLabel, TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItem } from "@mui/material";


const EditProgramBuildView = () => {
  const { t } = useTranslation();
  
  const steps = [t('buildProgram.modulesCoursesContents'), t('buildProgram.programLevel')];
  const navigate = useNavigate();
  const { programId } = useParams();

  const styles = {
    primary: {
      borderRadius: 3,
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(25,118,210,0.4)'
      }
    },
    danger: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
      boxShadow: '0 6px 18px rgba(211,47,47,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(211,47,47,0.35)' }
    },
    success: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
      boxShadow: '0 6px 18px rgba(46,125,50,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(46,125,50,0.35)' }
    },
    info: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
      boxShadow: '0 6px 18px rgba(2,136,209,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(2,136,209,0.35)' }
    },
    secondary: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #7b1fa2, #ab47bc)',
      boxShadow: '0 6px 18px rgba(123,31,162,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(123,31,162,0.35)' }
    },
    rounded: { borderRadius: 2 }
  };

  const [activeStep, setActiveStep] = useState(0);
  const [programName, setProgramName] = useState("");
  const [modules, setModules] = useState([]);
  const [coursesByModule, setCoursesByModule] = useState({});
  const [contenusByCourse, setContenusByCourse] = useState({});
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [selectedContenus, setSelectedContenus] = useState({});
  const [level, setLevel] = useState("");
  const [buildProgramId, setbuildProgramId] = useState(null);
const [search, setSearch] = useState("");
const [searchScope, setSearchScope] = useState("module");

  useEffect(() => {
    api.get("/modules").then(res => setModules(res.data));

    api.get(`/buildProgram/program/${programId}`)
      .then(async (res) => {
        const buildProgram = res.data;
        setbuildProgramId(buildProgram.id);
        setProgramName(buildProgram.program.name);
        setLevel(buildProgram.level);

        const selectedModuleIds = buildProgram.modules.map(sm => sm.module.id);
        setSelectedModules(selectedModuleIds);

        const courseMap = {};
        const contenuMap = {};

        for (const sm of buildProgram.modules) {
          const moduleId = sm.module.id;

          if (!coursesByModule[moduleId]) {
            const res = await api.get("/courses");
            setCoursesByModule(prev => ({ ...prev, [moduleId]: res.data }));
          }

          courseMap[moduleId] = sm.courses.map(sc => sc.course.id);

          for (const sc of sm.courses) {
            const courseId = sc.course.id;
            const key = `${moduleId}-${courseId}`;
            if (!contenusByCourse[courseId]) {
              const res = await api.get("/contenus");
              setContenusByCourse(prev => ({ ...prev, [courseId]: res.data }));
            }
            contenuMap[key] = sc.contenus.map(scct => scct.contenu.id);
          }
        }

        setSelectedCourses(courseMap);
        setSelectedContenus(contenuMap);
      })
      .catch((err) => {
        console.error("Erreur chargement Program du programme:", err);
      });
  }, [programId]);

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
    if (!buildProgramId || !programName || !level || selectedModules.length === 0) {
      toast.error(t('programs.fillAllFields'));
      return;
    }

    try {
      // 1. Update program name
      await api.patch(`/programs/${programId}`, {
        name: programName,
      });

      // 2. Update buildProgram structure
      const modulesPayload = selectedModules.map((moduleId) => {
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
      });

      const formData = new FormData();
      formData.append("level", level);
      formData.append("modules", JSON.stringify(modulesPayload));

      await api.patch(`/buildProgram/${buildProgramId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(t('programs.updateSuccess'));
      navigate("/programs");
    } catch (err) {
      console.error(err);
      toast.error(t('programs.updateError'));
    }
  };


const filteredModules = modules.filter((mod) => {
  if (searchScope === "module") {
    return mod.name.toLowerCase().includes(search.toLowerCase());
  }

  if (searchScope === "course") {
    const courses = coursesByModule[mod.id] || [];
    return courses.some(course =>
      course.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (searchScope === "contenu") {
    const courses = coursesByModule[mod.id] || [];
    return courses.some(course => {
      const contenus = contenusByCourse[course.id] || [];
      return contenus.some(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  return true;
});


return (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
    <Paper sx={{ p: 4, width: "100%", maxWidth: 1000, borderRadius: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        🛠️ {t('programs.editProgram')}
      </Typography>

      {/* 🖊️ Nom du programme */}
      <TextField
        fullWidth
        label={t('programs.programName')}
        variant="outlined"
        value={programName}
        onChange={(e) => setProgramName(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* 🔍 Search + Filter Scope */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label={`🔍 Rechercher par ${searchScope}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          select
          label="Filtrer par"
          size="small"
          value={searchScope}
          onChange={(e) => setSearchScope(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="module">Module</MenuItem>
          <MenuItem value="course">Cours</MenuItem>
          <MenuItem value="contenu">Contenu</MenuItem>
        </TextField>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {/* 👣 Étape 1 : Modules */}
      {activeStep === 0 && (
        <>
          <Typography variant="h6">📦 {t('buildProgram.selectModules')}</Typography>
          <FormGroup>
            {filteredModules.map((m) => (
              <FormControlLabel
                key={m.id}
                control={
                  <Checkbox
                    checked={selectedModules.includes(m.id)}
                    onChange={() => handleModuleToggle(m.id)}
                  />
                }
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
                      control={
                        <Checkbox
                          checked={(selectedCourses[moduleId] || []).includes(course.id)}
                          onChange={() => handleCourseToggle(moduleId, course.id)}
                        />
                      }
                      label={course.title}
                    />
                    {(selectedCourses[moduleId] || []).includes(course.id) &&
                      contenusByCourse[course.id]?.length > 0 && (
                        <Box ml={4} mt={1}>
                          <Typography variant="body2" fontWeight="bold">
                            📄 Contenus :
                          </Typography>
                          <FormGroup>
                            {contenusByCourse[course.id].map((ct) => (
                              <FormControlLabel
                                key={ct.id}
                                control={
                                  <Checkbox
                                    checked={
                                      (selectedContenus[`${moduleId}-${course.id}`] || []).includes(ct.id)
                                    }
                                    onChange={() =>
                                      handleContenuToggle(moduleId, course.id, ct.id)
                                    }
                                  />
                                }
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
            <Button variant="contained" sx={styles.danger} onClick={() => navigate("/programs")}>
              {t('common.cancel')}
            </Button>
            <Button variant="contained" sx={styles.primary} onClick={() => setActiveStep(1)}>
              {t('common.next')}
            </Button>
          </Box>
        </>
      )}

      {/* 👣 Étape 2 : Niveau */}
      {activeStep === 1 && (
        <>
          <Typography variant="h6">🎯 {t('buildProgram.programLevel')}</Typography>
          <FormGroup>
            {[t('buildProgram.basic'), t('buildProgram.intermediate'), t('buildProgram.advanced')].map((lvl) => (
              <FormControlLabel
                key={lvl}
                control={
                  <Checkbox
                    checked={level === lvl}
                    onChange={() => setLevel(lvl)}
                  />
                }
                label={lvl}
              />
            ))}
          </FormGroup>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="contained" sx={styles.secondary} onClick={() => setActiveStep(0)}>
              {t('common.back')}
            </Button>
            <Box>
              <Button
                variant="contained"
                sx={{ ...styles.danger, mr: 2 }}
                onClick={() => navigate("/programs")}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="contained"
                sx={styles.success}
                onClick={handleSubmit}
              >
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

export default EditProgramBuildView;
