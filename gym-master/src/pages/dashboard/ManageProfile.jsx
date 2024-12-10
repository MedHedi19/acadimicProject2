import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Grid, Avatar, Box, Paper } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

function ManageProfile() {
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        phoneNumber: '',
        image: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    // Fetch user's current information
    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/getPersonalInfo', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setUserInfo(response.data);
                setIsLoading(false);
            } catch (error) {
                toast.error("Error fetching profile information");
                setIsLoading(false);
            }
        };
        fetchPersonalInfo();
    }, [token]);

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put('http://localhost:5000/api/auth/editPersonalInfo', userInfo, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            toast.success("Profile updated successfully");
            setUserInfo(response.data);
        } catch (error) {
            toast.error("Error updating profile");
        }
    };

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper sx={{ padding: 3, width: '100%', maxWidth: 600, boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom align="center">Edit Profile</Typography>

                {/* Profile Image Preview */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Avatar
                        alt="Profile Picture"
                        src={userInfo.image}
                        sx={{ width: 120, height: 120, borderRadius: '50%' }}
                    />
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Username */}
                        <Grid item xs={12}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                name="username"
                                value={userInfo.username}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                name="email"
                                type="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Phone Number */}
                        <Grid item xs={12}>
                            <TextField
                                label="Phone Number"
                                variant="outlined"
                                fullWidth
                                name="phoneNumber"
                                value={userInfo.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Profile Image URL */}
                        <Grid item xs={12}>
                            <TextField
                                label="Profile Image URL"
                                variant="outlined"
                                fullWidth
                                name="image"
                                value={userInfo.image}
                                onChange={handleChange}
                                helperText="Enter the URL of your new profile image"
                            />
                        </Grid>

                        {/* Save Changes Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ py: 1 }}
                            >
                                Save Changes
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}

export default ManageProfile;
