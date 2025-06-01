import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Heart,
  Edit3,
} from "lucide-react";
import axios from "axios";

const ProfileCompletion = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    college: "",
    major: "",
    dateOfBirth: "",
    gender: "",
    interestedIn: [],
    bio: "",
    interests: [],
  });

  const steps = [
    {
      id: 0,
      title: "Basic Info",
      icon: User,
      description: "Tell us about yourself",
    },
    {
      id: 1,
      title: "Preferences",
      icon: Heart,
      description: "Who are you looking for?",
    },
    {
      id: 2,
      title: "About You",
      icon: Edit3,
      description: "Share your personality",
    },
  ];

  const genderOptions = ["male", "female", "non-binary", "other"];
  const interestOptions = [
    "Sports",
    "Music",
    "Movies",
    "Reading",
    "Travel",
    "Cooking",
    "Gaming",
    "Art",
    "Photography",
    "Dancing",
    "Hiking",
    "Fitness",
    "Technology",
    "Fashion",
    "Food",
    "Animals",
    "Nature",
    "Science",
    "History",
    "Politics",
  ];

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setFormData({
      college: user.college || "",
      major: user.major || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      gender: user.gender || "",
      interestedIn: user.interestedIn || [],
      bio: user.bio || "",
      interests: user.interests || [],
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, [name]: newValues };
    });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.put(
        "http://localhost:5001/api/users/profile",
        formData,
        { withCredentials: true }
      );

      login(response.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College/University *
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your college or university name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Major/Field of Study *
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Computer Science, Psychology"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You must be 18 or older
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Gender *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {genderOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, gender: option }))
                    }
                    className={`p-3 border-2 rounded-lg text-center transition-all transform hover:scale-105 ${
                      formData.gender === option
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {formData.gender === option && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                      <span className="font-medium">
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interested In
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Select all that apply ({formData.interestedIn.length} selected)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {genderOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleMultiSelect("interestedIn", option)}
                    className={`p-3 border-2 rounded-lg text-center transition-all transform hover:scale-105 ${
                      formData.interestedIn.includes(option)
                        ? "border-green-500 bg-green-50 text-green-700 shadow-md"
                        : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {formData.interestedIn.includes(option) && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                      <span className="font-medium">
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell others about yourself..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interests
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Select your interests ({formData.interests.length} selected)
              </p>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleMultiSelect("interests", interest)}
                    className={`p-2 text-sm border-2 rounded-lg text-center transition-all transform hover:scale-105 ${
                      formData.interests.includes(interest)
                        ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md"
                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      {formData.interests.includes(interest) && (
                        <Check className="w-3 h-3 text-purple-600" />
                      )}
                      <span className="font-medium">{interest}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
            <p className="text-blue-100 mt-2">
              Help others get to know you better
            </p>
          </div>

          {/* Progress Steps */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      activeStep >= index
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {activeStep > index ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        activeStep >= index ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 transition-all ${
                        activeStep > index ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {steps[activeStep].title}
              </h2>
              <p className="text-gray-600">{steps[activeStep].description}</p>
            </div>

            {renderStepContent(activeStep)}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={activeStep === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeStep === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              {activeStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Complete Profile</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
