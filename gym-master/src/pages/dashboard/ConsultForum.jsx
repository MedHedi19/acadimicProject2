import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Avatar, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { notifySuccess } from '../../utils/notification';

function ConsultForum() {
    const [posts, setPosts] = useState([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [userPhotos, setUserPhotos] = useState({});  // Store user photos in a state

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/post/getPosts', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setPosts(response.data);

            // Fetch user photos for each post's creator
            const userIds = response.data.map(post => post.createdBy._id);
            fetchUserPhotos(userIds);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Fetch user photos for all user IDs
    const fetchUserPhotos = async (userIds) => {
        const photos = {};
        for (const userId of userIds) {
            try {
                const response = await axios.get(`http://localhost:5000/api/auth/getUserById/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                photos[userId] = response.data.image || 'default-avatar.jpg';
            } catch (error) {
                console.error('Error fetching user photo:', error);
            }
        }
        setUserPhotos(photos);  // Update state with all fetched photos
    };

    const handleDeletePost = async () => {
        console.log(postToDelete._id)
        try {
            const response = await axios.delete(`http://localhost:5000/api/post/deletePost/${postToDelete._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // Refresh the posts list after deletion
            setPosts(posts.filter((post) => post._id !== postToDelete._id));
            setOpenConfirmDialog(false);
            notifySuccess('Post deleted successfully');
        } catch (error) {
            console.error('Error deleting post:', error);
            notifyError('Failed to delete post');
        }
    };

    const openDeleteDialog = (post) => {
        setPostToDelete(post);
        setOpenConfirmDialog(true);
    };

    const closeDeleteDialog = () => {
        setOpenConfirmDialog(false);
        setPostToDelete(null);
    };

    return (
        <>
            <Grid container spacing={3} justifyContent="center">
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post._id}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardContent>
                                {/* Owner's Name and Photo */}
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar
                                        alt={post.createdBy.username}
                                        src={userPhotos[post.createdBy._id] || 'default-avatar.jpg'} // Use user photo from state
                                        sx={{ width: 40, height: 40, mr: 2 }}
                                    />
                                    <Typography variant="h6">
                                        {post.createdBy.username}
                                    </Typography>

                                    {/* Delete button (X icon) */}
                                    <IconButton
                                        onClick={() => openDeleteDialog(post)}
                                        sx={{ marginLeft: 'auto' }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>

                                {/* Post Title */}
                                <Typography variant="h5" gutterBottom>
                                    {post.title}
                                </Typography>

                                <Typography variant="body1" color="text.secondary">
                                    {post.content}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openConfirmDialog} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this post?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeletePost} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ConsultForum;
