import { useState, useEffect, useCallback, useRef } from "react";
import API_BASE from "../../../config";
import { useNavigate } from "react-router-dom";

const BASE_URL = `${API_BASE}/jobs`; // 🔁 Change to your API base URL

const JOB_TYPES = ["full-time", "part-time", "contract", "internship"];
const WORK_MODES = ["remote", "hybrid", "on-site"];
const CURRENCIES = ["USD", "EUR", "GBP", "INR"];
const SORT_FIELDS = ["postedDate", "salary", "openings", "createdAt"];
const PAGE_SIZES = [10, 25, 50];

// ── pill styles ──────────────────────────────────────────────────────────────
const STATUS_PILL = {
  true: "bg-green-100 text-green-800 border border-green-300",
  false: "bg-gray-100 text-gray-600 border border-gray-300",
};
const MODE_PILL = {
  remote: "bg-blue-100 text-blue-800 border border-blue-300",
  hybrid: "bg-amber-100 text-amber-800 border border-amber-300",
  "on-site": "bg-pink-100 text-pink-800 border border-pink-300",
};
const TYPE_PILL = {
  "full-time": "bg-indigo-100 text-indigo-800 border border-indigo-200",
  "part-time": "bg-teal-100 text-teal-800 border border-teal-200",
  contract: "bg-orange-100 text-orange-800 border border-orange-200",
  internship: "bg-purple-100 text-purple-800 border border-purple-200",
};

function Pill({ label, style }) {
  if (!label) return null;
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${style}`}>
      {label}
    </span>
  );
}

function Initials({ name = "" }) {
  const chars = name.slice(0, 2).toUpperCase() || "??";
  return (
    <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-500 shrink-0">
      {chars}
    </div>
  );
}

function StatCard({ label, value, valueClass = "" }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-medium ${valueClass}`}>{value ?? "—"}</div>
    </div>
  );
}

function FilterChip({ label, value, onRemove }) {
  return (
    <span
      onClick={onRemove}
      className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-600 cursor-pointer hover:border-gray-400 transition-colors"
    >
      <span className="text-gray-400">{label}:</span>
      <strong className="text-gray-700">{value}</strong>
      <span className="text-gray-400 text-[10px]">✕</span>
    </span>
  );
}

