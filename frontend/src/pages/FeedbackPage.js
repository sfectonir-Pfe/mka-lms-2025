import React, { useState, useEffect } from "react";
import AddFeedback from "./users/views/AddFeedback";
import FeedbackList from "./users/views/FeedbackList";
import FeedbackAnalytics from "./users/views/FeedbackAnalytics";
import { 
  Container, 
  Typography, 
  Divider, 
  Tabs, 
  Tab, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  LinearProgress,
  Rating,
  Stack,
  Chip
} from "@mui/material";
import { useTranslation } from "react-i18next";
import FeedbackIcon from "@mui/icons-material/Feedback";
import RateReviewIcon from "@mui/icons-material/RateReview";
import BarChartIcon from "@mui/icons-material/BarChart";
import InsightsIcon from "@mui/icons-material/Insights";
import feedbackService from "../services/feedbackService";

export default function FeedbackPage() {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const [stats, setStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    categoryBreakdown: [],
    recentFeedbackCount: 0,
    pendingResponses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Try to fetch from the backend
        const data = await feedbackService.getFeedbackStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch feedback stats:", error);
        // Fallback to dummy data
        setStats({
          totalFeedbacks: 42,
          averageRating: 4.2,
          categoryBreakdown: [
            { category: "course", count: 18, percentage: 43 },
            { category: "instructor", count: 12, percentage: 29 },
            { category: "technical", count: 7, percentage: 17 },
            { category: "platform", count: 3, percentage: 7 },
            { category: "suggestion", count: 2, percentage: 4 }
          ],
          recentFeedbackCount: 8,
          pendingResponses: 3
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  const getCategoryColor = (category) => {
    switch(category) {
      case "course": return "#1976d2";
      case "instructor": return "#2e7d32";
      case "technical": return "#d32f2f";
      case "platform": return "#ed6c02";
      case "suggestion": return "#9c27b0";
      default: return "#757575";
    }
  };
  
  const getCategoryLabel = (category) => {
    return t(`feedback.categories.${category}`, category);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FeedbackIcon sx={{ fontSize: 32, mr: 1, color: "primary.main" }} />
        <Typography variant="h4" component="h1">
          {t("feedback.feedbackCenter", "Feedback Center")}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      {/* Dashboard Stats */}
      {tabIndex === 0 && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {/* Total Feedbacks */}
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("feedback.totalFeedbacks", "Total Feedbacks")}
                  </Typography>
                  <Typography variant="h3" component="div">
                    {loading ? <LinearProgress /> : stats.totalFeedbacks}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Average Rating */}
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("feedback.averageRating", "Average Rating")}
                  </Typography>
                  {loading ? (
                    <LinearProgress />
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="h3" component="div" sx={{ mr: 1 }}>
                        {stats.averageRating.toFixed(1)}
                      </Typography>
                      <Rating value={stats.averageRating} precision={0.1} readOnly />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            {/* Recent Feedback */}
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("feedback.recentFeedback", "Recent Feedback")}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h3" component="div">
                      {loading ? <LinearProgress /> : stats.recentFeedbackCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {t("feedback.last7Days", "last 7 days")}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Pending Responses */}
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t("feedback.pendingResponses", "Pending Responses")}
                  </Typography>
                  <Typography variant="h3" component="div" color={stats.pendingResponses > 0 ? "error.main" : "inherit"}>
                    {loading ? <LinearProgress /> : stats.pendingResponses}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Category Breakdown */}
          <Paper sx={{ p: 3, mt: 3 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              {t("feedback.categoryBreakdown", "Feedback by Category")}
            </Typography>
            
            {loading ? (
              <LinearProgress />
            ) : (
              <Grid container spacing={2}>
                {stats.categoryBreakdown.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.category}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Chip 
                          label={getCategoryLabel(item.category)} 
                          size="small" 
                          sx={{ bgcolor: getCategoryColor(item.category), color: "white" }}
                        />
                        <Typography variant="body2">
                          {item.count} ({item.percentage}%)
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={item.percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 1,
                          bgcolor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getCategoryColor(item.category)
                          }
                        }} 
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Box>
      )}

      <Tabs 
        value={tabIndex} 
        onChange={handleTabChange} 
        aria-label="feedback tabs"
        sx={{ borderBottom: 1, borderColor: "divider" }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab 
          icon={<RateReviewIcon />} 
          iconPosition="start" 
          label={t("feedback.submitFeedback", "Submit Feedback")} 
        />
        <Tab 
          icon={<BarChartIcon />} 
          iconPosition="start" 
          label={t("feedback.viewFeedback", "View Feedback")} 
        />
        <Tab 
          icon={<InsightsIcon />} 
          iconPosition="start" 
          label={t("feedback.analytics.title", "Analytics")} 
        />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <AddFeedback />}
        {tabIndex === 1 && <FeedbackList />}
        {tabIndex === 2 && <FeedbackAnalytics />}
      </Box>
    </Container>
  );
}
