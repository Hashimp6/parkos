const Candidate = require("../models/candidate");
const FreelanceService = require("../models/freelanceSchema");
const axios = require("axios");
const CategorySuggestion = require("../models/helper"); 
/* ─── GEO HELPER (OpenStreetMap) ───────────────────────────── */

async function getCoordinatesFromPlace(place) {
  try {
    const res = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: `${place}, Kerala`,
          format: "json",
          limit: 1,
          countrycodes: "in",
        },
        headers: {
          "User-Agent": "freelance-platform-app",
        },
      }
    );

    if (!res.data || res.data.length === 0) return null;

    return {
      lat: parseFloat(res.data[0].lat),
      lon: parseFloat(res.data[0].lon),
    };
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return null;
  }
}

/* ─── BUILD PAYLOAD ───────────────────────────────────────── */

async function buildPayload(body) {
  const {
    title,
    category,
    description,
    skills,
    price,
    workSamples,
    previewImage,
    place,
    coordinates,
    isActive,
  } = body;

  const payload = {};

  if (title !== undefined) payload.title = title;
  if (category !== undefined) payload.category = category;
  if (description !== undefined) payload.description = description;
  if (price !== undefined) payload.price = price;

  // ✅ FIXED preview image (no accidental overwrite)
  if (previewImage !== undefined && previewImage !== null && previewImage !== "") {
    payload.previewImage = previewImage;
  }

  if (isActive !== undefined) payload.isActive = isActive;

  // Skills
  if (skills !== undefined) {
    payload.skills = Array.isArray(skills)
      ? skills.map((s) => s.trim()).filter(Boolean)
      : String(skills).split(",").map((s) => s.trim()).filter(Boolean);
  }

  // Work samples
  if (Array.isArray(workSamples)) {
    payload.workSamples = workSamples.map(({ fetchStatus, ...s }) => s);
  }

  /* ─── LOCATION LOGIC ───────────────── */

  // ✅ If place is given → convert to coordinates
  if (place) {
    payload.place = place;

    const geo = await getCoordinatesFromPlace(place);

    if (geo) {
      payload.location = {
        type: "Point",
        coordinates: [geo.lon, geo.lat],
      };
    }
  }

  // ✅ If coordinates manually provided → override
  if (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    !isNaN(coordinates[0]) &&
    !isNaN(coordinates[1])
  ) {
    payload.location = {
      type: "Point",
      coordinates: [
        parseFloat(coordinates[0]),
        parseFloat(coordinates[1]),
      ],
    };
  }

  return payload;
}

/* ================================
   ADD SERVICE
================================ */

exports.addFreelanceService = async (req, res) => {
  try {

    
    const candidateId = req.user?.id 
    console.log("red",candidateId);
    const count = await FreelanceService.countDocuments({
      candidate: candidateId,
    });

    if (count >= 3) {
      return res.status(400).json({
        success: false,
        message: "Maximum 3 services allowed per account.",
      });
    }

    const payload = await buildPayload(req.body); // ✅ IMPORTANT

    if (!payload.title) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    const service = await FreelanceService.create({
      candidate: candidateId,
      ...payload,
    });

    await Candidate.findByIdAndUpdate(candidateId, {
      $push: { freelanceServices: service._id },
    });

    return res.status(201).json({
      success: true,
      message: "Service added successfully.",
      service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================================
   UPDATE SERVICE
================================ */

exports.updateFreelanceService = async (req, res) => {
  try {
    const service = await FreelanceService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    if (service.candidate.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    const payload = await buildPayload(req.body); // ✅ IMPORTANT

    Object.assign(service, payload);
    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated.",
      service,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ================================
   GET ALL SERVICES  (paginated)
================================ */

exports.getAllFreelanceServices = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip  = (page - 1) * limit;

    // Optional category filter
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;

    // Optional geo-near filter  ?lon=76.9&lat=8.5&maxKm=50
    let query;
    if (req.query.lon && req.query.lat) {
      const maxMeters = (parseFloat(req.query.maxKm) || 50) * 1000;
      query = FreelanceService.find({
        ...filter,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(req.query.lon), parseFloat(req.query.lat)],
            },
            $maxDistance: maxMeters,
          },
        },
      });
    } else {
      query = FreelanceService.find(filter).sort({ ranking: -1, clicks: -1, views: -1 });
    }

    const [services, total] = await Promise.all([
      query
        .populate("candidate", "name profilePhoto tagline place phone")
        .skip(skip)
        .limit(limit)
        .lean(),
      FreelanceService.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      count: services.length,
      total,
      services,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   GET SERVICES OF A CANDIDATE
================================ */

exports.getCandidateServices = async (req, res) => {
    try {
        console.log("ds",req.user);
        
      const services = await FreelanceService.find({
        candidate: req.user.id
      }).sort({ createdAt: -1 });
  
      return res.status(200).json({
        success: true,
        count: services.length,
        services
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
/* ================================
   GET SINGLE SERVICE  (+view bump)
================================ */

exports.getSingleService = async (req, res) => {
  try {
    const service = await FreelanceService.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("candidate", "name profilePhoto tagline socials place phone");

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    return res.status(200).json({ success: true, service });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   TRACK CLICK
================================ */

exports.trackClick = async (req, res) => {
  try {
    await FreelanceService.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


/* ================================
   DELETE SERVICE  (owner only)
================================ */

exports.deleteFreelanceService = async (req, res) => {
  try {
    const service = await FreelanceService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    if (service.candidate.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    await FreelanceService.findByIdAndDelete(req.params.id);

    await Candidate.findByIdAndUpdate(service.candidate, {
      $pull: { freelanceServices: service._id },
    });

    return res.status(200).json({ success: true, message: "Service deleted." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   TOGGLE ACTIVE STATUS  (owner only)
================================ */

exports.toggleServiceStatus = async (req, res) => {
  try {
  
    
    const service = await FreelanceService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    if (service.candidate.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    service.isActive = !service.isActive;
    await service.save();

    return res.status(200).json({
      success: true,
      message: `Service ${service.isActive ? "activated" : "deactivated"}.`,
      isActive: service.isActive,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ─────────────────────────────────────────────
   CREATE CATEGORY SUGGESTION
───────────────────────────────────────────── */

exports.createCategorySuggestion = async (req, res) => {
  try {
    console.log("📩 Incoming suggestion:", req.body);

    const { candidateCategory } = req.body;

    // ✅ validation
    if (!candidateCategory || candidateCategory.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // ✅ clean input
    const cleanCategory = candidateCategory.trim();

    // ✅ save (no duplicate check as you requested)
    const newSuggestion = await CategorySuggestion.create({
      candidateCategory: cleanCategory,
    });

    return res.status(201).json({
      success: true,
      message: "Suggestion submitted successfully",
      data: newSuggestion,
    });

  } catch (error) {
    console.error("❌ Category Suggestion Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};