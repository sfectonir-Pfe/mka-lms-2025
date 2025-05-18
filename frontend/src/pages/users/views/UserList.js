import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/auth");
      const data = response.data?.data || response.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch users.");
      setUsers([]);
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
      await axios.delete(`http://localhost:8000/auth/users/${userToDelete.id}`);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      toast.success("User deleted!");
    } catch (error) {
      toast.error("Failed to delete user.");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const columns = [
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Rôle', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 350,
      renderCell: (params) => (
        <div>
          <Button
            component={Link}
            to={`/ProfilePage/${params.row.id}`}
            variant="contained"
            size="small"
            sx={{ mx: 1 }}
            startIcon={<VisibilityIcon />}
          >
          </Button>
          <Button
            component={Link}
            to={`/EditProfile/${params.row.email}`}
            variant="contained"
            size="small"
            color="primary"
            sx={{ mx: 1 }}
            startIcon={<EditIcon />}
          >
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row)}
          >
            <Grid size={8}>
              <DeleteIcon />

            </Grid>
          </Button>
        </div>
      ),
    }

  ];

  return (
    <div className="container mt-5">
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete {userToDelete?.email}?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <h2>Liste des utilisateurs</h2>
        <Button component={Link} to="add" variant="contained" color="primary">
          <AddIcon />
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : users.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>No users found.</Box>
      ) : (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection={false}
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </div>
  );
}