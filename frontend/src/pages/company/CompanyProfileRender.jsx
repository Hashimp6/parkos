import Company1 from "../../components/company/Layout1";
import Company2 from "../../components/company/Layout2";
import Layout3 from "../../components/company/Layout3";

const templates = {
  1: Company1,
  2: Company2,
  3: Layout3,
 
};

export default function CompanyProfileRenderer({ company }) {
  const Template = templates[company.layout] || Company1;

  return <Template data={company} />;
}