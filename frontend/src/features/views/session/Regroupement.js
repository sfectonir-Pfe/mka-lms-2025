import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

// const API_BASE = "http://localhost:8000/feedback-etudiant";

const Regroupement = () => {
  const { t } = useTranslation();
  const { id: seanceId } = useParams();
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);

  const createGroup = async () => {
    try {
      console.log('🔄 Création groupe avec seanceId:', seanceId);
      const response = await api.post(`/groups`, {
        name: t('seances.groupName', { index: groups.length + 1 }),
        seanceId: parseInt(seanceId),
        studentIds: []
      });
      console.log('✅ Groupe créé:', response.data);
      setGroups([...groups, response.data]);
    } catch (error) {
      console.error('❌ Erreur création groupe:', error.response?.data || error.message);
      alert(t('seances.groupCreateError'));
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await api.delete(`/groups/${groupId}`);
      const group = groups.find(g => g.id === groupId);
      if (group) {
        setStudents([...students, ...group.students]);
      }
      setGroups(groups.filter(g => g.id !== groupId));
    } catch (error) {
      console.error('Erreur suppression groupe:', error);
    }
  };

  const addStudentToGroup = async (groupId, student) => {
    try {
      await api.post(`/groups/${groupId}/students/${student.id}`);
      setGroups(groups.map(g => 
        g.id === groupId 
          ? { ...g, students: [...g.students, student] }
          : g
      ));
      setStudents(students.filter(s => s.id !== student.id));
    } catch (error) {
      console.error('Erreur ajout étudiant au groupe:', error);
    }
  };

  const removeStudentFromGroup = async (groupId, studentId) => {
    try {
      await api.delete(`/groups/${groupId}/students/${studentId}`);
      const group = groups.find(g => g.id === groupId);
      const student = group.students.find(s => s.id === studentId);
      setGroups(groups.map(g => 
        g.id === groupId 
          ? { ...g, students: g.students.filter(s => s.id !== studentId) }
          : g
      ));
      setStudents([...students, student]);
    } catch (error) {
      console.error('Erreur suppression étudiant du groupe:', error);
    }
  };

  useEffect(() => {
    if (!seanceId) return;
    
    const loadData = async () => {
      try {
        // Charger les étudiants et les groupes en parallèle
        const [studentsRes, groupsRes] = await Promise.all([
          api.get(`/students/seance/${seanceId}`),
          api.get(`/groups/seance/${seanceId}`)
        ]);
        
        const allStudents = studentsRes.data;
        const existingGroups = groupsRes.data;
        
        // Filtrer les étudiants déjà dans des groupes
        const studentsInGroups = existingGroups.flatMap(g => g.students);
        const availableStudents = allStudents.filter(
          student => !studentsInGroups.some(s => s.id === student.id)
        );
        
        setStudents(availableStudents);
        setGroups(existingGroups);
      } catch (err) {
        console.error('❌ Erreur chargement données:', err);
        setStudents([]);
        setGroups([]);
      }
    };
    
    loadData();
  }, [seanceId]);

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Typography variant="h6">{t('seances.regroupementTitle')}</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={createGroup}>
          {t('seances.createGroup')}
        </Button>
      </Stack>
      
      <Stack direction="row" spacing={3}>
        {/* Étudiants non groupés */}
        <Paper sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle1" mb={2}>{t('seances.availableStudents')} ({students.length})</Typography>
          <Stack spacing={1}>
            {students.map(student => (
              <Chip
                key={student.id}
                label={student.name || student.email}
                variant="outlined"
                sx={{ justifyContent: 'flex-start' }}
              />
            ))}
          </Stack>
        </Paper>

        {/* Groupes */}
        <Box flex={1}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {groups.map(group => (
              <Paper key={group.id} sx={{ p: 2, minWidth: 200, minHeight: 150 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle1" fontWeight="bold">{group.name}</Typography>
                  <IconButton size="small" onClick={() => deleteGroup(group.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <Stack spacing={1}>
                  {group.students.map(student => (
                    <Chip
                      key={student.id}
                      label={student.name || student.email}
                      size="small"
                      onDelete={() => removeStudentFromGroup(group.id, student.id)}
                      color="primary"
                    />
                  ))}
                  {students.length > 0 && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t('seances.dragStudentHere')}</Typography>
                      {students.map(student => (
                        <Button
                          key={student.id}
                          size="small"
                          variant="text"
                          onClick={() => addStudentToGroup(group.id, student)}
                          sx={{ display: 'block', textAlign: 'left', p: 0.5 }}
                        >
                          {t('seances.addStudent', { name: student.name || student.email })}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Regroupement;

