// upload.js  —  Multer middleware
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024,  // 5 MB per file
    fields: 300,                 // ← ADD THIS (default is 1000 but field NAME size is the issue)
    fieldNameSize: 100,          // ← ADD THIS (default is 100, but be explicit)
  },
});

// Accepts:
//   logo          (single)
//   banner        (single)
//   member_image_* (up to 50 members)
//   gallery_image_* (up to 100 gallery photos)
//   client_logo_*  (up to 50 clients)
const uploadCompanyFields = upload.fields([
  { name: "logo",   maxCount: 1 },
  { name: "banner", maxCount: 1 },
  ...Array.from({ length: 50 },  (_, i) => ({ name: `member_image_${i}`,  maxCount: 1 })),
  ...Array.from({ length: 100 }, (_, i) => ({ name: `gallery_image_${i}`, maxCount: 1 })),
  ...Array.from({ length: 50 },  (_, i) => ({ name: `client_logo_${i}`,   maxCount: 1 })),
]);

module.exports = { upload, uploadCompanyFields };