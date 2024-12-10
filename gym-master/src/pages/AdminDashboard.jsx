import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { logout } from '../auth/authActions'; // Adjust import based on your structure
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText, Typography, Container } from '@mui/material';
import AdherentsList from './AdherentsList';
import StaffList from './dashboard/StaffList';
import AddUser from './dashboard/AddUser';
import ManageProfile from './dashboard/ManageProfile';
import CreatePost from './dashboard/CreatePost';
import ConsultForum from './dashboard/ConsultForum';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("createPost");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const token = localStorage.getItem('token');
    const decodedToken = token ? jwtDecode(token) : null;
    const isOwner = decodedToken?.role;
    const notifySuccess = (message) => {
        toast.success(message, {
            position: 'top-left',
            autoClose: 1500,
            closeOnClick: true,
        });
    };

    const handleSectionToggle = (section) => {
        setActiveSection(section);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        notifySuccess('Logged out successfully');
    };

    const sections = [
        { key: 'getClients', label: 'Consulte The Adherents' },
        { key: 'getStaff', label: 'Consulte The Staff', ownerOnly: true },
        { key: 'addUser', label: 'Add User' },
        { key: 'editProfile', label: 'Edit Profile' },
        { key: 'createPost', label: 'Create Post' },
        { key: 'consultForum', label: 'Consult The Forum' },
    ];

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        bgcolor: '#16293D ',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            textAlign: 'center',
                            py: 2,
                            bgcolor: '#204162',
                            borderBottom: '1px solid #A5B0C9',
                        }}
                    >
                        Administration
                    </Typography>
                    <List>
                        {sections.map(
                            (section) =>
                                (!section.ownerOnly || isOwner === "Owner") && (
                                    <ListItem
                                        button
                                        key={section.key}
                                        onClick={() => handleSectionToggle(section.key)}
                                        sx={{
                                            bgcolor: activeSection === section.key ? '#A5B0C9' : 'inherit', // Slightly darker active background
                                            color: activeSection === section.key ? '#204162 ' : 'white', // White text for active
                                            '&:hover': {
                                                bgcolor: '#8896B6',
                                                color: '#fff',
                                            },
                                        }}
                                    >
                                        <ListItemText primary={section.label} />
                                    </ListItem>
                                )
                        )}
                    </List>
                </Box>
                <List>
                    <ListItem
                        button
                        onClick={handleLogout}
                        sx={{
                            bgcolor: '#FF6B6B', // Softer red for logout button
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#FF5252',
                            },
                        }}
                    >
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: '#EAEFF5', // Neutral background for the content area
                    padding: 3,
                    overflowY: 'auto',
                }}
            >
                <Container>
                    {isOwner === "Owner" && activeSection === 'getStaff' && <StaffList />}
                    {activeSection === 'getClients' && <AdherentsList />}
                    {activeSection === 'addUser' && <AddUser isOwner={isOwner} />}
                    {activeSection === 'editProfile' && <ManageProfile />}
                    {activeSection === 'createPost' && <CreatePost />}
                    {activeSection === 'consultForum' && <ConsultForum />}
                </Container>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
