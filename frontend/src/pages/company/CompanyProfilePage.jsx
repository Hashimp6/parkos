// pages/CompanyProfilePage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../../../config";
import CompanyProfileRenderer from "./CompanyProfileRender";

export default function CompanyProfilePage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${API_BASE}/companies/company/${companyId}`);
        console.log("company", res.data.data);
        setCompany(res.data.data);
      } catch (err) {
        console.error("Error fetching company profile:", err);
        setError("Failed to load company profile.");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompany();
    }
  }, [companyId]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!company) return <div>Company not found.</div>;

  return <CompanyProfileRenderer company={company} />;
}