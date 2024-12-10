import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdherentsList() {
    const [staffUsers, setStaffUsers] = useState([]);
    const token = localStorage.getItem('token');

    // Notification functions
    const notifySuccess = (message) => {
        toast.success(message, {
            position: "top-center",
            autoClose: 1500,
            closeOnClick: true,
        });
    };

    const notifyError = (message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 1500,
            closeOnClick: true,
        });
    };

    // Fetch users on component mount
    useEffect(() => {
        fetchStaffUsers();
    }, []);

    const fetchStaffUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/getClient', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setStaffUsers(response.data);
        } catch (error) {
            notifyError("Error fetching staff users");
        }
    };

    // Handle delete with confirmation
    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/auth/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            notifySuccess("User deleted successfully");
            fetchStaffUsers(); // Re-fetch the list after deletion
        } catch (error) {
            notifyError("Error deleting the user");
        }
    };

    return (
        <>
            <Typography variant="h6" gutterBottom>Adherents List</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>
                                    <Button
                                        style={{ backgroundColor: "#204162" }}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default AdherentsList;
