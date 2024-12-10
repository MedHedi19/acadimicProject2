import React, { useEffect, useState } from 'react';
import { Button, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Typography, Container, Paper, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login, staffLogin } from '../auth/authActions';
import { useNavigate } from 'react-router-dom';
import { notifySuccess, notifyError } from '../utils/notification';  // Import the notification functions
import { jwtDecode } from 'jwt-decode';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userType, setUserType] = useState('adherent');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [staffID, setStaffID] = useState('');
    const [loading, setLoading] = useState(false);

    // const token = localStorage.getItem('token');
    // const decodedToken = token ? jwtDecode(token) : null;
    // const role = decodedToken?.role;
    // useEffect(() => {
    //     if (role === "Client") {
    //         navigate('/forum');
    //     } else {
    //         navigate('/adminDashboard');

    //     }
    // }, [navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Set loading to true to show spinner

        if (userType === 'adherent') {
            try {
                const response = await dispatch(login(username, password));

                if (response && response.type === 'LOGIN_SUCCESS') {
                    notifySuccess('Welcome');
                    navigate('/forum');
                } else {
                    notifyError('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.log(error);
                notifyError(error.response ? error.response.data : error.message);
            }
        } else {
            try {
                const response = await dispatch(staffLogin(staffID, password));

                if (response && response.type === 'LOGIN_SUCCESS') {
                    notifySuccess('Welcome');
                    navigate('/adminDashboard');
                } else {
                    notifyError('Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.log(error);
                notifyError(error.response ? error.response.data : error.message);
            }
        }

        setLoading(false);  // Set loading to false after request is done
    };

    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: '200px', marginBottom: '150px' }}>
            <Paper sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Welcome to the Gym Portal
                </Typography>

                {/* User Type Selection */}
                <FormControl component="fieldset" sx={{ marginBottom: 4 }}>
                    <RadioGroup
                        row
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        aria-label="user-type"
                    >
                        <FormControlLabel value="adherent" control={<Radio />} label="Adherent" />
                        <FormControlLabel value="gymStaff" control={<Radio />} label="Gym Staff" />
                    </RadioGroup>
                </FormControl>

                {/* Login Form */}
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    {/* Username or Staff ID */}
                    {userType === 'adherent' ? (
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    ) : (
                        <TextField
                            label="Staff ID"
                            fullWidth
                            margin="normal"
                            value={staffID}
                            onChange={(e) => setStaffID(e.target.value)}
                            required
                        />
                    )}

                    {/* Password Input */}
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                        disabled={loading}  // Disable the button while loading
                    >
                        {loading ? (
                            <CircularProgress size={24} color="secondary" />
                        ) : (
                            'Login'
                        )}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default Login;
