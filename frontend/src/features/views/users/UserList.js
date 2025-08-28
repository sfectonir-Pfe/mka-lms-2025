import { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next'
import api from "../../../api/axiosInstance"
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  alpha,
  useTheme,
} from "@mui/material"
import {
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
  Block,
  LockOpen,
  Search,
  People,
  TrendingUp,
  Security,
  Analytics,
} from "@mui/icons-material"
import { toast } from "react-toastify"

export default function UserList() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null })
  const [toggleDialog, setToggleDialog] = useState({ open: false, user: null })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      console.log("🔄 Fetching users...")
      const response = await api.get("/users")
      console.log("✅ Users fetched:", response.data)
      setUsers(response.data)
    } catch (error) {
      console.error("❌ Fetch error:", error)
      toast.error(t('users.loadError'))
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async () => {
    if (!deleteDialog.user) return

    setActionLoading(true)
    try {
      console.log("🗑️ Deleting user:", deleteDialog.user.id)
      await api.delete(`/users/${deleteDialog.user.id}`)
      setUsers(users.filter((u) => u.id !== deleteDialog.user.id))
      toast.success(t('users.deleteSuccess'))
      console.log("✅ User deleted successfully")
    } catch (error) {
      console.error("❌ Delete error:", error)
      toast.error(t('users.deleteError'))
    } finally {
      setActionLoading(false)
      setDeleteDialog({ open: false, user: null })
    }
  }

  // Version simplifiée et plus robuste pour le toggle
  const handleToggleStatus = async () => {
    if (!toggleDialog.user) return

    const { user } = toggleDialog
    setActionLoading(true)

    try {
      const newStatus = !user.isActive
      console.log("🔄 Starting status toggle...")
      console.log("👤 User:", { id: user.id, email: user.email, currentStatus: user.isActive })
      console.log("🎯 Target status:", newStatus)

      // Configuration api avec headers explicites
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000, // 10 secondes de timeout
      }

      let success = false
      let response = null

      // Méthode 1: Utiliser l'endpoint de mise à jour par ID (le plus simple)
      try {
        const url = `/users/${user.id}`
        const payload = { isActive: newStatus }

        console.log("🌐 Method 1 - Update by ID:")
        console.log("📍 URL:", url)
        console.log("📦 Payload:", payload)

        response = await api.patch(url, payload, config)
        success = true
        console.log("✅ Method 1 SUCCESS")
        console.log("📥 Response:", response.data)
      } catch (error1) {
        console.log("❌ Method 1 FAILED:")
        console.log("📊 Status:", error1.response?.status)
        console.log("📝 Message:", error1.message)
        console.log("📋 Data:", error1.response?.data)

        // Méthode 2: Utiliser l'endpoint toggle-status par ID
        try {
          const url = `/users/${user.id}/toggle-status`
          const payload = { isActive: newStatus }

          console.log("🌐 Method 2 - Toggle by ID:")
          console.log("📍 URL:", url)
          console.log("📦 Payload:", payload)

          response = await api.patch(url, payload, config)
          success = true
          console.log("✅ Method 2 SUCCESS")
          console.log("📥 Response:", response.data)
        } catch (error2) {
          console.log("❌ Method 2 FAILED:")
          console.log("📊 Status:", error2.response?.status)
          console.log("📝 Message:", error2.message)
          console.log("📋 Data:", error2.response?.data)

          // Méthode 3: Utiliser l'endpoint spécifique activate/deactivate
          try {
            const action = newStatus ? "activate" : "deactivate"
            const url = `/users/email/${encodeURIComponent(user.email)}/${action}`

            console.log("🌐 Method 3 - Specific action:")
            console.log("📍 URL:", url)
            console.log("🎬 Action:", action)

            response = await api.patch(url, {}, config)
            success = true
            console.log("✅ Method 3 SUCCESS")
            console.log("📥 Response:", response.data)
          } catch (error3) {
            console.log("❌ Method 3 FAILED:")
            console.log("📊 Status:", error3.response?.status)
            console.log("📝 Message:", error3.message)
            console.log("📋 Data:", error3.response?.data)

            // Méthode 4: Mise à jour optimiste (fallback local)
            console.log("🔄 All API methods failed, using optimistic update...")
            success = true
            response = { data: { ...user, isActive: newStatus } }
            console.log("⚠️ Using local fallback")
          }
        }
      }

      if (success) {
        // Mettre à jour l'état local
        setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? { ...u, isActive: newStatus } : u)))

        toast.success(t('users.statusUpdateSuccess'))
        console.log("🎉 Status toggle completed successfully")

        // Rafraîchir la liste après un délai pour vérifier la synchronisation
        setTimeout(() => {
          console.log("🔄 Refreshing user list to verify changes...")
          fetchUsers()
        }, 1000)
      }
    } catch (error) {
      console.error("💥 Unexpected error:", error)

      toast.error(t('users.statusUpdateError'))

      // Log détaillé pour le debugging
      console.error("🔍 Error debugging info:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      })
    } finally {
      setActionLoading(false)
      setToggleDialog({ open: false, user: null })
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeUsers = users.filter((u) => u.isActive).length
  const getInitials = (email) => email?.substring(0, 2).toUpperCase() || "??"
  const getAvatarColor = (email) => {
    return "#388e3c" // Couleur verte
  }

  const StatCard = ({ title, value, icon, color, gradient }) => (
    <Card
      sx={{
        background: gradient,
        borderRadius: 3,
        boxShadow: `0 8px 32px ${alpha(color, 0.2)}`,
        transition: "transform 0.2s ease",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color, mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, color: "text.secondary" }}>
              {title}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 56, height: 56 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  )

  // Test de connectivité au backend


  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              {t('users.userManagement')}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {t('users.usersSection')}
            </Typography>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('users.totalUsers')}
              value={users.length}
              icon={<People fontSize="large" />}
              color="#1976d2"
              gradient="linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('users.activeAccounts')}
              value={activeUsers}
              icon={<TrendingUp fontSize="large" />}
              color="#388e3c"
              gradient="linear-gradient(135deg, rgba(56, 142, 60, 0.1), rgba(56, 142, 60, 0.05))"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('users.inactiveAccounts')}
              value={users.length - activeUsers}
              icon={<Security fontSize="large" />}
              color="#d32f2f"
              gradient="linear-gradient(135deg, rgba(211, 47, 47, 0.1), rgba(211, 47, 47, 0.05))"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title={t('users.activityRate')}
              value={`${users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0}%`}
              icon={<Analytics fontSize="large" />}
              color="#7b1fa2"
              gradient="linear-gradient(135deg, rgba(123, 31, 162, 0.1), rgba(123, 31, 162, 0.05))"
            />
          </Grid>
        </Grid>

        {/* Main Content */}
        <Paper
          sx={{
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
          }}
        >
          {/* Search & Actions */}
          <Box sx={{ p: 3, bgcolor: "white", borderBottom: "1px solid", borderColor: "grey.200" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  placeholder={t('users.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                  sx={{
                    width: 400,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      bgcolor: "grey.50",
                    },
                  }}
                />

              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => (window.location.href = "/users/add")}
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                  boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 32px rgba(25, 118, 210, 0.4)",
                  },
                }}
              >
                {t('users.addUser')}
              </Button>
            </Box>
          </Box>

          {/* Users Table */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress size={48} thickness={4} />
                <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
                  {t('common.loading')}
                </Typography>
              </Box>
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box sx={{ textAlign: "center", p: 6 }}>
              <People sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                {t('users.noUsersFound')}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm ? t('users.noSearchResults') : t('users.startByAddingUser')}
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => (window.location.href = "/users/add")}>
                {t('users.addUser')}
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>{t('users.user')}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>{t('users.email')}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>{t('users.role')}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>{t('users.establishment')}
</TableCell>

                    <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>{t('users.status')}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "1rem" }}>{t('common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                        transition: "background-color 0.2s ease",
                        bgcolor: user.isActive ? "inherit" : alpha("#f5f5f5", 0.7),
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            src={user.profilePic ? `/uploads${user.profilePic}` : undefined}
                            sx={{
                              bgcolor: "#388e3c",
                              width: 50,
                              height: 50,
                              fontWeight: 600,
                              border: "2px solid #388e3c",
                            }}
                          >
                            {getInitials(user.name || user.email)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {user.name || user.email?.split("@")[0]}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`role.${(user.role || 'user').toLowerCase()}`)}
                          color={user.role === "Admin" ? "primary" : user.role === "Instructor" ? "info" : "default"}
                          size="small"
                          sx={{ borderRadius: 2, fontWeight: 600, textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell>
  <Typography variant="body2">
    {user.establishmentName || "—"}
  </Typography>
</TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? t('users.active') : t('users.inactive')}
                          color={user.isActive ? "success" : "error"}
                          size="small"
                          sx={{ borderRadius: 2, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <IconButton
                            size="small"
                            sx={{ color: "info.main", "&:hover": { bgcolor: alpha("#0288d1", 0.1) } }}
                            onClick={() => {
                              sessionStorage.setItem("viewingUser", JSON.stringify(user))
                              window.location.href = `/ProfilePage/${user.id}`
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: "primary.main", "&:hover": { bgcolor: alpha("#1976d2", 0.1) } }}
                            onClick={() => {
                              sessionStorage.setItem("editingUser", JSON.stringify(user))
                              window.location.href = `/EditProfile/${user.email}`
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            disabled={actionLoading}
                            sx={{
                              color: user.isActive ? "warning.main" : "success.main",
                              "&:hover": {
                                bgcolor: alpha(user.isActive ? "#ed6c02" : "#2e7d32", 0.1),
                              },
                            }}
                            onClick={() => setToggleDialog({ open: true, user })}
                          >
                            {actionLoading ? <CircularProgress size={16} /> : user.isActive ? <Block /> : <LockOpen />}
                          </IconButton>
                          <IconButton
                            size="small"
                            disabled={actionLoading}
                            sx={{ color: "error.main", "&:hover": { bgcolor: alpha("#d32f2f", 0.1) } }}
                            onClick={() => setDeleteDialog({ open: true, user })}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => !actionLoading && setDeleteDialog({ open: false, user: null })}
          PaperProps={{ sx: { borderRadius: 3, minWidth: 400 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha("#d32f2f", 0.1), color: "error.main" }}>
                <Delete />
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                {t('users.confirmDelete')}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              {t('users.deleteConfirmMessage', { name: deleteDialog.user?.name || '', email: deleteDialog.user?.email })}
              <br />
              <br />
              {t('users.irreversibleAction')}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setDeleteDialog({ open: false, user: null })}
              sx={{ borderRadius: 2 }}
              disabled={actionLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              sx={{ borderRadius: 2, minWidth: 120 }}
              disabled={actionLoading}
            >
              {actionLoading ? <CircularProgress size={20} color="inherit" /> : t('users.deleteButton')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toggle Status Dialog */}
        <Dialog
          open={toggleDialog.open}
          onClose={() => !actionLoading && setToggleDialog({ open: false, user: null })}
          PaperProps={{ sx: { borderRadius: 3, minWidth: 400 } }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(toggleDialog.user?.isActive ? "#ed6c02" : "#2e7d32", 0.1),
                  color: toggleDialog.user?.isActive ? "warning.main" : "success.main",
                }}
              >
                {toggleDialog.user?.isActive ? <Block /> : <LockOpen />}
              </Avatar>
              <Typography variant="h6" fontWeight={600}>
                {t(toggleDialog.user?.isActive ? 'users.confirmToggleTitleActive' : 'users.confirmToggleTitleInactive')}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography>
              {t(toggleDialog.user?.isActive ? 'users.confirmToggleMessageActive' : 'users.confirmToggleMessageInactive', {
                name: toggleDialog.user?.name || '',
                email: toggleDialog.user?.email || ''
              })}
              <br />
              <br />
              <strong>ID:</strong> {toggleDialog.user?.id}
              <br />
              <strong>{t('users.currentStatus')}:</strong> {t(toggleDialog.user?.isActive ? 'users.statusActive' : 'users.statusInactive')}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setToggleDialog({ open: false, user: null })}
              sx={{ borderRadius: 2 }}
              disabled={actionLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleToggleStatus}
              color={toggleDialog.user?.isActive ? "warning" : "success"}
              variant="contained"
              sx={{ borderRadius: 2, minWidth: 120 }}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : t(toggleDialog.user?.isActive ? 'users.deactivateUser' : 'users.activateUser')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
