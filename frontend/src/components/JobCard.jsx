export default function JobCard() {
    return (
      <div className="bg-[#1A1A1A] border border-[#262626] p-6 rounded-2xl hover:border-[#2563EB] transition-all duration-300">
  
        <h3 className="text-white text-xl font-semibold mb-2">
          Senior Frontend Developer
        </h3>
  
        <p className="text-gray-400 mb-4">
          TechCorp • Kochi • Full-time
        </p>
  
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Posted 2 days ago
          </span>
  
          <button className="text-[#2563EB] font-semibold hover:underline">
            Apply →
          </button>
        </div>
  
      </div>
    );
  }