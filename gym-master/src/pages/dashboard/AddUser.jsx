import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Grid,
    Paper,
    CircularProgress,
} from '@mui/material';
import { notifySuccess, notifyError, notifyInfo } from "../../utils/notification";

function AddUser({ isOwner }) {
    const token = localStorage.getItem('token');

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);


    const roles = isOwner
        ? ["Coach", "Administration", "IT-Support", "Worker", "Client", "Owner"]
        : ["Coach", "Administration", "IT-Support", "Worker", "Client"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "username") setUsername(value);
        if (name === "email") setEmail(value);
        if (name === "phoneNumber") setPhoneNumber(value);
        if (name === "password") setPassword(value);
        if (name === "role") setRole(value);
        if (name === "image") setImage(value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !phoneNumber || !password || !role || !image) {
            notifyError("All fields are required");
            return;
        }


        setLoading(true); // Set loading to true when submitting

        const userData = {
            username,
            email,
            phoneNumber,
            password,
            role,
            image
        };

        try {
            const response = await axios.post('http://localhost:5000/api/auth/addUser', userData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
                notifySuccess("User added successfully");

                if (response.data.role !== "Client" && response.data.staffID) {
                    notifyInfo(`Staff ID: ${response.data.staffID}`);
                }

                setUsername('');
                setEmail('');
                setPhoneNumber('');
                setPassword('');
                setRole('');
                setImage('');
            }
        } catch (error) {
            notifyError(error.response?.data || "An error occurred while adding the user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom>
                Add New User
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={username}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Role"
                            name="role"
                            value={role}
                            onChange={handleChange}
                            required
                        >
                            {roles.map((role) => (
                                <MenuItem key={role} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Image URL"
                            name="image"
                            value={image}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading} // Disable the button while loading
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" /> // Loader when submitting
                            ) : (
                                "Add User"
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}

export default AddUser;
