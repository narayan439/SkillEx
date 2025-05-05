import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Card,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Cleanup function
      setIsSuccess(false);
      setIsLoading(false);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, mobile, email, password, confirmPassword } = formData;

    if (!firstName.trim() || !/^[a-zA-Z]+$/.test(firstName)) {
      newErrors.firstName = "Please enter a valid first name (letters only).";
    }
    if (!lastName.trim() || !/^[a-zA-Z]+$/.test(lastName)) {
      newErrors.lastName = "Please enter a valid last name (letters only).";
    }
    if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(password)) {
      newErrors.password = "Password must be 8+ characters with uppercase, lowercase, number, and special character.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login", { state: { registrationSuccess: true } });
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Invalid data. Please check your inputs.";
        } else if (error.response.status === 409) {
          errorMessage = "Email already exists. Please use a different email.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        py: 8,
        px: 2,
        boxSizing: "border-box",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: "850px",
          borderRadius: "12px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Left Image Section */}
        <Box
          sx={{
            flex: 1,
            minHeight: "350px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1976d2",
          }}
        >
          <img
            src="/images/signup-image.png"
            alt="Signup Visual"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Right Form Section */}
        <Box
          component="form"
          onSubmit={handleSignup}
          sx={{
            flex: 1,
            padding: "40px",
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            Create Account
          </Typography>

          {isSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! Redirecting to login...
            </Alert>
          )}

          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <TextField
            fullWidth
            name="firstName"
            label="First Name"
            variant="outlined"
            margin="normal"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            disabled={isLoading || isSuccess}
          />
          <TextField
            fullWidth
            name="lastName"
            label="Last Name"
            variant="outlined"
            margin="normal"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            disabled={isLoading || isSuccess}
          />
          <TextField
            fullWidth
            name="mobile"
            label="Mobile Number"
            variant="outlined"
            margin="normal"
            value={formData.mobile}
            onChange={handleChange}
            error={!!errors.mobile}
            helperText={errors.mobile}
            disabled={isLoading || isSuccess}
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            variant="outlined"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoading || isSuccess}
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isLoading || isSuccess}
          />
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={isLoading || isSuccess}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: "15px", borderRadius: "8px", padding: "12px" }}
            disabled={isLoading || isSuccess}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isSuccess ? (
              "Success!"
            ) : (
              "Sign Up"
            )}
          </Button>

          <Typography variant="body2" sx={{ marginTop: "15px" }}>
            Already have an account?{" "}
            <Link href="/login" sx={{ fontWeight: "bold" }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Signup;