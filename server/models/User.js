const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password only required if not using Google OAuth
      },
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: false, // Make this optional initially
      trim: true,
    },
    major: {
      type: String,
      required: false, // Make this optional initially
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: false, // Make this optional initially
    },
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "other"],
    },
    interestedIn: {
      type: [String],
      enum: ["male", "female", "non-binary", "other"],
      default: ["male", "female", "non-binary", "other"],
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    interests: [
      {
        type: String,
      },
    ],
    profilePictures: {
      slot1: {
        url: { type: String, default: null },
        key: { type: String, default: null },
        uploadedAt: { type: Date, default: null },
      },
      slot2: {
        url: { type: String, default: null },
        key: { type: String, default: null },
        uploadedAt: { type: Date, default: null },
      },
      slot3: {
        url: { type: String, default: null },
        key: { type: String, default: null },
        uploadedAt: { type: Date, default: null },
      },
      slot4: {
        url: { type: String, default: null },
        key: { type: String, default: null },
        uploadedAt: { type: Date, default: null },
      },
      slot5: {
        url: { type: String, default: null },
        key: { type: String, default: null },
        uploadedAt: { type: Date, default: null },
      },
    },
    mainPhotoSlot: {
      type: Number,
      min: 1,
      max: 5,
      default: 1, // Default to slot 1 as main photo
    },
    prompts: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
          maxLength: 300,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
      city: String,
      state: String,
      country: String,
    },
    preferences: {
      ageRange: {
        min: { type: Number, default: 18 },
        max: { type: Number, default: 30 },
      },
      maxDistance: { type: Number, default: 50 }, // in kilometers
      showMe: {
        type: [String],
        enum: ["male", "female", "non-binary", "other"],
        default: ["male", "female", "non-binary", "other"],
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumExpiresAt: {
      type: Date,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    blockedUntil: {
      type: Date,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    superLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profileViews: [
      {
        viewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate age from date of birth
userSchema.virtual("calculatedAge").get(function () {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
  return this.age;
});

// Update age when date of birth changes
userSchema.pre("save", function (next) {
  if (this.dateOfBirth && this.isModified("dateOfBirth")) {
    this.age = this.calculatedAge;
  }
  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    return false; // No password set (OAuth user)
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get main profile picture
userSchema.methods.getMainProfilePicture = function () {
  const mainSlot = `slot${this.mainPhotoSlot}`;
  return this.profilePictures[mainSlot]?.url || null;
};

// Method to get all photos as array (for compatibility)
userSchema.methods.getPhotosArray = function () {
  const photos = [];
  for (let i = 1; i <= 5; i++) {
    const slot = this.profilePictures[`slot${i}`];
    if (slot && slot.url) {
      photos.push({
        slot: i,
        url: slot.url,
        key: slot.key,
        uploadedAt: slot.uploadedAt,
        isMain: i === this.mainPhotoSlot,
      });
    }
  }
  return photos;
};

// Method to get photo count
userSchema.methods.getPhotoCount = function () {
  let count = 0;
  for (let i = 1; i <= 5; i++) {
    if (this.profilePictures[`slot${i}`]?.url) {
      count++;
    }
  }
  return count;
};

// Method to get next available slot
userSchema.methods.getNextAvailableSlot = function () {
  for (let i = 1; i <= 5; i++) {
    if (!this.profilePictures[`slot${i}`]?.url) {
      return i;
    }
  }
  return null; // All slots are full
};

// Method to set photo in specific slot
userSchema.methods.setPhotoInSlot = function (slot, url, key) {
  if (slot < 1 || slot > 5) {
    throw new Error("Invalid slot number. Must be between 1 and 5");
  }

  // Check if this is the first photo before setting it
  const currentPhotoCount = this.getPhotoCount();

  this.profilePictures[`slot${slot}`] = {
    url: url,
    key: key,
    uploadedAt: new Date(),
  };

  // If this is the first photo, make it the main photo
  if (currentPhotoCount === 0) {
    this.mainPhotoSlot = slot;
  }
};

// Method to clear photo from specific slot
userSchema.methods.clearPhotoSlot = function (slot) {
  if (slot < 1 || slot > 5) {
    throw new Error("Invalid slot number. Must be between 1 and 5");
  }

  this.profilePictures[`slot${slot}`] = {
    url: null,
    key: null,
    uploadedAt: null,
  };

  // If this was the main photo, set a new main photo
  if (this.mainPhotoSlot === slot) {
    const nextPhoto = this.getPhotosArray()[0];
    this.mainPhotoSlot = nextPhoto ? nextPhoto.slot : 1;
  }
};

// Method to check if user is within age range
userSchema.methods.isWithinAgeRange = function (targetUser) {
  const userAge = this.calculatedAge || this.age;
  const targetAge = targetUser.calculatedAge || targetUser.age;

  return (
    targetAge >= this.preferences.ageRange.min &&
    targetAge <= this.preferences.ageRange.max
  );
};

// Index for geospatial queries
userSchema.index({ "location.coordinates": "2dsphere" });
userSchema.index({ college: 1, isActive: 1 });
userSchema.index({ age: 1, gender: 1, isActive: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
