export default function Navbar() {
    return (
      <nav className="bg-[#0F0F0F] border-b border-[#262626] px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-white text-2xl font-bold tracking-wide">
            BUSINESS PARK
          </h1>
  
          <div className="space-x-8 text-gray-300 font-medium">
            <a href="#" className="hover:text-white transition">Home</a>
            <a href="#" className="hover:text-white transition">Jobs</a>
            <a href="#" className="text-[#2563EB] hover:opacity-80 transition">
              Login
            </a>
          </div>
        </div>
      </nav>
    );
  }