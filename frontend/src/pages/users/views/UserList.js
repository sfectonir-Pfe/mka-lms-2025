import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  CircularProgress,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  Container,
  Chip
} from "@mui/material";
import {
  Visibility,
  Delete,
  Add,
  Edit,
  Refresh
} from "@mui/icons-material";
import axios from "axios";
import { toast } from 'react-toastify';

// ============================
// DESIGN CONFIGURATION
// ============================
const designConfig = {
  primaryColor: '#1976d2',
  secondaryColor: '#ff4081',
  borderRadius: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  headerHeight: 60,
  rowHeight: 70,
};

// Custom Toolbar
function CustomToolbar({ refreshData }) {
  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <Tooltip title="Refresh">
        <IconButton onClick={refreshData}>
          <Refresh />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function UserList() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log("Fetching users from API...");
      const response = await axios.get("http://localhost:8000/users");
      console.log("API response:", response);

      const data = response.data?.data || response.data;
      console.log("Processed data:", data);

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch users.");
      console.error("Fetch error:", error);
      console.error("Error details:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log("Deleting user with ID:", userToDelete.id);
      await axios.delete(`http://localhost:8000/users/${userToDelete.id}`);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error("Delete error:", error);
      console.error("Error details:", error.response?.data || error.message);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const columns = [
    {
      field: 'email',
      headerName: 'Email',
      width: 300,
      renderCell: (params) => (
        <Typography variant="body1" noWrap>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 200,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'admin' ? 'primary' : 'default'}
          variant="outlined"
          sx={{
            borderRadius: 1,
            textTransform: 'capitalize'
          }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View profile">
            <IconButton
              color="primary"
              onClick={() => navigate(`/ProfilePage/${params.row.id}`)}
              sx={{
                bgcolor: theme.palette.primary.light,
                '&:hover': { bgcolor: theme.palette.primary.main }
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit user">
            <IconButton
              color="primary"
              onClick={() => {
                console.log("Navigating to edit profile with user:", params.row);
                // Stocker temporairement l'utilisateur à éditer dans sessionStorage
                sessionStorage.setItem("editingUser", JSON.stringify(params.row));
                navigate(`/EditProfile/${params.row.email}`);
              }}
              sx={{
                bgcolor: theme.palette.primary.light,
                '&:hover': { bgcolor: theme.palette.primary.main }
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete user">
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row)}
              sx={{
                bgcolor: theme.palette.error.light,
                '&:hover': { bgcolor: theme.palette.error.main }
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: designConfig.borderRadius }
          }
        }}
      >
        <DialogTitle>
          Confirm Delete
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete {userToDelete?.email}?
          </Typography>
        </DialogTitle>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 20 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: 20 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: designConfig.borderRadius,
          boxShadow: designConfig.boxShadow
        }}
      >
        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${designConfig.primaryColor} 30%, ${designConfig.secondaryColor} 90%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Liste des utilisateurs
          </Typography>

          <Button
            component={Link}
            to="add"
            variant="contained"
            startIcon={<Add />}
            sx={{
              borderRadius: 20,
              px: 4,
              bgcolor: designConfig.primaryColor,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${designConfig.primaryColor}4D`
              },
              transition: 'all 0.3s ease'
            }}
          >
            Add User
          </Button>
        </Box>

        {/* Data Grid */}
        {loading ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300
          }}>
            <CircularProgress size={60} />
          </Box>
        ) : users.length === 0 ? (
          <Box sx={{
            textAlign: 'center',
            py: 8,
            border: `1px dashed ${theme.palette.divider}`,
            borderRadius: designConfig.borderRadius
          }}>
            <Typography variant="h6" gutterBottom>
              No users found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Click "Add User" to create a new user
            </Typography>
            <Button
              onClick={fetchUsers}
              variant="outlined"
              startIcon={<Refresh />}
            >
              Refresh
            </Button>
          </Box>
        ) : (
          <Box sx={{
            height: 600,
            width: '100%',
            '& .MuiDataGrid-root': {
              border: 'none',
              borderRadius: designConfig.borderRadius,
            },
            '& .MuiDataGrid-columnHeaders': {
              bgcolor: theme.palette.background.default,
              height: designConfig.headerHeight,
            },
            '& .MuiDataGrid-row': {
              height: designConfig.rowHeight,
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            },
          }}>
            <DataGrid
              rows={users}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: {
                  refreshData: fetchUsers,
                },
              }}
              sx={{
                '& .MuiDataGrid-cell': {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
}