import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Menu,
  MenuItem
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { user, logout, isAuthenticated } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: "#1565c0", height: "64px", width: "100vw" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: "20px",
              "&:hover": { color: "#bbdefb" }
            }}
          >
            SkillEx
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            <Button
              component={Link}
              to="/skills"
              sx={{
                fontSize: "14px",
                color: "white",
                fontWeight: "500",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" }
              }}
            >
              Skills
            </Button>

            {isAuthenticated && (
              <Button
                component={Link}
                to="/dashboard"
                sx={{
                  fontSize: "14px",
                  color: "white",
                  fontWeight: "500",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" }
                }}
              >
                Dashboard
              </Button>
            )}

            {isAuthenticated ? (
              <IconButton
                onClick={handleProfileClick}
                sx={{ color: "white" }}
                aria-controls="account-menu"
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: "#f5f5f5",
                    color: "#1565c0",
                    fontSize: "14px"
                  }}
                  src={user?.photo || undefined}
                >
                  {!user?.photo && user?.firstName ? 
                    `${user.firstName.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase() || ''}` 
                    : "?"}
                </Avatar>
              </IconButton>
            ) : (
              <Button
                component={Link}
                to="/login"
                sx={{
                  fontSize: "14px",
                  color: "white",
                  fontWeight: "500",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" }
                }}
              >
                Sign In
              </Button>
            )}
          </Box>

          <IconButton
            sx={{ display: { xs: "block", md: "none" }, color: "white" }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ "& .MuiDrawer-paper": { width: 260, backgroundColor: "#1565c0", color: "white" } }}
      >
        <Box role="presentation" onClick={handleDrawerToggle} sx={{ pt: 2 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/skills" sx={{ textAlign: "center" }}>
                <ListItemText primary="Skills" sx={{ fontWeight: "bold", color: "white" }} />
              </ListItemButton>
            </ListItem>

            {isAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/dashboard" sx={{ textAlign: "center" }}>
                  <ListItemText primary="Dashboard" sx={{ fontWeight: "bold", color: "white" }} />
                </ListItemButton>
              </ListItem>
            )}

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={isAuthenticated ? "/profile" : "/login"}
                sx={{ textAlign: "center" }}
              >
                <ListItemText
                  primary={isAuthenticated ? "Profile" : "Sign In"}
                  sx={{ fontWeight: "bold", color: "white" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem component={Link} to="/Profile" onClick={handleCloseMenu}>Profile</MenuItem>
        <MenuItem component={Link} to="/settings" onClick={handleCloseMenu}>Settings</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;