import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Avatar, Grid, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { notifySuccess } from '../utils/notification';
import { logout } from '../auth/authActions';

const PostCard = styled(Card)({
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
});

const PostTitle = styled(Typography)({
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#333',
});

const PostContent = styled(Typography)({
    color: '#555',
    lineHeight: 1.6,
    marginBottom: '1rem',
});

const UserInfo = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
});

const UserAvatar = styled(Avatar)({
    width: 40,
    height: 40,
    marginRight: '10px',
});

function Forum() {
    const [posts, setPosts] = useState([]);
    const [userPhotos, setUserPhotos] = useState({});
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                photos[userId] = response.data.image || 'default-avatar.jpg'; // Set photo or default
            } catch (error) {
                console.error('Error fetching user photo:', error);
            }
        }
        setUserPhotos(photos); // Update state with all fetched photos
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        notifySuccess('Logged out successfully');
    };

    return (
        <div style={{ padding: '20px' }}>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                style={{ marginBottom: '20px' }}
            >
                Logout
            </Button>

            <Typography variant="h4" align="center" gutterBottom>
                Forum Posts
            </Typography>

            {/* Displaying posts in a responsive grid */}
            <Grid container spacing={3} justifyContent="center">
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post._id}>
                        <PostCard>
                            <CardContent>
                                {/* User Info Section */}
                                <UserInfo>
                                    <UserAvatar
                                        alt={post.createdBy.username}
                                        src={userPhotos[post.createdBy._id] || 'default-avatar.jpg'} // Use user photo from state
                                    />
                                    <div>
                                        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                            {post.createdBy.username}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </div>
                                </UserInfo>

                                {/* Post Title */}
                                <PostTitle>{post.title}</PostTitle>

                                {/* Post Content */}
                                <PostContent>{post.content}</PostContent>
                            </CardContent>
                        </PostCard>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Forum;
