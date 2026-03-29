// utils/geocoder.js
const NodeGeocoder = require("node-geocoder");

const geocoder = NodeGeocoder({
  provider: "openstreetmap", // free, no API key needed
});

const getCoordinates = async (address) => {
  try {
    const { building, street, city, state, pincode, country } = address;
    
    // Build a readable address string
    const addressString = [building, street, city, state, pincode, country]
      .filter(Boolean)
      .join(", ");

    const res = await geocoder.geocode(addressString);
    
    if (res && res.length > 0) {
      return {
        type: "Point",
        coordinates: [res[0].longitude, res[0].latitude], // [lng, lat] for MongoDB
      };
    }
    return null;
  } catch (err) {
    console.error("Geocoding failed:", err.message);
    return null;
  }
};

module.exports = getCoordinates;