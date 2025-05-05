import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Card,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim() || !password.trim()) {
      setError("Both email and password are required");
      return;
    }
  
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000
        }
      );
  
      if (!response.data) {
        throw new Error("No response data received");
      }
  
      const userData = response.data.user || response.data;
      const skillProfile = response.data.skillProfile || null;
      
      if (!userData.email) {
        throw new Error("Invalid user data received");
      }
  
      // Prepare user data with all required fields
      const userWithPhoto = {
        ...userData,
        photo: userData.photo ? `${userData.photo.split('?')[0]}?v=${Date.now()}` : null,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        mobile: userData.mobile || "",
        fullName: userData.fullName || `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        initials: userData.initials || 
          `${userData.firstName?.[0] || ""}${userData.lastName?.[0] || ""}`.toUpperCase()
      };
  
      // Pass both user data and skill profile to loginUser
      const success = await loginUser(userWithPhoto, skillProfile);
      if (!success) {
        throw new Error("Failed to save authentication data");
      }
  
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: { xs: "90%", md: "750px" },
          borderRadius: "12px",
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Left - Image (Maintaining your original design) */}
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
            src="/images/login-image.png"
            alt="Login Visual"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Right - Form (Maintaining your original design) */}
        <Box
          sx={{
            flex: 1,
            padding: "40px",
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Link
              href="/forgot-password"
              sx={{
                display: "block",
                margin: "10px 0",
                fontSize: "14px",
                color: "#1976d2",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Link>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ 
                marginTop: "15px", 
                borderRadius: "8px", 
                padding: "12px",
                textTransform: "none",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Logging in...
                </>
              ) : "Login"}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ marginTop: "15px" }}>
            Don't have an account?{" "}
            <Link 
              href="/signup" 
              sx={{ 
                fontWeight: "bold",
                textDecoration: "none",
                color: "#1976d2",
                '&:hover': {
                  textDecoration: "underline"
                }
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;