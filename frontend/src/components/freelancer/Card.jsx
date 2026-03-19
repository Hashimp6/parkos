import React from "react";
import { useNavigate } from "react-router-dom";

export default function FreelancerCard({ freelancer }) {

  const navigate = useNavigate();

  return (
    <div
    onClick={() =>
      navigate(`/freelancer/${freelancer._id}`, {
        state: { freelancer }
      })
    }
      className="bg-white border rounded-2xl p-5 hover:shadow-xl transition cursor-pointer flex flex-col"
    >

      <div className="flex items-center gap-4 mb-4">

        <img
          src={freelancer.profilePhoto || "/avatar.png"}
          alt={freelancer.name}
          className="w-14 h-14 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold text-gray-900">
            {freelancer.name}
          </h3>

          <p className="text-sm text-gray-500">
            {freelancer.place}
          </p>
        </div>

      </div>

      <p className="text-gray-700 text-sm mb-3">
        {freelancer.tagline || "Professional Freelancer"}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {(freelancer.skills || []).slice(0,3).map((skill,i)=>(
          <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-md">
            {skill}
          </span>
        ))}
      </div>

      <span className="text-sm text-yellow-500 mt-auto">
        ⭐ {freelancer.rating || "4.8"}
      </span>

    </div>
  );
}