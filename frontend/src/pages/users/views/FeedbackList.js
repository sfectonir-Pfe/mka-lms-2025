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
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import feedbackService from "../../../services/feedbackService";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import FeedbackResponse from "./FeedbackResponse";

// No more dummy data - fully dynamic feedback system

export default function FeedbackList() {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch dynamic data from the backend
      const data = await feedbackService.getAllFeedback();
      console.log('✅ Fetched dynamic feedback data:', data);
      setFeedbacks(data || []);
      setTotalPages(Math.ceil((data?.length || 0) / itemsPerPage));
    } catch (error) {
      console.error("❌ Failed to fetch feedbacks:", error);
      setError(error.message || "Failed to load feedback data");
      // Show empty state instead of dummy data
      setFeedbacks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      console.log(`👍 Liking feedback ${id}`);
      const updatedFeedback = await feedbackService.likeFeedback(id);

      // Update local state with server response
      setFeedbacks(feedbacks.map(fb =>
        fb.id === id ? { ...fb, likes: updatedFeedback.likes } : fb
      ));
      console.log(`✅ Successfully liked feedback ${id}`);
    } catch (error) {
      console.error("❌ Failed to like feedback:", error);
      alert(t("feedback.errorLiking", "Failed to like feedback. Please try again."));
    }
  };

  const handleDislike = async (id) => {
    try {
      console.log(`👎 Disliking feedback ${id}`);
      const updatedFeedback = await feedbackService.dislikeFeedback(id);

      // Update local state with server response
      setFeedbacks(feedbacks.map(fb =>
        fb.id === id ? { ...fb, dislikes: updatedFeedback.dislikes } : fb
      ));
      console.log(`✅ Successfully disliked feedback ${id}`);
    } catch (error) {
      console.error("❌ Failed to dislike feedback:", error);
      alert(t("feedback.errorDisliking", "Failed to dislike feedback. Please try again."));
    }
  };

  const handleReport = async (id) => {
    try {
      console.log(`🚩 Reporting feedback ${id}`);
      await feedbackService.reportFeedback(id);

      alert(t("feedback.reportSubmitted", "Report submitted successfully"));
      console.log(`✅ Successfully reported feedback ${id}`);
    } catch (error) {
      console.error("❌ Failed to report feedback:", error);
      alert(t("feedback.errorReporting", "Failed to report feedback. Please try again."));
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
          <Button
            variant="outlined"
            size="small"
            onClick={fetchFeedbacks}
            disabled={loading}
            startIcon={<RefreshIcon />}
            sx={{ minWidth: 120 }}
          >
            {loading ? t("feedback.refreshing", "Refreshing...") : t("feedback.refresh", "Refresh")}
          </Button>

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
      ) : error ? (
        <Box sx={{ textAlign: "center", my: 4, p: 3, bgcolor: "#ffebee", borderRadius: 1, border: "1px solid #ffcdd2" }}>
          <ErrorOutlineIcon sx={{ fontSize: 48, color: "#f44336", mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            {t("feedback.errorTitle", "Unable to Load Feedback")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchFeedbacks}
            startIcon={<RefreshIcon />}
          >
            {t("feedback.tryAgain", "Try Again")}
          </Button>
        </Box>
      ) : paginatedFeedbacks.length === 0 ? (
        <Box sx={{ textAlign: "center", my: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {feedbacks.length === 0
              ? t("feedback.noFeedbackYet", "No feedback submitted yet")
              : t("feedback.noFeedbackFound", "No feedback found matching your criteria")
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {feedbacks.length === 0
              ? t("feedback.noFeedbackDescription", "Be the first to submit feedback!")
              : t("feedback.tryDifferentFilters", "Try adjusting your search or filters")
            }
          </Typography>
          {feedbacks.length === 0 && (
            <Button
              variant="outlined"
              onClick={fetchFeedbacks}
              startIcon={<RefreshIcon />}
            >
              {t("feedback.checkForNew", "Check for New Feedback")}
            </Button>
          )}
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
