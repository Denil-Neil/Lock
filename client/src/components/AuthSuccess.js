import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, CircularProgress, Box, Typography } from "@mui/material";

const AuthSuccess = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // If user has completed their profile, redirect to main app
      if (user.college && user.major) {
        navigate("/profile");
      } else {
        // If profile is incomplete, redirect to profile completion
        navigate("/complete-profile");
      }
    }
  }, [user, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Completing authentication...
        </Typography>
      </Box>
    </Container>
  );
};

export default AuthSuccess;
