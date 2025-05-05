import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Chip,
  Autocomplete
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';

const UserAvatar = ({ user, previewImage }) => {
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (previewImage) {
      setImgSrc(previewImage);
    } else if (user?.photo) {
      setImgSrc(`${user.photo.split('?')[0]}?v=${Date.now()}`);
    } else {
      setImgSrc('');
    }
  }, [user?.photo, previewImage]);

  return (
    <Avatar
      sx={{
        width: 100,
        height: 100,
        bgcolor: "#f5f5f5",
        color: "#1565c0",
        fontSize: "40px",
        mb: 2
      }}
      src={imgSrc || undefined}
      onError={() => setImgSrc('')}
    >
      {!imgSrc && user?.firstName ? 
        `${user.firstName.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase() || ''}` 
        : null}
    </Avatar>
  );
};

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [skillProfileMode, setSkillProfileMode] = useState(false);
  const [skillFormData, setSkillFormData] = useState({
    bio: '',
    education: '',
    linkedin: '',
    github: '',
    portfolio: '',
    skills: [],
    newSkill: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobile: user.mobile || ''
      });
      if (user.photo) {
        setPhotoPreview(`${user.photo.split('?')[0]}?v=${Date.now()}`);
      }
      if (user.skillProfile) {
        setSkillFormData({
          bio: user.skillProfile.bio || '',
          education: user.skillProfile.education || '',
          linkedin: user.skillProfile.linkedin || '',
          github: user.skillProfile.github || '',
          portfolio: user.skillProfile.portfolio || '',
          skills: user.skillProfile.skills || [],
          newSkill: ''
        });
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Profile photo must be less than 2MB');
      return;
    }

    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setProfilePhoto(file);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return;
    }
  
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      setError('Mobile number must be 10 digits');
      return;
    }
  
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile', formData.mobile);
      
      if (profilePhoto) {
        formDataToSend.append('photo', profilePhoto);
      }

      const response = await axios.put(
        'http://localhost:5000/api/users/update',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.message || 'Update failed');
      }
  
      const updatedUser = {
        ...response.data.user,
        photo: response.data.user.photo 
          ? `${response.data.user.photo.split('?')[0]}?updated=${Date.now()}`
          : null
      };
      
      updateUser(updatedUser);
      setPhotoPreview(updatedUser.photo || '');
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      setProfilePhoto(null);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setPhotoPreview(user.photo || '');
    setProfilePhoto(null);
    setError('');
  };

  const handleSkillProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/skill-profile',
        {
          bio: skillFormData.bio,
          education: skillFormData.education,
          linkedin: skillFormData.linkedin,
          github: skillFormData.github,
          portfolio: skillFormData.portfolio,
          skills: skillFormData.skills
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to save skill profile');
      }

      updateUser({
        ...user,
        skillProfile: response.data.skillProfile
      });

      setSuccess('Skill profile updated successfully!');
      setSkillProfileMode(false);
    } catch (err) {
      console.error('Skill profile error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update skill profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setSkillFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillFormData.newSkill.trim() && !skillFormData.skills.includes(skillFormData.newSkill.trim())) {
      setSkillFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && skillFormData.newSkill.trim()) {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleLogout = () => {
    setPhotoPreview('');
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, position: 'relative' }}>
          <UserAvatar user={user} previewImage={photoPreview} />

          {editMode && (
            <>
              <IconButton
                color="primary"
                onClick={triggerFileInput}
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 'calc(50% - 70px)',
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    backgroundColor: 'background.default'
                  }
                }}
              >
                <PhotoCamera fontSize="small" />
              </IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </>
          )}
          
          <Typography variant="h4" component="h1">
            {user.fullName || 'User Profile'}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        {editMode ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  error={!formData.firstName}
                  helperText={!formData.firstName ? 'Required field' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  error={!formData.lastName}
                  helperText={!formData.lastName ? 'Required field' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  inputProps={{ 
                    maxLength: 10,
                    pattern: "[0-9]{10}",
                    inputMode: "numeric"
                  }}
                  helperText="Must be 10 digits"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !formData.firstName || !formData.lastName}
                startIcon={loading && <CircularProgress size={20} />}
              >
                Save Changes
              </Button>
            </Box>
          </form>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">First Name</Typography>
                  <Typography>{user.firstName || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Last Name</Typography>
                  <Typography>{user.lastName || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography>{user.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Mobile</Typography>
                  <Typography>{user.mobile || 'Not provided'}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => setEditMode(true)}
                  sx={{ mr: 2 }}
                >
                  Edit Profile
                </Button>
                
                {!skillProfileMode && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setSkillProfileMode(true)}
                    disabled={!!user.skillProfile}
                  >
                    {user.skillProfile ? 'Skill Profile Created' : 'Create Skill Profile'}
                  </Button>
                )}
              </Box>
              
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </>
        )}

        {/* Skill Profile Form */}
        {skillProfileMode && (
          <Box component="form" onSubmit={handleSkillProfileSubmit} sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {user.skillProfile ? 'Edit Skill Profile' : 'Create Skill Profile'}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={skillFormData.bio}
                  onChange={handleSkillChange}
                  multiline
                  rows={4}
                  helperText="Tell others about yourself and your skills"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Education"
                  name="education"
                  value={skillFormData.education}
                  onChange={handleSkillChange}
                  helperText="Your educational background"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LinkedIn Profile"
                  name="linkedin"
                  value={skillFormData.linkedin}
                  onChange={handleSkillChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GitHub Profile"
                  name="github"
                  value={skillFormData.github}
                  onChange={handleSkillChange}
                  placeholder="https://github.com/yourusername"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Portfolio Website"
                  name="portfolio"
                  value={skillFormData.portfolio}
                  onChange={handleSkillChange}
                  placeholder="https://yourportfolio.com"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={skillFormData.newSkill}
                      onChange={(e) => setSkillFormData({...skillFormData, newSkill: e.target.value})}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a skill"
                    />
                    <IconButton 
                      color="primary" 
                      onClick={handleAddSkill}
                      disabled={!skillFormData.newSkill.trim()}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skillFormData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        deleteIcon={<CancelIcon />}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setSkillProfileMode(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {user.skillProfile ? 'Update Profile' : 'Create Profile'}
              </Button>
            </Box>
          </Box>
        )}

        {/* Display existing skill profile */}
        {!skillProfileMode && user.skillProfile && (
          <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Skill Profile
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSkillProfileMode(true)}
              >
                Edit Skill Profile
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Bio</Typography>
                <Typography>{user.skillProfile.bio || 'Not provided'}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2">Education</Typography>
                <Typography>{user.skillProfile.education || 'Not provided'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">LinkedIn</Typography>
                <Typography>
                  {user.skillProfile.linkedin ? (
                    <a href={user.skillProfile.linkedin} target="_blank" rel="noopener noreferrer">
                      {user.skillProfile.linkedin}
                    </a>
                  ) : 'Not provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">GitHub</Typography>
                <Typography>
                  {user.skillProfile.github ? (
                    <a href={user.skillProfile.github} target="_blank" rel="noopener noreferrer">
                      {user.skillProfile.github}
                    </a>
                  ) : 'Not provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2">Portfolio</Typography>
                <Typography>
                  {user.skillProfile.portfolio ? (
                    <a href={user.skillProfile.portfolio} target="_blank" rel="noopener noreferrer">
                      {user.skillProfile.portfolio}
                    </a>
                  ) : 'Not provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2">Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user.skillProfile.skills?.length > 0 ? (
                    user.skillProfile.skills.map((skill, index) => (
                      <Chip key={index} label={skill} />
                    ))
                  ) : (
                    <Typography>No skills added</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;