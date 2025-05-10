import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (location.state?.userAdded) {
      fetchUsers();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/auth");
      console.log("Full API Response:", response); // Debug log
      
      // Ensure proper data structure
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        console.error("Unexpected data format:", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (row) => {
    try {
      await axios.delete(`http://localhost:8000/auth/users/${row.id}`);
      setUsers(users.filter(user => user.id !== row.id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Rôle', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <Link to={`edit/${params.row.id}`} className="btn btn-primary btn-sm mx-1">Edit</Link>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(params.row)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des utilisateurs</h2>
        <Link to="add" className="btn btn-primary">
          Ajouter un utilisateur
        </Link>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.id}
            showToolbar
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </div>
  );
}