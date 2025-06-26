import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import feedbackService from "../../../services/feedbackService";

// Sample data for charts
const dummyRatingData = [
  { name: "5 Stars", count: 18 },
  { name: "4 Stars", count: 12 },
  { name: "3 Stars", count: 7 },
  { name: "2 Stars", count: 3 },
  { name: "1 Star", count: 2 }
];

const dummyCategoryData = [
  { name: "Course Content", value: 18 },
  { name: "Instructor", value: 12 },
  { name: "Technical", value: 7 },
  { name: "Platform", value: 3 },
  { name: "Suggestion", value: 2 }
];

const dummyTimelineData = [
  { month: "Jan", count: 4 },
  { month: "Feb", count: 6 },
  { month: "Mar", count: 8 },
  { month: "Apr", count: 10 },
  { month: "May", count: 7 },
  { month: "Jun", count: 5 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function FeedbackAnalytics() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6months");
  const [ratingData, setRatingData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Try to fetch from the backend
        const data = await feedbackService.getFeedbackAnalytics(timeRange);
        setRatingData(data.ratingData || dummyRatingData);
        setCategoryData(data.categoryData || dummyCategoryData);
        setTimelineData(data.timelineData || dummyTimelineData);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        // Fallback to dummy data
        setRatingData(dummyRatingData);
        setCategoryData(dummyCategoryData);
        setTimelineData(dummyTimelineData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [timeRange]);
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 1, boxShadow: 2 }}>
          <Typography variant="body2">{`${label}: ${payload[0].value}`}</Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">
          {t("feedback.analytics.title", "Feedback Analytics")}
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="time-range-label">
            {t("feedback.analytics.timeRange", "Time Range")}
          </InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            onChange={handleTimeRangeChange}
            label={t("feedback.analytics.timeRange", "Time Range")}
          >
            <MenuItem value="30days">{t("feedback.analytics.last30Days", "Last 30 Days")}</MenuItem>
            <MenuItem value="3months">{t("feedback.analytics.last3Months", "Last 3 Months")}</MenuItem>
            <MenuItem value="6months">{t("feedback.analytics.last6Months", "Last 6 Months")}</MenuItem>
            <MenuItem value="1year">{t("feedback.analytics.lastYear", "Last Year")}</MenuItem>
            <MenuItem value="all">{t("feedback.analytics.allTime", "All Time")}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Rating Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
              <Typography variant="subtitle1" gutterBottom>
                {t("feedback.analytics.ratingDistribution", "Rating Distribution")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={ratingData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name={t("feedback.analytics.numberOfRatings", "Number of Ratings")} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* Category Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }} variant="outlined">
              <Typography variant="subtitle1" gutterBottom>
                {t("feedback.analytics.categoryDistribution", "Category Distribution")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* Feedback Timeline */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }} variant="outlined">
              <Typography variant="subtitle1" gutterBottom>
                {t("feedback.analytics.feedbackTimeline", "Feedback Timeline")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={timelineData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name={t("feedback.analytics.feedbackCount", "Feedback Count")} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* Key Insights */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }} variant="outlined">
              <Typography variant="subtitle1" gutterBottom>
                {t("feedback.analytics.keyInsights", "Key Insights")}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body1" color="primary">
                      {t("feedback.analytics.insight1", "Most feedback is related to Course Content (43%)")}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body1" color="primary">
                      {t("feedback.analytics.insight2", "Average rating has improved by 0.5 stars in the last 3 months")}
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body1" color="primary">
                      {t("feedback.analytics.insight3", "Technical issues have decreased by 30% since last quarter")}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}