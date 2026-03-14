// upload.js  —  Multer middleware
const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    fields: 300,
    fieldNameSize: 100,
  },
});

// ── Company uploads ──────────────────────────────────────────────
const uploadCompanyFields = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  ...Array.from({ length: 50 }, (_, i) => ({ name: `member_image_${i}`, maxCount: 1 })),
  ...Array.from({ length: 100 }, (_, i) => ({ name: `gallery_image_${i}`, maxCount: 1 })),
  ...Array.from({ length: 50 }, (_, i) => ({ name: `client_logo_${i}`, maxCount: 1 })),
]);

// ── Candidate profile uploads ────────────────────────────────────
const uploadCandidateFields = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "cv", maxCount: 1 },
]);

// ── Job application resume ────────────────────────────────────────
// Single PDF/DOC/DOCX — used in POST /api/applications/apply
// Skip this and send useCandidateCV:"true" to reuse profile CV instead
const uploadApplicationResume = upload.single("resume");

module.exports = {
  upload,
  uploadCompanyFields,
  uploadCandidateFields,
  uploadApplicationResume,
};