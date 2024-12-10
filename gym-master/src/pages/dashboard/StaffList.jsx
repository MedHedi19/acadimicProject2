import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { notifySuccess, notifyError } from "../../utils/notification";
function StaffList() {
    const [staffUsers, setStaffUsers] = useState([]);
    const token = localStorage.getItem('token');

    console.log(token)

    useEffect(() => {
        fetchStaffUsers();
    }, []);

    const fetchStaffUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/getStaff', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setStaffUsers(response.data);
        } catch (error) {
            notifyError("Error fetching staff users");
        }
    };

    const handleDelete = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return; // If user cancels, exit function

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
            <Typography variant="h6" gutterBottom>Staff Users List</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.staffID}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
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

export default StaffList;