export default function AdminJobsPanel() {
  const navigate = useNavigate();
  // ── filter state ────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [skills, setSkills] = useState("");
  const [businessPark, setBusinessPark] = useState("");
  const [currency, setCurrency] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [postedAfter, setPostedAfter] = useState("");
  const [postedBefore, setPostedBefore] = useState("");
  const [sortBy, setSortBy] = useState("postedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  // ── data state ──────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounceRef = useRef(null);

  // ── fetch ────────────────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async (pg = 1) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (isActive !== "") params.set("isActive", isActive);
    if (jobType) params.set("jobType", jobType);
    if (workMode) params.set("workMode", workMode);
    if (location) params.set("location", location);
    if (department) params.set("department", department);
    if (skills) params.set("skills", skills);
    if (businessPark) params.set("businessPark", businessPark);
    if (currency) params.set("currency", currency);
    if (salaryMin) params.set("salaryMin", salaryMin);
    if (postedAfter) params.set("postedAfter", postedAfter);
    if (postedBefore) params.set("postedBefore", postedBefore);
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("limit", limit);
    params.set("page", pg);

    try {
      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "API error");
      setJobs(json.data || []);
      setPagination(json.pagination || {});
    } catch (e) {
      setError(e.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, isActive, jobType, workMode, location, department, skills, businessPark, currency, salaryMin, postedAfter, postedBefore, sortBy, sortOrder, limit]);

  // debounce text inputs
  const triggerDebounce = () => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setPage(1); }, 450);
  };

  useEffect(() => { fetchJobs(page); }, [fetchJobs, page]);

  const applyFilters = () => { setPage(1); };

  const resetFilters = () => {
    setSearch(""); setIsActive("true"); setJobType(""); setWorkMode("");
    setLocation(""); setDepartment(""); setSkills(""); setBusinessPark("");
    setCurrency(""); setSalaryMin(""); setPostedAfter(""); setPostedBefore("");
    setSortBy("postedDate"); setSortOrder("desc"); setLimit(10); setPage(1);
  };

  // ── active chips ─────────────────────────────────────────────────────────────
  const activeFilters = [
    { key: "search", label: "Search", value: search, clear: () => setSearch("") },
    { key: "isActive", label: "Status", value: isActive === "true" ? "Active" : isActive === "false" ? "Inactive" : null, clear: () => setIsActive("") },
    { key: "jobType", label: "Type", value: jobType, clear: () => setJobType("") },
    { key: "workMode", label: "Mode", value: workMode, clear: () => setWorkMode("") },
    { key: "location", label: "Location", value: location, clear: () => setLocation("") },
    { key: "department", label: "Dept", value: department, clear: () => setDepartment("") },
    { key: "skills", label: "Skills", value: skills, clear: () => setSkills("") },
    { key: "businessPark", label: "Park", value: businessPark, clear: () => setBusinessPark("") },
    { key: "currency", label: "Currency", value: currency, clear: () => setCurrency("") },
    { key: "salaryMin", label: "Min salary", value: salaryMin, clear: () => setSalaryMin("") },
    { key: "postedAfter", label: "From", value: postedAfter, clear: () => setPostedAfter("") },
    { key: "postedBefore", label: "To", value: postedBefore, clear: () => setPostedBefore("") },
  ].filter(f => f.value);

  // ── pagination pages ─────────────────────────────────────────────────────────
  const totalPages = pagination.totalPages || 1;
  const buildPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages > 7 && i > 2 && i < totalPages - 1 && Math.abs(i - page) > 1) {
        if (i === 3 || i === totalPages - 2) pages.push("...");
        continue;
      }
      pages.push(i);
    }
    return pages;
  };

  // ── input classes ─────────────────────────────────────────────────────────────
  const inputCls = "text-sm h-9 px-3 border border-gray-200 rounded-lg bg-white text-gray-900 outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400";
  const selectCls = `${inputCls} cursor-pointer`;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-screen-xl mx-auto">

        {/* ── top bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium text-gray-900">Jobs</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-500">
              {pagination.total ?? "—"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="h-9 px-4 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset filters
            </button>
            <button className="h-9 px-4 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors">
              + Add job
            </button>
          </div>
        </div>

        {/* ── stat cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total jobs" value={(pagination.total ?? 0).toLocaleString()} />
          <StatCard label="Active" value={jobs.filter(j => j.isActive).length} valueClass="text-green-700" />
          <StatCard label="Inactive" value={jobs.filter(j => !j.isActive).length} valueClass="text-gray-500" />
          <StatCard label="This page" value={jobs.length} />
        </div>

        {/* ── filters row 1 ────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-2">
          {/* search */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">⌕</span>
            <input
              className={`${inputCls} w-full pl-8`}
              placeholder="Search role, skills, department…"
              value={search}
              onChange={e => { setSearch(e.target.value); triggerDebounce(); }}
            />
          </div>
          <select className={selectCls} value={isActive} onChange={e => { setIsActive(e.target.value); applyFilters(); }}>
            <option value="">All status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select className={selectCls} value={jobType} onChange={e => { setJobType(e.target.value); applyFilters(); }}>
            <option value="">All types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className={selectCls} value={workMode} onChange={e => { setWorkMode(e.target.value); applyFilters(); }}>
            <option value="">All modes</option>
            {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            className={`${inputCls} w-32`}
            placeholder="Location…"
            value={location}
            onChange={e => { setLocation(e.target.value); triggerDebounce(); }}
          />
          <input
            className={`${inputCls} w-32`}
            placeholder="Department…"
            value={department}
            onChange={e => { setDepartment(e.target.value); triggerDebounce(); }}
          />
          <input
            className={`${inputCls} w-44`}
            placeholder="Skills (comma separated)…"
            value={skills}
            onChange={e => { setSkills(e.target.value); triggerDebounce(); }}
          />
          <input
            className={`${inputCls} w-36`}
            placeholder="Business park…"
            value={businessPark}
            onChange={e => { setBusinessPark(e.target.value); triggerDebounce(); }}
          />
        </div>

        {/* ── filters row 2 ────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-4">
          <select className={selectCls} value={currency} onChange={e => { setCurrency(e.target.value); applyFilters(); }}>
            <option value="">Any currency</option>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            className={`${inputCls} w-32`}
            type="number"
            placeholder="Min salary…"
            value={salaryMin}
            onChange={e => { setSalaryMin(e.target.value); triggerDebounce(); }}
          />
          <input
            className={`${inputCls} w-36`}
            type="date"
            value={postedAfter}
            onChange={e => { setPostedAfter(e.target.value); applyFilters(); }}
          />
          <input
            className={`${inputCls} w-36`}
            type="date"
            value={postedBefore}
            onChange={e => { setPostedBefore(e.target.value); applyFilters(); }}
          />
          <select className={selectCls} value={sortBy} onChange={e => { setSortBy(e.target.value); applyFilters(); }}>
            {SORT_FIELDS.map(f => <option key={f} value={f}>Sort: {f}</option>)}
          </select>
          <select className={selectCls} value={sortOrder} onChange={e => { setSortOrder(e.target.value); applyFilters(); }}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
          <select className={selectCls} value={limit} onChange={e => { setLimit(Number(e.target.value)); applyFilters(); }}>
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
          </select>
        </div>

        {/* ── active filter chips ──────────────────────────────────────── */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(f => (
              <FilterChip key={f.key} label={f.label} value={f.value} onRemove={() => { f.clear(); applyFilters(); }} />
            ))}
          </div>
        )}

        {/* ── table ────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-sm text-gray-400">Loading jobs…</div>
          ) : error ? (
            <div className="m-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              Error: {error}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-400">No jobs found for the current filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Role / Company", "Department", "Type", "Mode", "Status", "Park", "Salary", "Openings", "Posted", "Skills","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, i) => {
                    const companyName = job.company?.companyName || "Unknown";
                    const salary = job.salary
                      ? `${job.currency || ""}${Number(job.salary).toLocaleString()}`
                      : "—";
                    const posted = job.postedDate
                      ? new Date(job.postedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                      : "—";
                    const visibleSkills = (job.skills || []).slice(0, 3);
                    const extraSkills = (job.skills || []).length - 3;

                    return (
                      <tr key={job._id || i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        {/* role + company */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Initials name={companyName} />
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate max-w-[150px]">{job.role || "—"}</div>
                              <div className="text-xs text-gray-400 truncate max-w-[150px]">{companyName} · {job.location || "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{job.department || "—"}</td>
                        <td className="px-4 py-3">
                          <Pill label={job.jobType} style={TYPE_PILL[job.jobType] || "bg-gray-100 text-gray-600 border border-gray-200"} />
                        </td>
                        <td className="px-4 py-3">
                          <Pill label={job.workMode} style={MODE_PILL[job.workMode] || "bg-gray-100 text-gray-600 border border-gray-200"} />
                        </td>
                        <td className="px-4 py-3">
                          <Pill label={job.isActive ? "Active" : "Inactive"} style={STATUS_PILL[job.isActive]} />
                        </td>
                        <td className="px-4 py-3">
                          {job.businessPark ? (
                            <Pill label={job.businessPark} style="bg-gray-100 text-gray-600 border border-gray-200" />
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{salary}</td>
                        <td className="px-4 py-3 text-gray-700 text-center">{job.openings ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{posted}</td>
                        <td className="px-4 py-3 max-w-[160px]">
                          <div className="flex flex-wrap gap-1">
                            {visibleSkills.map(s => (
                              <span key={s} className="text-[11px] px-1.5 py-0.5 rounded-full border border-gray-200 text-gray-500">{s}</span>
                            ))}
                            {extraSkills > 0 && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded-full border border-gray-200 text-gray-400">+{extraSkills}</span>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-4 py-3">
                        <button
    onClick={() => navigate(`/company/jobs/${job._id}`, { state: { job } })}
    className="text-xs px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
  >
    View Applicants
  </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── pagination ───────────────────────────────────────────────── */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-3 mt-4 text-sm text-gray-500">
            <span>
              Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, pagination.total)} of {pagination.total}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              {buildPages().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-colors ${
                      p === page
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}