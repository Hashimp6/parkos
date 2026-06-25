// models/Profile.js
const sampleSchema = new Schema({
    title: String,
    images: [String],       // Cloudinary URLs
    links: [String],
    description: String,
  })
  
  const serviceSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    chargeType: { type: String, enum: ['fixed','hourly','custom'] },
    price: Number,
    samples: [sampleSchema],
    isActive: { type: Boolean, default: true },
    sortOrder: Number,
  })
  
  const profileSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },   // auto-generate from name
    type: { type: String, enum: ['person','company'], required: true },
    email: String,
    phone: String,
    bio: String,
    location: String,
    avatar: String,
    banner: String,
  
    social: {
      instagram: String,
      whatsapp: String,
      linkedin: String,
      website: String,
      portfolio: String,
      behance: String,
    },
  
    skills: [String],
    categories: [String],
    availability: { type: String, enum: ['available','busy','unavailable'] },
    yearsExp: Number,
  
    services: [serviceSchema],
  
    portfolio: [{
      title: String,
      description: String,
      images: [String],
      links: [String],
      tags: [String],
      date: Date,
    }],
  
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  }, { timestamps: true })