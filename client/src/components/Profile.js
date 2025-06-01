import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRefs = useRef([]);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const [activeTab, setActiveTab] = useState("photos");
  const [completionData, setCompletionData] = useState(null);

  // Photo management - now using slots
  const [photoSlots, setPhotoSlots] = useState({
    slot1: null,
    slot2: null,
    slot3: null,
    slot4: null,
    slot5: null,
  });

  // Prompts management
  const [prompts, setPrompts] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [editingPrompt, setEditingPrompt] = useState(null);

  // Basic info editing
  const [editingBasic, setEditingBasic] = useState(false);
  const [basicInfo, setBasicInfo] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    college: "",
    major: "",
    graduationYear: "",
    interests: [],
    dateOfBirth: "",
    gender: "",
    interestedIn: [],
  });

  useEffect(() => {
    fetchProfile();
    fetchPromptQuestions();
    fetchCompletion();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/profile", {
        withCredentials: true,
      });

      const userData = response.data.user;
      setUser(userData);

      // Convert photos array back to slots for display
      const slots = {
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null,
        slot5: null,
      };

      if (userData.profilePictures) {
        userData.profilePictures.forEach((photo) => {
          slots[`slot${photo.slot}`] = photo;
        });
      }

      setPhotoSlots(slots);
      setPrompts(userData.prompts || []);
      setBasicInfo({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        bio: userData.bio || "",
        college: userData.college || "",
        major: userData.major || "",
        graduationYear: userData.graduationYear || "",
        interests: userData.interests || [],
        dateOfBirth: userData.dateOfBirth
          ? userData.dateOfBirth.split("T")[0]
          : "",
        gender: userData.gender || "",
        interestedIn: userData.interestedIn || [],
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
      setLoading(false);
    }
  };

  const fetchPromptQuestions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/profile/prompts/questions",
        {
          withCredentials: true,
        }
      );
      setAvailableQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching prompt questions:", error);
    }
  };

  const fetchCompletion = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/profile/completion",
        {
          withCredentials: true,
        }
      );
      setCompletionData(response.data);
    } catch (error) {
      console.error("Error fetching completion data:", error);
    }
  };

  const handleSlotPhotoUpload = async (slot, file) => {
    if (!file) return;

    setUploading((prev) => ({ ...prev, [slot]: true }));
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post(
        `http://localhost:5001/api/profile/photos/slot/${slot}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Update the specific slot
      setPhotoSlots((prev) => ({
        ...prev,
        [`slot${slot}`]: response.data.photo,
      }));

      fetchCompletion(); // Update completion percentage
      alert("Photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert(error.response?.data?.message || "Error uploading photo");
    } finally {
      setUploading((prev) => ({ ...prev, [slot]: false }));
    }
  };

  const deleteSlotPhoto = async (slot) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5001/api/profile/photos/slot/${slot}`,
        {
          withCredentials: true,
        }
      );

      // Clear the slot
      setPhotoSlots((prev) => ({
        ...prev,
        [`slot${slot}`]: null,
      }));

      fetchCompletion();
      alert("Photo deleted successfully!");
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Error deleting photo");
    }
  };

  const setMainPhoto = async (slot) => {
    try {
      await axios.put(
        `http://localhost:5001/api/profile/photos/slot/${slot}/main`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update all slots to reflect new main photo
      setPhotoSlots((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (updated[key]) {
            updated[key] = {
              ...updated[key],
              isMain: key === `slot${slot}`,
            };
          }
        });
        return updated;
      });

      alert("Main photo updated successfully!");
    } catch (error) {
      console.error("Error setting main photo:", error);
      alert("Error setting main photo");
    }
  };

  const savePrompts = async () => {
    try {
      await axios.put(
        "http://localhost:5001/api/profile/prompts",
        {
          prompts: prompts,
        },
        {
          withCredentials: true,
        }
      );

      setEditingPrompt(null);
      fetchCompletion();
      alert("Prompts saved successfully!");
    } catch (error) {
      console.error("Error saving prompts:", error);
      alert(error.response?.data?.message || "Error saving prompts");
    }
  };

  const addPrompt = () => {
    if (prompts.length >= 3) {
      alert("Maximum 3 prompts allowed");
      return;
    }

    const newPrompt = {
      question: availableQuestions[0],
      answer: "",
      order: prompts.length,
    };

    setPrompts([...prompts, newPrompt]);
    setEditingPrompt(prompts.length);
  };

  const removePrompt = (index) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const updatePrompt = (index, field, value) => {
    const updatedPrompts = [...prompts];
    updatedPrompts[index] = { ...updatedPrompts[index], [field]: value };
    setPrompts(updatedPrompts);
  };

  const saveBasicInfo = async () => {
    try {
      await axios.put("http://localhost:5001/api/profile/basic", basicInfo, {
        withCredentials: true,
      });

      setEditingBasic(false);
      fetchProfile();
      fetchCompletion();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleInterestToggle = (interest) => {
    setBasicInfo((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleInterestedInToggle = (option) => {
    setBasicInfo((prev) => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(option)
        ? prev.interestedIn.filter((i) => i !== option)
        : [...prev.interestedIn, option],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  const availableInterests = [
    "Music",
    "Sports",
    "Travel",
    "Food",
    "Art",
    "Movies",
    "Reading",
    "Gaming",
    "Fitness",
    "Photography",
    "Dancing",
    "Cooking",
    "Technology",
    "Nature",
    "Fashion",
    "Comedy",
    "Yoga",
    "Hiking",
    "Concerts",
    "Museums",
  ];

  const getPhotoCount = () => {
    return Object.values(photoSlots).filter((slot) => slot !== null).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-purple-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">My Profile</h1>
              {completionData && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${completionData.completionPercentage}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">
                      {completionData.completionPercentage}% complete
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-md rounded-lg p-1 mb-8">
          {["photos", "prompts", "basic"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-white text-navy-900 shadow-lg"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Photos ({getPhotoCount()}/5)
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5].map((slotNumber) => {
                const photo = photoSlots[`slot${slotNumber}`];
                const isUploading = uploading[slotNumber];

                return (
                  <div
                    key={slotNumber}
                    className="relative group aspect-square bg-white/5 rounded-lg overflow-hidden border-2 border-dashed border-white/30"
                  >
                    {photo ? (
                      <>
                        <img
                          src={photo.url}
                          alt={`Slot ${slotNumber}`}
                          className="w-full h-full object-cover"
                        />

                        {photo.isMain && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            Main
                          </div>
                        )}

                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          Slot {slotNumber}
                        </div>

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          {!photo.isMain && (
                            <button
                              onClick={() => setMainPhoto(slotNumber)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                            >
                              Set Main
                            </button>
                          )}
                          <button
                            onClick={() => deleteSlotPhoto(slotNumber)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              fileInputRefs.current[slotNumber]?.click()
                            }
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                          >
                            Replace
                          </button>
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={() =>
                          fileInputRefs.current[slotNumber]?.click()
                        }
                        className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        {isUploading ? (
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <div className="text-white/70 text-sm">
                              Uploading...
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-4xl text-white/50 mb-2">+</div>
                            <div className="text-white/70 text-sm">
                              Slot {slotNumber}
                            </div>
                            <div className="text-white/50 text-xs mt-1">
                              Click to add
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <input
                      ref={(el) => (fileInputRefs.current[slotNumber] = el)}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleSlotPhotoUpload(slotNumber, e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>
                );
              })}
            </div>

            {/* Photo management tips */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-medium mb-2">
                Photo Management Tips:
              </h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Each slot represents a specific photo position</li>
                <li>• Click "Set Main" to choose your profile picture</li>
                <li>• Use "Replace" to update a photo in the same slot</li>
                <li>• You can have up to 5 photos maximum</li>
                <li>• Slot 1 is your default main photo position</li>
              </ul>
            </div>
          </div>
        )}

        {/* Prompts Tab */}
        {activeTab === "prompts" && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Prompts ({prompts.length}/3)
              </h2>
              <button
                onClick={addPrompt}
                disabled={prompts.length >= 3}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Add Prompt
              </button>
            </div>

            <div className="space-y-4">
              {prompts.map((prompt, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">
                      Prompt {index + 1}
                    </h3>
                    <button
                      onClick={() => removePrompt(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">
                        Question
                      </label>
                      <select
                        value={prompt.question}
                        onChange={(e) =>
                          updatePrompt(index, "question", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {availableQuestions.map((question) => (
                          <option
                            key={question}
                            value={question}
                            className="bg-navy-800"
                          >
                            {question}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white/70 text-sm mb-1">
                        Answer ({prompt.answer.length}/300)
                      </label>
                      <textarea
                        value={prompt.answer}
                        onChange={(e) =>
                          updatePrompt(index, "answer", e.target.value)
                        }
                        maxLength={300}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Share something about yourself..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {prompts.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={savePrompts}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Save Prompts
                </button>
              </div>
            )}
          </div>
        )}

        {/* Basic Info Tab */}
        {activeTab === "basic" && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Basic Information
              </h2>
              <button
                onClick={() =>
                  editingBasic ? saveBasicInfo() : setEditingBasic(true)
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingBasic ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={basicInfo.firstName}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  disabled={!editingBasic}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={basicInfo.lastName}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  disabled={!editingBasic}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-1">Bio</label>
                <textarea
                  value={basicInfo.bio}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  disabled={!editingBasic}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">
                  College
                </label>
                <input
                  type="text"
                  value={basicInfo.college}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      college: e.target.value,
                    }))
                  }
                  disabled={!editingBasic}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Major
                </label>
                <input
                  type="text"
                  value={basicInfo.major}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({ ...prev, major: e.target.value }))
                  }
                  disabled={!editingBasic}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={basicInfo.dateOfBirth}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      dateOfBirth: e.target.value,
                    }))
                  }
                  disabled={!editingBasic}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={basicInfo.graduationYear}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      graduationYear: e.target.value,
                    }))
                  }
                  disabled={!editingBasic}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Gender
                </label>
                <div className="flex space-x-3">
                  {["Male", "Female", "Non-binary", "Other"].map((option) => (
                    <button
                      key={option}
                      onClick={() =>
                        editingBasic &&
                        setBasicInfo((prev) => ({ ...prev, gender: option }))
                      }
                      disabled={!editingBasic}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        basicInfo.gender === option
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      } disabled:opacity-50`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Interested In
                </label>
                <div className="flex space-x-3">
                  {["Men", "Women", "Everyone"].map((option) => (
                    <button
                      key={option}
                      onClick={() =>
                        editingBasic && handleInterestedInToggle(option)
                      }
                      disabled={!editingBasic}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        basicInfo.interestedIn.includes(option)
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      } disabled:opacity-50`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">
                  Interests
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() =>
                        editingBasic && handleInterestToggle(interest)
                      }
                      disabled={!editingBasic}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        basicInfo.interests.includes(interest)
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      } disabled:opacity-50`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {editingBasic && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingBasic(false);
                    fetchProfile(); // Reset changes
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBasicInfo}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
