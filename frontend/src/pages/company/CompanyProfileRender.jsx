

import Company1 from "../../components/company/Layout1";
import Company2 from "../../components/company/Layout2";
import Layout3 from "../../components/company/Layout3";
import Company4 from "../../components/company/Layout4";
import Company5 from "../../components/company/Layout5";

const templates = {
  1: Company1,
  2: Company2,
  3: Layout3,
  4: Company4,
  5: Company5,
 
};

export default function CompanyProfileRenderer({ company }) {
  const Template = templates[company.layout] || Company1;

  return <Template data={company} />;
}