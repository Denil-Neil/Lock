const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

require("dotenv").config();

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Generate slot-based filename
const generateSlotFileName = (userId, slot, originalname) => {
  const extension = originalname.split(".").pop();
  return `profile-photos/${userId}/slot-${slot}.${extension}`;
};

// Create upload middleware for slot-based uploads
const createSlotUpload = (slot) => {
  if (!s3) {
    console.log("S3 not configured, upload disabled");
    return null;
  }

  if (!slot || slot < 1 || slot > 5) {
    console.error("Invalid slot provided to createSlotUpload:", slot);
    return null;
  }

  return multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      key: function (req, file, cb) {
        const userId = req.user.id;
        const fileName = generateSlotFileName(userId, slot, file.originalname);
        cb(null, fileName);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    fileFilter: fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });
};

// Delete from S3 using the exact key
const deleteSlotFromS3 = async (key) => {
  try {
    const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

    if (!key) {
      console.log("No key provided for deletion");
      return false;
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
    console.log(`Successfully deleted ${key} from S3`);
    return true;
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw error;
  }
};

// Get slot URL
const getSlotUrl = (userId, slot, extension = "jpg") => {
  const key = generateSlotFileName(userId, slot, `photo.${extension}`);
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${
    process.env.AWS_REGION || "us-west-1"
  }.amazonaws.com/${key}`;
};

module.exports = {
  s3,
  fileFilter,
  generateSlotFileName,
  createSlotUpload,
  deleteSlotFromS3,
  getSlotUrl,
};
