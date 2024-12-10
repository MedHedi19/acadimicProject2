import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { notifySuccess, notifyError } from '../../utils/notification';
import { Box, TextField, Select, MenuItem, Button, Typography, FormControl, InputLabel, OutlinedInput, Chip, CircularProgress } from '@mui/material';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('Public');
    const [targetUsers, setTargetUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false); // Loading state for users
    const [loadingPost, setLoadingPost] = useState(false); // Loading state for post submission

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true); // Set loading to true when fetching users
        try {
            const response = await axios.get('http://localhost:5000/api/auth/getClient', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            notifyError('Failed to fetch users');
        } finally {
            setLoadingUsers(false); // Set loading to false after fetching is done
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingPost(true); // Set loading to true when submitting the post
        try {
            const postData = {
                title,
                content,
                type,
                targetUsers: type === 'Targeted' ? targetUsers : [],
            };
            console.log(postData);
            await axios.post('http://localhost:5000/api/post/createPost', postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            notifySuccess('Post created successfully');
            setTitle('');
            setContent('');
            setType('Public');
            setTargetUsers([]);
        } catch (error) {
            console.log(error);
            notifyError('Failed to create post');
        } finally {
            setLoadingPost(false); // Set loading to false after submission
        }
    };

    const handleToggleUser = (userId) => {
        setTargetUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    return (
        <Box sx={{ maxWidth: '600px', margin: '0 auto', padding: '20px', boxShadow: 3, borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" align="center" gutterBottom>Create a New Post</Typography>
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        variant="outlined"
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        variant="outlined"
                        multiline
                        rows={4}
                        required
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="post-type-label">Post Type</InputLabel>
                    <Select
                        labelId="post-type-label"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        input={<OutlinedInput label="Post Type" />}
                    >
                        <MenuItem value="Public">Public</MenuItem>
                        <MenuItem value="Targeted">Targeted</MenuItem>
                    </Select>
                </FormControl>

                {type === 'Targeted' && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="target-users-label">Target Users</InputLabel>
                        <Select
                            labelId="target-users-label"
                            multiple
                            value={targetUsers}
                            onChange={(e) => setTargetUsers(e.target.value)}
                            input={<OutlinedInput id="select-multiple-chip" label="Target Users" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip
                                            key={value}
                                            label={users.find(user => user._id === value)?.username || value}
                                            onDelete={() => handleToggleUser(value)}
                                            clickable
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {users.map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {/* Show loading spinner when either users are being fetched or post is being submitted */}
                {(loadingUsers || loadingPost) && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <CircularProgress />
                    </Box>
                )}

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: '20px' }} disabled={loadingPost}>
                    {loadingPost ? 'Creating Post...' : 'Create Post'}
                </Button>
            </form>
        </Box>
    );
}

export default CreatePost;
