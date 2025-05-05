import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/users/me`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Ensure response matches your user schema
    if (!response.data.user) {
      throw new Error('Invalid user data received');
    }
    
    return {
      ...response.data.user,
      // Ensure computed fields are included
      fullName: `${response.data.user.firstName || ''} ${response.data.user.lastName || ''}`.trim(),
      initials: `${response.data.user.firstName?.[0] || ''}${response.data.user.lastName?.[0] || ''}`.toUpperCase(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Profile update error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};