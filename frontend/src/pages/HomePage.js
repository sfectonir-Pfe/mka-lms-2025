import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  
  useTheme,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const theme = useTheme();

  const topFormations = [
    { name: "Dév Web Fullstack", participants: 180 },
    { name: "Python pour débutants", participants: 165 },
    { name: "React Avancé", participants: 140 },
    { name: "Gestion de projet", participants: 122 },
    { name: "Data Science Intro", participants: 119 },
  ];

  const topFormateurs = [
    { name: "Mahdi Trabelsi", rating: 4.9, comment: "pédagogique" },
    { name: "Salma Bouguerra", rating: 4.7, comment: "claire et cool" },
    { name: "Walid Laâroussi", rating: 4.6, comment: "dynamique" },
  ];

  const topEtablissements = [
    { name: "ISET Rades", count: 210 },
    { name: "IHEC Carthage", count: 150 },
    { name: "ENIT", count: 140 },
    { name: "ISG Tunis", count: 120 },
    { name: "INSAT", count: 120 },
  ];

  const stats = [
    { label: t('dashboard.participants'), value: 1245 },
    { label: t('dashboard.participationsThisMonth'), value: 342 },
    { label: t('dashboard.formations'), value: 38 },
    { label: t('dashboard.instructors'), value: 14 },
  ];

  const monthlyData = [
    { month: "Jan", value: 180 },
    { month: "Feb", value: 145 },
    { month: "Mar", value: 200 },
    { month: "Apr", value: 162 },
    { month: "May", value: 342 },
    { month: "Jun", value: 260 },
    { month: "Jul", value: 300 },
    { month: "Aug", value: 280 },
    { month: "Sep", value: 240 },
  ];

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {t('dashboard.adminDashboard')}
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              elevation={3}
              sx={{ borderRadius: 3, transition: "0.3s", '&:hover': { boxShadow: 6 } }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('dashboard.topFormations')}
              </Typography>
              {topFormations.map((f, i) => (
                <Box key={i} mb={2}>
                  <Typography fontWeight={500}>{f.name}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(f.participants / 180) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: theme.palette.grey[300],
                      '& .MuiLinearProgress-bar': { backgroundColor: theme.palette.primary.main },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {f.participants} {t('dashboard.students')}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('dashboard.monthlyParticipation')}
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {t('dashboard.topInstructors')}
                  </Typography>
                  {topFormateurs.map((f, i) => (
                    <Box
                      key={i}
                      display="flex"
                      alignItems="center"
                      my={2}
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        '&:hover': { backgroundColor: theme.palette.action.hover },
                        transition: "0.3s",
                      }}
                    >
                      <Avatar sx={{ mr: 2 }} />
                      <Box>
                        <Typography fontWeight={600}>{f.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ★ {f.rating} – {f.comment}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {t('dashboard.topPartnerInstitutions')}
                  </Typography>
                  {topEtablissements.map((e, i) => (
                    <Box
                      key={i}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={1.2}
                      sx={{
                        px: 1,
                        borderRadius: 2,
                        '&:hover': { backgroundColor: theme.palette.action.hover },
                        transition: "0.3s",
                      }}
                    >
                      <Typography>{e.name}</Typography>
                      <Typography fontWeight="bold">{e.count}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
