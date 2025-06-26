import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Rating,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
  Divider,
  Badge,
  Tooltip,
  Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FlagIcon from "@mui/icons-material/Flag";
import ReplyIcon from "@mui/icons-material/Reply";
import feedbackService from "../../../services/feedbackService";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import FeedbackResponse from "./FeedbackResponse";

// Extended dummy data for demonstration
const dummyFeedbacks = [
  {
    id: 1,
    from: "Etudiant1",
    to: "Formateur1",
    message: "Great explanation of the module content! The examples were very helpful in understanding the concepts.",
    timestamp: "2025-05-06T10:15:00",
    type: "etudiant-formateur",
    rating: 4.5,
    category: "course",
    tags: ["Content", "Examples"],
    likes: 3,
    dislikes: 0
  },
  {
    id: 2,
    from: "Formateur1",
    to: "Etudiant2",
    message: "Excellent project work, well done! Your implementation shows a deep understanding of the material.",
    timestamp: "2025-05-06T11:30:00",
    type: "formateur-etudiant",
    rating: 5,
    category: "instructor",
    tags: ["Project", "Implementation"],
    likes: 2,
    dislikes: 0
  },
  {
    id: 3,
    from: "Etudiant3",
    to: "Admin",
    message: "The platform is sometimes slow to load videos. Could you please look into this issue?",
    timestamp: "2025-05-07T09:20:00",
    type: "general",
    rating: 3,
    category: "technical",
    tags: ["Video Quality", "Performance"],
    likes: 5,
    dislikes: 1
  },
  {
    id: 4,
    from: "Etudiant4",
    to: "Formateur2",
    message: "The pace of the course is too fast. Could we have more time to practice the concepts?",
    timestamp: "2025-05-08T14:45:00",
    type: "etudiant-formateur",
    rating: 3.5,
    category: "course",
    tags: ["Pace", "Practice"],
    likes: 8,
    dislikes: 1
  },
  {
    id: 5,
    from: "Formateur2",
    to: "Etudiant1",
    message: "Your quiz results show great improvement. Keep up the good work!",
    timestamp: "2025-05-09T16:30:00",
    type: "formateur-etudiant",
    rating: 4,
    category: "instructor",
    tags: ["Quizzes", "Progress"],
    likes: 1,
    dislikes: 0
  }
];

