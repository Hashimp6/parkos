import React from "react";

export default function TermsAndConditions() {
  return (
    <div style={{
      background: "#f7f7f5",
      minHeight: "100vh",
      fontFamily: "'Instrument Sans', sans-serif",
      color: "#111",
      padding: "60px 24px",
    }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>
            Legal
          </p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 16px" }}>
            Terms & Conditions
          </h1>
          <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
            Last updated: April 2, 2026 &nbsp;·&nbsp; Effective immediately
          </p>
          <div style={{ height: 1, background: "#e8e8e8", marginTop: 32 }} />
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#111", borderRadius: 6, padding: "2px 8px", letterSpacing: "0.04em" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </h2>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: 0 }}>
              {s.content}
            </p>
          </div>
        ))}

        {/* Footer note */}
        <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: 32, marginTop: 16 }}>
          <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.7 }}>
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:support@parkos.in" style={{ color: "#111", fontWeight: 600, textDecoration: "none" }}>
              support@parkos.in
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using Parkos (parkos.in), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and continued use of the platform constitutes acceptance of any changes.",
  },
  {
    title: "Use of the Platform",
    content: "Parkos is a platform connecting job seekers, employers, and freelancers within business parks and professional communities. You agree to use the platform only for lawful purposes and in a manner that does not infringe the rights of others. You must not misuse or attempt to gain unauthorized access to any part of our services.",
  },
  {
    title: "User Accounts",
    content: "To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration and to keep your profile up to date.",
  },
  {
    title: "Job Listings & Applications",
    content: "Employers are responsible for the accuracy and legality of their job postings. Parkos does not guarantee the availability, accuracy, or legitimacy of any job listing. Job seekers apply at their own discretion. Parkos is not responsible for any employment decisions made by employers or outcomes of applications.",
  },
  {
    title: "Freelancer Services",
    content: "Freelancers on Parkos are independent professionals and not employees or agents of Parkos. Any agreements, contracts, or transactions entered into between clients and freelancers are solely between those parties. Parkos is not liable for the quality, delivery, or outcome of any freelance service.",
  },
  {
    title: "Prohibited Conduct",
    content: "You agree not to post false, misleading, or fraudulent content. You must not harass, threaten, or harm other users. Spam, unsolicited messages, and unauthorized advertising are strictly prohibited. Violations may result in immediate account suspension or termination.",
  },
  {
    title: "Intellectual Property",
    content: "All content on Parkos including logos, design, text, and graphics is the property of Parkos or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written permission.",
  },
  {
    title: "Privacy Policy",
    content: "Your use of Parkos is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our platform, you consent to the collection and use of your information as described in our Privacy Policy.",
  },
  {
    title: "Limitation of Liability",
    content: "Parkos is provided on an 'as is' basis without warranties of any kind. To the fullest extent permitted by law, Parkos shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of or inability to use the platform.",
  },
  {
    title: "Governing Law",
    content: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Kerala, India.",
  },
];