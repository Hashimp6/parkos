exports.formatPhone = (phone) => {
    if (!phone) return phone;
  
    // remove spaces, dashes, etc.
    let cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");
  
    // if already starts with +91 → keep it
    if (cleaned.startsWith("+91")) return cleaned;
  
    // if starts with 91 (without +) → fix it
    if (cleaned.startsWith("91")) return `+${cleaned}`;
  
    // if normal 10 digit → add +91
    if (/^\d{10}$/.test(cleaned)) return `+91${cleaned}`;
  
    return cleaned; // fallback (don’t break unexpected formats)
  };