import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";

export default function ProfileCard() {
  const { user } = useUser();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setTempName(user.name || "");
      setTempEmail(user.email || "");
    } else {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setName(parsed.name || "");
        setEmail(parsed.email || "");
        setTempName(parsed.name || "");
        setTempEmail(parsed.email || "");
      } else {
        toast.error("Session expired. Please login again.");
      }
    }
  }, [user]);

  const handleEdit = () => {
    setTempName(name);
    setTempEmail(email);
    setEditing(true);
  };

  const handleSave = () => {
    setName(tempName);
    setEmail(tempEmail);
    setEditing(false);
    setSaved(true);

    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Cover */}
        <div className="h-28 bg-black"></div>

        {/* Avatar + Edit */}
        <div className="flex items-end justify-between px-6 -mt-10">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/300"
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          {!editing && (
            <button
              onClick={handleEdit}
              className="text-xs px-4 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Name + Email */}
        <div className="px-6 pt-3 pb-4">
          <h2 className="text-2xl font-semibold text-gray-900">{name}</h2>

          <div className="mt-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full inline-block">
            {email}
          </div>
        </div>

        {/* Stats */}
        {!editing && (
          <div className="mx-6 mb-4 grid grid-cols-3 bg-gray-50 border rounded-xl">
            {[
              ["48", "Projects"],
              ["12K", "Followers"],
              ["6yr", "Experience"],
            ].map(([num, label]) => (
              <div key={label} className="text-center py-4">
                <p className="text-lg font-semibold">{num}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Edit Form */}
        {editing && (
          <div className="px-6 pb-4">
            <label className="text-xs text-gray-500">Full Name</label>

            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <label className="text-xs text-gray-500">Email</label>

            <input
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 bg-black text-white py-2 rounded-full hover:bg-gray-800"
              >
                Save
              </button>

              <button
                onClick={handleCancel}
                className="px-4 border rounded-full hover:border-black"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Saved Toast */}
        {saved && (
          <div className="text-center text-xs text-green-600 pb-3">
            ✓ Profile updated successfully
          </div>
        )}

        {/* Actions */}
        {!editing && (
          <div className="px-6 pb-6 flex flex-col gap-2">
            <button className="flex items-center justify-between bg-black text-white px-4 py-3 rounded-xl">
              <span>View CV / Resume</span>
              ↗
            </button>

            <button className="flex items-center justify-between border px-4 py-3 rounded-xl hover:bg-gray-50">
              <span>Visit Website</span>
              ↗
            </button>

            <button className="flex items-center justify-between border px-4 py-3 rounded-xl hover:bg-gray-50">
              <span>Browse Jobs</span>
              ↗
            </button>
          </div>
        )}
      </div>
    </div>
  );
}