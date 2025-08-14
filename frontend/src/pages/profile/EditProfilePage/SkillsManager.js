import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Chip, Paper, Typography } from '@mui/material';
import { Add, Check } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const predefinedSkillKeys = [
  "javascript", "python", "java", "cpp", "csharp", "php", "ruby", "go", "rust", "swift", "kotlin", "scala", "r", "matlab", "perl",
  "react", "vuejs", "angular", "htmlcss", "sass", "less", "bootstrap", "tailwind", "jquery", "webpack", "vite",
  "nodejs", "expressjs", "django", "flask", "springboot", "laravel", "rails", "aspnet", "fastapi",
  "mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle", "sqlserver", "cassandra", "dynamodb", "firebase",
  "aws", "azure", "googlecloud", "docker", "kubernetes", "jenkins", "gitlabci", "githubactions", "terraform", "ansible",
  "reactnative", "flutter", "iosdev", "androiddev", "xamarin", "ionic",
  "dataanalysis", "machinelearning", "deeplearning", "ai", "tensorflow", "pytorch", "pandas", "numpy", "tableau", "powerbi",
  "uiuxdesign", "figma", "adobexd", "sketch", "photoshop", "illustrator", "indesign", "aftereffects", "blender",
  "digitalmarketing", "seo", "sem", "socialmedia", "contentmarketing", "emailmarketing", "googleanalytics", "facebookads",
  "projectmanagement", "agile", "scrum", "kanban", "jira", "trello", "asana", "mondaycom", "slack",
  "git", "linux", "windowsserver", "cybersecurity", "blockchain", "iot", "apidev", "microservices", "graphql", "restapi",
  "leadership", "communication", "problemsolving", "criticalthinking", "teammanagement", "publicspeaking", "negotiation",
  "english", "french", "spanish", "german", "arabic", "chinese", "japanese", "portuguese", "italian", "russian",
  "ecommerce", "fintech", "healthtech", "edtech", "gaming", "automotive", "realestate", "logistics", "retail",
  "contentwriting", "copywriting", "technicalwriting", "blogwriting", "socialcontent", "videoediting", "podcasting"
];

const SkillsManager = ({ skills, onSkillsChange, disabled = false }) => {
  const { t } = useTranslation();
  const [newSkill, setNewSkill] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  
  const predefinedSkills = predefinedSkillKeys.map(key => t(`skills.${key}`));
  const filteredSkills = predefinedSkills.filter(skill => 
    skill.toLowerCase().includes(newSkill.toLowerCase()) && !skills.includes(skill)
  );

  const handleAddSkill = (skillToAdd = null) => {
    const skill = skillToAdd || newSkill.trim();
    if (skill && !skills.includes(skill)) {
      onSkillsChange([...skills, skill]);
      setNewSkill("");
      setShowDropdown(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.skills-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {t('profile.skillsExpertise')}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {skills.map((skill, idx) => (
          <Chip
            key={idx}
            label={skill}
            onDelete={() => handleRemoveSkill(skill)}
            color="primary"
            variant="outlined"
            deleteIcon={<Check fontSize="small" />}
            sx={{ borderRadius: 1 }}
            disabled={disabled}
          />
        ))}
      </Box>
      
      <Box sx={{ position: 'relative' }} className="skills-dropdown-container">
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label={t('profile.addSkill')}
            value={newSkill}
            onChange={(e) => {
              setNewSkill(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onFocus={() => setShowDropdown(newSkill.length > 0)}
            size="small"
            fullWidth
            disabled={disabled}
          />
          <Button
            onClick={() => handleAddSkill()}
            variant="contained"
            startIcon={<Add />}
            sx={{ whiteSpace: 'nowrap' }}
            disabled={disabled}
          >
            {t('common.add')}
          </Button>
        </Box>
        
        {showDropdown && filteredSkills.length > 0 && (
          <Paper sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 200,
            overflowY: 'auto',
            mt: 1
          }}>
            {filteredSkills.slice(0, 15).map((skill) => (
              <Box
                key={skill}
                onClick={() => handleAddSkill(skill)}
                sx={{
                  p: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                {skill}
              </Box>
            ))}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default SkillsManager; 