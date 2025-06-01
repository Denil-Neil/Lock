import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  Grid,
  Avatar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const steps = ["Basic Info", "Preferences", "About You"];

const colleges = [
  "Harvard University",
  "Stanford University",
  "MIT",
  "UC Berkeley",
  "UCLA",
  "Yale University",
  "Princeton University",
  "Columbia University",
  "University of Chicago",
  "Other",
];

const majors = [
  "Computer Science",
  "Engineering",
  "Business",
  "Psychology",
  "Biology",
  "Economics",
  "English",
  "History",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Political Science",
  "Art",
  "Music",
  "Other",
];

const interests = [
  "Sports",
  "Music",
  "Movies",
  "Reading",
  "Travel",
  "Cooking",
  "Photography",
  "Gaming",
  "Fitness",
  "Art",
  "Dancing",
  "Hiking",
  "Technology",
  "Fashion",
  "Food",
  "Animals",
  "Volunteering",
  "Writing",
  "Theater",
  "Science",
];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    college: "",
    major: "",
    graduationYear: new Date().getFullYear(),
    dateOfBirth: null,
    gender: "",
    interestedIn: [],
    bio: "",
    interests: [],
    ageRange: { min: 18, max: 25 },
    maxDistance: 50,
  });

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate("/login");
      return;
    }

    // Pre-fill form with existing user data
    setFormData((prev) => ({
      ...prev,
      college: user.college || "",
      major: user.major || "",
      graduationYear: user.graduationYear || new Date().getFullYear(),
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
      gender: user.gender || "",
      interestedIn: user.interestedIn || [],
      bio: user.bio || "",
      interests: user.interests || [],
      ageRange: user.preferences?.ageRange || { min: 18, max: 25 },
      maxDistance: user.preferences?.maxDistance || 50,
    }));
  }, [user, navigate]);

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (
          !formData.college ||
          !formData.major ||
          !formData.dateOfBirth ||
          !formData.gender
        ) {
          setError("Please fill in all required fields");
          return false;
        }
        // Check if user is at least 18
        const age =
          new Date().getFullYear() -
          new Date(formData.dateOfBirth).getFullYear();
        if (age < 18) {
          setError("You must be at least 18 years old");
          return false;
        }
        break;
      case 1:
        if (formData.interestedIn.length === 0) {
          setError("Please select who you are interested in");
          return false;
        }
        break;
      case 2:
        if (!formData.bio.trim()) {
          setError("Please write a short bio");
          return false;
        }
        if (formData.interests.length === 0) {
          setError("Please select at least one interest");
          return false;
        }
        break;
      default:
        break;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const profileData = {
        ...formData,
        preferences: {
          ageRange: formData.ageRange,
          maxDistance: formData.maxDistance,
          showMe: formData.interestedIn,
        },
      };

      await axios.put("http://localhost:5001/api/users/profile", profileData, {
        withCredentials: true,
      });

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>College</InputLabel>
                  <Select
                    value={formData.college}
                    onChange={(e) => handleChange("college", e.target.value)}
                    label="College"
                  >
                    {colleges.map((college) => (
                      <MenuItem key={college} value={college}>
                        {college}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Major</InputLabel>
                  <Select
                    value={formData.major}
                    onChange={(e) => handleChange("major", e.target.value)}
                    label="Major"
                  >
                    {majors.map((major) => (
                      <MenuItem key={major} value={major}>
                        {major}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Graduation Year"
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) =>
                    handleChange("graduationYear", parseInt(e.target.value))
                  }
                  margin="normal"
                  inputProps={{
                    min: new Date().getFullYear(),
                    max: new Date().getFullYear() + 10,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(date) => handleChange("dateOfBirth", date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" />
                    )}
                    maxDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18)
                      )
                    }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    label="Gender"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="non-binary">Non-binary</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Dating Preferences
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Interested In</InputLabel>
                  <Select
                    multiple
                    value={formData.interestedIn}
                    onChange={(e) =>
                      handleChange("interestedIn", e.target.value)
                    }
                    input={<OutlinedInput label="Interested In" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="non-binary">Non-binary</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography gutterBottom>Age Range</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Min Age"
                    type="number"
                    value={formData.ageRange.min}
                    onChange={(e) =>
                      handleChange("ageRange", {
                        ...formData.ageRange,
                        min: parseInt(e.target.value),
                      })
                    }
                    inputProps={{ min: 18, max: 100 }}
                  />
                  <TextField
                    label="Max Age"
                    type="number"
                    value={formData.ageRange.max}
                    onChange={(e) =>
                      handleChange("ageRange", {
                        ...formData.ageRange,
                        max: parseInt(e.target.value),
                      })
                    }
                    inputProps={{ min: 18, max: 100 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Distance (km)"
                  type="number"
                  value={formData.maxDistance}
                  onChange={(e) =>
                    handleChange("maxDistance", parseInt(e.target.value))
                  }
                  inputProps={{ min: 1, max: 500 }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              About You
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell others about yourself..."
                  inputProps={{ maxLength: 500 }}
                  helperText={`${formData.bio.length}/500 characters`}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Interests</InputLabel>
                  <Select
                    multiple
                    value={formData.interests}
                    onChange={(e) => handleChange("interests", e.target.value)}
                    input={<OutlinedInput label="Interests" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {interests.map((interest) => (
                      <MenuItem key={interest} value={interest}>
                        {interest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              src={user.profilePicture}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box>
              <Typography variant="h4" component="h1">
                Complete Your Profile
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome {user.firstName}! Let's set up your dating profile.
              </Typography>
            </Box>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {renderStepContent(activeStep)}

          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CompleteProfile;
