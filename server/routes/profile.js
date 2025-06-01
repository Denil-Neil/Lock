const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {
  s3,
  fileFilter,
  generateSlotFileName,
  deleteSlotFromS3,
  getSlotUrl,
  createSlotUpload,
} = require("../config/s3");
const { protect } = require("../middleware/auth");

// Get user profile with photos and prompts
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        ...user.toObject(),
        profilePictures: user.getPhotosArray(), // Convert to array format for frontend compatibility
        mainProfilePicture: user.getMainProfilePicture(),
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload photo to specific slot
router.post("/photos/slot/:slot", protect, async (req, res) => {
  try {
    console.log("=== PHOTO UPLOAD DEBUG ===");
    console.log("Slot:", req.params.slot);
    console.log("User ID:", req.user?.id);

    const slot = parseInt(req.params.slot);

    if (slot < 1 || slot > 5) {
      console.log("Invalid slot number:", slot);
      return res
        .status(400)
        .json({ message: "Invalid slot number. Must be between 1 and 5" });
    }

    const upload = createSlotUpload(slot);

    if (!upload) {
      console.log("S3 upload not configured");
      return res.status(503).json({
        message: "Photo upload service unavailable - S3 not configured",
      });
    }

    console.log("S3 upload configured successfully");

    console.log("About to call upload middleware");
    const uploadMiddleware = upload.single("photo");

    uploadMiddleware(req, res, async (err) => {
      console.log("=== UPLOAD MIDDLEWARE CALLBACK ===");
      console.log("Error:", err);
      console.log("File:", req.file);
      console.log("Request body after upload:", req.body);

      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({
          message: err.message || "Error uploading photo",
        });
      }

      if (!req.file) {
        console.log("No file uploaded");
        return res.status(400).json({ message: "No file uploaded" });
      }

      try {
        console.log("Finding user:", req.user.id);
        const user = await User.findById(req.user.id);
        if (!user) {
          console.log("User not found");
          return res.status(404).json({ message: "User not found" });
        }

        console.log("User found, processing photo upload");

        // Delete existing photo in this slot if it exists
        const existingPhoto = user.profilePictures[`slot${slot}`];
        if (existingPhoto && existingPhoto.url && existingPhoto.key) {
          try {
            console.log(
              "Deleting existing photo from slot",
              slot,
              "with key:",
              existingPhoto.key
            );
            await deleteSlotFromS3(existingPhoto.key);
          } catch (deleteError) {
            console.error("Error deleting old photo:", deleteError);
            // Continue with upload even if deletion fails
          }
        }

        console.log("Setting photo in slot", slot);
        // Set new photo in slot
        user.setPhotoInSlot(slot, req.file.location, req.file.key);
        await user.save();

        console.log("Photo saved successfully");

        res.json({
          message: "Photo uploaded successfully",
          slot: slot,
          photo: {
            slot: slot,
            url: req.file.location,
            key: req.file.key,
            uploadedAt: new Date(),
            isMain: slot === user.mainPhotoSlot,
          },
          totalPhotos: user.getPhotoCount(),
        });
      } catch (error) {
        console.error("Error saving photo to database:", error);

        // If database save fails, clean up uploaded file from S3
        if (req.file) {
          try {
            await deleteSlotFromS3(req.file.key);
            console.log(`Cleaned up uploaded file from S3: ${req.file.key}`);
          } catch (cleanupError) {
            console.error(
              `Failed to cleanup file ${req.file.key}:`,
              cleanupError
            );
          }
        }

        res.status(500).json({ message: "Error saving photo" });
      }
    });
  } catch (error) {
    console.error("Error in photo upload route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete photo from specific slot
router.delete("/photos/slot/:slot", protect, async (req, res) => {
  try {
    const slot = parseInt(req.params.slot);

    if (slot < 1 || slot > 5) {
      return res
        .status(400)
        .json({ message: "Invalid slot number. Must be between 1 and 5" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const photo = user.profilePictures[`slot${slot}`];
    if (!photo || !photo.url) {
      return res.status(404).json({ message: "No photo in this slot" });
    }

    // Delete from S3
    try {
      await deleteSlotFromS3(photo.key);
    } catch (deleteError) {
      console.error("Error deleting from S3:", deleteError);
      // Continue with database deletion even if S3 deletion fails
    }

    // Clear slot in database
    user.clearPhotoSlot(slot);
    await user.save();

    res.json({
      message: "Photo deleted successfully",
      slot: slot,
      totalPhotos: user.getPhotoCount(),
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ message: "Error deleting photo" });
  }
});

// Set main profile photo by slot
router.put("/photos/slot/:slot/main", protect, async (req, res) => {
  try {
    const slot = parseInt(req.params.slot);

    if (slot < 1 || slot > 5) {
      return res
        .status(400)
        .json({ message: "Invalid slot number. Must be between 1 and 5" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const photo = user.profilePictures[`slot${slot}`];
    if (!photo || !photo.url) {
      return res.status(404).json({ message: "No photo in this slot" });
    }

    // Set this slot as main photo
    user.mainPhotoSlot = slot;
    await user.save();

    res.json({
      message: "Main photo updated successfully",
      mainPhotoSlot: slot,
    });
  } catch (error) {
    console.error("Error setting main photo:", error);
    res.status(500).json({ message: "Error setting main photo" });
  }
});

// Get available prompt questions
router.get("/prompts/questions", protect, (req, res) => {
  const promptQuestions = [
    "What's your ideal first date?",
    "What's something you're passionate about?",
    "What's your biggest goal in life?",
    "What's your favorite way to spend a weekend?",
    "What's something that always makes you laugh?",
    "What's your love language?",
    "What's your biggest pet peeve?",
    "What's something you're learning right now?",
    "What's your favorite travel destination?",
    "What's something you can't live without?",
    "What's your hidden talent?",
    "What's your favorite type of music?",
    "What's something that makes you unique?",
    "What's your dream job?",
    "What's your favorite food?",
    "What's something you're proud of?",
    "What's your biggest fear?",
    "What's something you want to try?",
    "What's your favorite movie or TV show?",
    "What's something that motivates you?",
  ];

  res.json({ questions: promptQuestions });
});

// Update user prompts
router.put("/prompts", protect, async (req, res) => {
  try {
    const { prompts } = req.body;

    if (!Array.isArray(prompts)) {
      return res.status(400).json({ message: "Prompts must be an array" });
    }

    if (prompts.length > 3) {
      return res.status(400).json({ message: "Maximum 3 prompts allowed" });
    }

    // Validate each prompt
    for (let prompt of prompts) {
      if (!prompt.question || !prompt.answer) {
        return res
          .status(400)
          .json({ message: "Each prompt must have a question and answer" });
      }
      if (prompt.answer.length > 300) {
        return res
          .status(400)
          .json({ message: "Prompt answers must be 300 characters or less" });
      }
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.prompts = prompts.map((prompt, index) => ({
      question: prompt.question,
      answer: prompt.answer,
      order: index,
    }));

    await user.save();

    res.json({
      message: "Prompts updated successfully",
      prompts: user.prompts,
    });
  } catch (error) {
    console.error("Error updating prompts:", error);
    res.status(500).json({ message: "Error updating prompts" });
  }
});

// Update basic profile info
router.put("/basic", protect, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      college,
      major,
      graduationYear,
      interests,
      dateOfBirth,
      gender,
      interestedIn,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio !== undefined) user.bio = bio;
    if (college) user.college = college;
    if (major) user.major = major;
    if (graduationYear) user.graduationYear = graduationYear;
    if (interests) user.interests = interests;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (interestedIn) user.interestedIn = interestedIn;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        ...user.toObject(),
        profilePictures: user.getPhotosArray(),
        mainProfilePicture: user.getMainProfilePicture(),
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Get profile completion percentage
router.get("/completion", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let completionScore = 0;
    const totalFields = 10;

    // Check required fields
    if (user.firstName && user.lastName) completionScore += 1;
    if (user.bio && user.bio.length > 0) completionScore += 1;
    if (user.college) completionScore += 1;
    if (user.major) completionScore += 1;
    if (user.dateOfBirth) completionScore += 1;
    if (user.gender) completionScore += 1;
    if (user.interestedIn && user.interestedIn.length > 0) completionScore += 1;
    if (user.interests && user.interests.length > 0) completionScore += 1;
    if (user.getPhotoCount() > 0) completionScore += 1;
    if (user.prompts && user.prompts.length > 0) completionScore += 1;

    const percentage = Math.round((completionScore / totalFields) * 100);

    res.json({
      completionPercentage: percentage,
      completedFields: completionScore,
      totalFields: totalFields,
      missingFields: {
        photos: user.getPhotoCount() === 0,
        prompts: user.prompts.length === 0,
        bio: !user.bio,
        college: !user.college,
        major: !user.major,
        dateOfBirth: !user.dateOfBirth,
        gender: !user.gender,
        interestedIn: !user.interestedIn || user.interestedIn.length === 0,
        interests: !user.interests || user.interests.length === 0,
      },
    });
  } catch (error) {
    console.error("Error calculating completion:", error);
    res.status(500).json({ message: "Error calculating profile completion" });
  }
});

module.exports = router;
