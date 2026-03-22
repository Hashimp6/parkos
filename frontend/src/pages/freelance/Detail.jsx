import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE from "../../../config";
import axios from "axios";

const sampleService = {
  candidate: {
    name: "Arjun Nair",
    place: "Kochi, India",
    phone: "9876543210",
    whatsapp: "9876543210",
    linkedin: "#",
    instagram: "#",
    profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  title: "Professional YouTube Video Editing",
  description: "I am a visual storyteller specializing in high-retention editing and cinematic post-production. Over the last 5 years, I've helped creators transform raw footage into compelling narratives that scale.",
  price: 2500,
  skills: ["Adobe Premiere", "Color Grading", "Storytelling"],
  workSamples: [
    { title: "Vlog", link: "#" },
    { title: "Podcast", link: "#" },
    { title: "Reels", link: "#" }
  ]
};

export default function FreelancerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/freelance/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [id]);
  console.log(id,data); //
  if (!data) return <p>Loading...</p>;

  const s = data.service;
  const f = s?.candidate || {};
  const handleShare = async () => {
    const shareData = {
      title: f?.name || "Freelancer",
      text: `${s.title} - Check out this freelancer`,
      url: window.location.href
    };
  
    try {
      if (navigator.share) {
        // ✅ Mobile / supported browsers
        await navigator.share(shareData);
      } else {
        // ❌ Fallback (copy link)
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.log("Share failed:", err);
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-16 px-4 font-sans text-[#1a1a1a]">
      
      {/* THE MAIN PROFILE CARD */}
      <div className="w-full max-w-4xl bg-[#F6F6F6] rounded-[48px] p-10 md:p-14 relative overflow-hidden border border-gray-100 shadow-sm mb-16">
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-12">
          
          {/* LEFT: IMAGE WITH GREY BACKGROUND CIRCLE */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* This is the Grey Background Circle behind the image */}
              <div className="absolute inset-0 bg-[#E8E8E8] rounded-full scale-110"></div>
              
              {/* Profile Image */}
              <img 
  src={f?.profilePhoto || "https://via.placeholder.com/150"}
               className="relative w-44 h-44 rounded-full object-cover brightness-105 border-4 border-[#F6F6F6] shadow-inner"
                alt="Profile"
              />
              
              {/* Work Status Badge */}
              <div className="absolute -bottom-2 bg-[#E2FFD1] text-[#3A6925] px-4 py-1 rounded-full text-[10px] font-bold border border-white whitespace-nowrap shadow-sm">
                ✓ Looking for Work
              </div>
            </div>
            <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">📍 {f.place}</p>
          </div>

          {/* RIGHT: INFO SECTION */}
          <div className="flex-1 flex flex-col items-center md:items-start space-y-8">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{f.name}</h1>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <a href={`tel:${f.phone}`} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all">📞</a>
                <a href={f?.social?.linkedin} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-all text-sm font-bold">in</a>
                <a href={`https://wa.me/${f.phone}`} className="bg-black text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all flex items-center gap-2">
                  Whatsapp
                </a>
                <button 
  onClick={handleShare}
  className="bg-white border border-gray-300 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm"
>
  Share
</button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-16 border-t border-gray-300/50 pt-8 w-full md:w-auto">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Category</p>
                <p className="font-bold text-xl tracking-tighter">{s.category}</p>

              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Service</p>
                <p className="font-bold text-xl uppercase tracking-tighter">{s.title}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Prices</p>
                <p className="font-bold text-xl tracking-tighter">{s.price}</p>
              </div>
            </div>

            {/* Superpower Skills */}
            <div className="space-y-4 w-full">
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] text-center md:text-left">Superpower Skills</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {s.skills.map(skill => (
                  <span key={skill} className="bg-white/80 border border-gray-200 px-5 py-2 rounded-full text-xs font-semibold text-gray-700 shadow-sm hover:border-black transition-all cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER CONTENT SECTION */}
      <div className="w-full max-w-4xl px-8 grid md:grid-cols-[240px_1fr] gap-12 md:gap-20">
        <h2 className="text-3xl font-bold tracking-tight">My Story</h2>
        
        <div className="space-y-12">
          <p className="text-gray-600 leading-relaxed text-xl font-medium">
            {s.description}
          </p>

          <div className="space-y-6">
             <div className="flex items-center gap-4">
               <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Featured Projects</h3>
               <div className="flex-1 h-[1px] bg-gray-100"></div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {s.workSamples.map((work, i) => (
                  <a 
                    key={i} 
                    href={work.link} 
                    className="aspect-square bg-[#F6F6F6] border border-gray-200 rounded-[32px] flex flex-col items-center justify-center font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all group"
                  >
                    {work.title}
                    <span className="mt-2 text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                  </a>
                ))}
             </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}