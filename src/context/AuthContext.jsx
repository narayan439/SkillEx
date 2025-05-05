import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [skillProfile, setSkillProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();

  // Initialize auth data from localStorage
  const initializeAuthData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const profileData = JSON.parse(localStorage.getItem("skillProfileData"));

      if (userData?.email) {
        setUser({
          ...userData,
          photo: userData.photo ? `${userData.photo.split('?')[0]}?v=${Date.now()}` : null,
          fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          initials: userData.initials || 
            `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase()
        });
        
        if (profileData) {
          setSkillProfile(profileData);
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      localStorage.removeItem("userData");
      localStorage.removeItem("skillProfileData");
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    initializeAuthData();
  }, []);




  
  const loginUser = useCallback(async (userData, profileData = null) => {
    try {
      if (!userData?.email) {
        throw new Error("Email is required for login");
      }

      const completeUser = {
        ...userData,
        photo: userData.photo ? `${userData.photo.split('?')[0]}?v=${Date.now()}` : null,
        fullName: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        initials: userData.initials || 
          `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`.toUpperCase()
      };

      localStorage.setItem("userData", JSON.stringify(completeUser));
      setUser(completeUser);

      if (profileData) {
        localStorage.setItem("skillProfileData", JSON.stringify(profileData));
        setSkillProfile(profileData);
      } else {
        // Check if existing profile exists in storage
        const existingProfile = JSON.parse(localStorage.getItem("skillProfileData"));
        if (existingProfile) {
          setSkillProfile(existingProfile);
        }
      }

      return true;
    } catch (error) {
      console.error("Login processing failed:", error);
      return false;
    }
  }, []);






  const logout = useCallback(() => {
    localStorage.removeItem("userData");
    localStorage.removeItem("skillProfileData");
    setUser(null);
    setSkillProfile(null);
    navigate("/login", { 
      replace: true,
      state: { from: window.location.pathname }
    });
  }, [navigate]);

  const updateUser = useCallback((updates) => {
    setUser(prevUser => {
      if (!prevUser) return null;

      const updatedUser = {
        ...prevUser,
        ...updates,
        photo: updates.photo ? `${updates.photo.split('?')[0]}?v=${Date.now()}` : prevUser.photo,
        ...((updates.firstName || updates.lastName) && {
          fullName: `${updates.firstName || prevUser.firstName} ${updates.lastName || prevUser.lastName}`.trim(),
          initials: `${(updates.firstName || prevUser.firstName)?.[0] || ''}${(updates.lastName || prevUser.lastName)?.[0] || ''}`.toUpperCase()
        })
      };

      localStorage.setItem("userData", JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const updateSkillProfile = useCallback((updates) => {
    setSkillProfile(prevProfile => {
      const updatedProfile = {
        ...(prevProfile || {}),
        ...updates,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem("skillProfileData", JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  }, []);

  const refreshSession = useCallback(() => {
    if (user) {
      const updatedUser = { 
        ...user, 
        timestamp: new Date().toISOString(),
        ...(user.photo && { photo: `${user.photo.split('?')[0]}?v=${Date.now()}` })
      };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        skillProfile,
        isAuthenticated: !!user,
        initializing,
        loginUser,
        logout,
        updateUser,
        updateSkillProfile,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};