export default function FeedbackList() {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        // Try to fetch from the backend
        const data = await feedbackService.getAllFeedback();
        const feedbackData = data.length > 0 ? data : dummyFeedbacks;
        setFeedbacks(feedbackData);
        setTotalPages(Math.ceil(feedbackData.length / itemsPerPage));
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error);
        setFeedbacks(dummyFeedbacks);
        setTotalPages(Math.ceil(dummyFeedbacks.length / itemsPerPage));
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedbacks();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };
  
  const handleFilterCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  
  const handleLike = async (id) => {
    try {
      // Try to use the backend service
      await feedbackService.likeFeedback(id);
      
      // Update local state
      setFeedbacks(feedbacks.map(fb => 
        fb.id === id ? { ...fb, likes: fb.likes + 1 } : fb
      ));
    } catch (error) {
      console.error("Failed to like feedback:", error);
    }
  };
  
  const handleDislike = async (id) => {
    try {
      // Try to use the backend service
      await feedbackService.dislikeFeedback(id);
      
      // Update local state
      setFeedbacks(feedbacks.map(fb => 
        fb.id === id ? { ...fb, dislikes: fb.dislikes + 1 } : fb
      ));
    } catch (error) {
      console.error("Failed to dislike feedback:", error);
    }
  };
  
  const handleReport = async (id) => {
    try {
      // Try to use the backend service
      await feedbackService.reportFeedback(id);
      
      alert(t("feedback.reportSubmitted", "Report submitted"));
    } catch (error) {
      console.error("Failed to report feedback:", error);
    }
  };
  
  // Response dialog state
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  const handleOpenResponseDialog = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseDialogOpen(true);
  };
  
  const handleCloseResponseDialog = (wasSuccessful) => {
    setResponseDialogOpen(false);
    if (wasSuccessful) {
      // Refresh the feedback list or update the local state
      setFeedbacks(feedbacks.map(fb => 
        fb.id === selectedFeedback.id 
          ? { ...fb, hasResponse: true } 
          : fb
      ));
    }
    setSelectedFeedback(null);
  };

  // Filter feedbacks based on search term and filters
  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesSearch = 
      fb.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fb.tags && fb.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesType = filterType === "all" || fb.type === filterType;
    const matchesCategory = filterCategory === "all" || fb.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });
  
  // Paginate the filtered results
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Calculate total pages after filtering
  const filteredTotalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPpp");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box component={Paper} elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        📋 {t("feedback.recentFeedback", "Recent Feedback")}
      </Typography>
      
      {/* Search and filters */}
      <Box sx={{ mb: 3, display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder={t("feedback.search", "Search feedbacks...")}
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", md: "auto" } }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filter-type-label">
              {t("feedback.filterByType", "Filter by Type")}
            </InputLabel>
            <Select
              labelId="filter-type-label"
              value={filterType}
              onChange={handleFilterTypeChange}
              label={t("feedback.filterByType", "Filter by Type")}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">{t("feedback.all", "All")}</MenuItem>
              <MenuItem value="general">{t("feedback.general", "General")}</MenuItem>
              <MenuItem value="etudiant-formateur">{t("feedback.studentToInstructor", "Student → Instructor")}</MenuItem>
              <MenuItem value="formateur-etudiant">{t("feedback.instructorToStudent", "Instructor → Student")}</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filter-category-label">
              {t("feedback.filterByCategory", "Filter by Category")}
            </InputLabel>
            <Select
              labelId="filter-category-label"
              value={filterCategory}
              onChange={handleFilterCategoryChange}
              label={t("feedback.filterByCategory", "Filter by Category")}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">{t("feedback.all", "All")}</MenuItem>
              <MenuItem value="course">{t("feedback.categories.course", "Course Content")}</MenuItem>
              <MenuItem value="instructor">{t("feedback.categories.instructor", "Instructor")}</MenuItem>
              <MenuItem value="platform">{t("feedback.categories.platform", "Platform")}</MenuItem>
              <MenuItem value="technical">{t("feedback.categories.technical", "Technical Issue")}</MenuItem>
              <MenuItem value="suggestion">{t("feedback.categories.suggestion", "Suggestion")}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : paginatedFeedbacks.length === 0 ? (
        <Box sx={{ textAlign: "center", my: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="body1" color="text.secondary">
            {t("feedback.noFeedbackFound", "No feedback found matching your criteria")}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {paginatedFeedbacks.map((fb) => (
              <Grid item xs={12} sm={6} md={4} key={fb.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderLeft: "6px solid", 
                    borderLeftColor: 
                      fb.type === "etudiant-formateur" ? "#1976d2" : 
                      fb.type === "formateur-etudiant" ? "#2e7d32" : 
                      "#ff9800",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Chip
                        label={fb.type.replace("-", " → ")}
                        color={
                          fb.type === "etudiant-formateur" ? "primary" : 
                          fb.type === "formateur-etudiant" ? "success" : 
                          "warning"
                        }
                        size="small"
                      />
                      <Rating value={fb.rating} precision={0.5} size="small" readOnly />
                    </Box>
                    
                    <Typography variant="subtitle2" color="text.secondary">
                      {t("feedback.from", "From")}: {fb.from} → {t("feedback.to", "To")}: {fb.to}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ my: 1 }}>
                      {fb.message}
                    </Typography>
                    
                    {fb.category && (
                      <Chip 
                        label={t(`feedback.categories.${fb.category}`, fb.category)} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    )}
                    
                    {fb.tags && fb.tags.map(tag => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small" 
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(fb.timestamp)}
                      </Typography>
                      
                      <Box>
                        <Tooltip title={t("feedback.like", "Like")}>
                          <IconButton size="small" onClick={() => handleLike(fb.id)}>
                            <Badge badgeContent={fb.likes} color="primary">
                              <ThumbUpIcon fontSize="small" />
                            </Badge>
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={t("feedback.dislike", "Dislike")}>
                          <IconButton size="small" onClick={() => handleDislike(fb.id)}>
                            <Badge badgeContent={fb.dislikes} color="error">
                              <ThumbDownIcon fontSize="small" />
                            </Badge>
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={t("feedback.report", "Report")}>
                          <IconButton size="small" onClick={() => handleReport(fb.id)}>
                            <FlagIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={t("feedback.respond", "Respond")}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenResponseDialog(fb)}
                          >
                            <ReplyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {filteredTotalPages > 1 && (
            <Stack spacing={2} sx={{ mt: 3, display: "flex", alignItems: "center" }}>
              <Pagination 
                count={filteredTotalPages} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary" 
              />
              <Typography variant="caption" color="text.secondary">
                {t("feedback.showing", "Showing")} {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredFeedbacks.length)} {t("feedback.of", "of")} {filteredFeedbacks.length} {t("feedback.items", "items")}
              </Typography>
            </Stack>
          )}
        </>
      )}
      
      {/* Response Dialog */}
      <FeedbackResponse 
        open={responseDialogOpen}
        onClose={handleCloseResponseDialog}
        feedback={selectedFeedback}
      />
    </Box>
  );
}
