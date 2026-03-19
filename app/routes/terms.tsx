import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { GrainGradient } from '@paper-design/shaders-react';

export const meta: MetaFunction = () => {
  return [
    { title: "Terms of Service - Shopify App" },
    { name: "description", content: "Terms of Service for our Shopify App" },
  ];
};

export default function Terms() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Background — identical to index */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        {dimensions.width > 0 && (
          <GrainGradient
            width={dimensions.width}
            height={dimensions.height}
            colors={["#7300ff", "#eba8ff", "#00bfff", "#2b00ff"]}
            colorBack="#000000"
            softness={0.5}
            intensity={0.5}
            noise={0.25}
            shape="corners"
            speed={0}
          />
        )}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.30)", backdropFilter: "blur(20px)" }} />
      </div>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "48px 20px 64px",
          gap: "12px",
        }}
      >
        {/* Back link */}
        <div style={{ width: "100%", marginBottom: "8px" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#94a3b8",
              textDecoration: "none",
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>

        {/* Hero card */}
        <div
          style={{
            width: "100%",
            background: "rgba(0,0,0,0.50)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "20px",
            padding: "32px 28px",
            backdropFilter: "blur(24px)",
            boxShadow: "0 0 40px rgba(0,0,0,0.4)",
            boxSizing: "border-box",
          }}
        >
          {/* Badge row */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "rgba(99,102,241,0.20)",
                border: "1px solid rgba(99,102,241,0.30)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgb(165,180,252)" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#94a3b8",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Legal
            </span>
          </div>

          <h1
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 12px 0",
            }}
          >
            Terms of Service
          </h1>

          <p style={{ fontSize: "13px", fontWeight: 500, color: "#64748b", margin: 0 }}>
            Last updated:{" "}
            <span style={{ color: "#cbd5e1" }}>
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </p>
        </div>

        {/* Section 1: Usage rules */}
        <TermsSection
          title="Usage rules"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgb(165,180,252)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          iconBg="rgba(99,102,241,0.15)"
          iconBorder="rgba(99,102,241,0.25)"
        >
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7, margin: "0 0 16px 0" }}>
            By installing and using our App, you agree to comply with the following essential rules:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "Provide accurate information when configuring the App for your store.",
              "Do not use the App for any illegal or unauthorized purposes.",
              "Accept responsibility for all activity occurring under your installation.",
              "Do not attempt to reverse engineer or disrupt the core service.",
            ].map((rule, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "rgba(99,102,241,0.20)",
                    border: "1px solid rgba(99,102,241,0.30)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#a5b4fc",
                  }}
                >
                  {idx + 1}
                </div>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#e2e8f0", lineHeight: 1.6 }}>{rule}</span>
              </div>
            ))}
          </div>
        </TermsSection>

        {/* Section 2: Liability */}
        <TermsSection
          title="Liability"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgb(240,171,252)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
          iconBg="rgba(217,70,239,0.15)"
          iconBorder="rgba(217,70,239,0.25)"
        >
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
            Our App is provided "as is" and "as available". We shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages — including loss of profits, goodwill, data, or other intangible losses resulting from the use or inability to use the App.
          </p>
        </TermsSection>

        {/* Section 3: Service scope */}
        <TermsSection
          title="Service scope"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgb(147,197,253)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
          iconBg="rgba(59,130,246,0.15)"
          iconBorder="rgba(59,130,246,0.25)"
        >
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
            We reserve the right to modify or terminate the service for any reason, without notice at any time. We also reserve the right to refuse service to anyone at any time. The features and functionality of the App may change as we continue to improve the service.
          </p>
        </TermsSection>

        {/* Section 4: Support */}
        <TermsSection
          title="Support"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgb(110,231,183)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          iconBg="rgba(16,185,129,0.15)"
          iconBorder="rgba(16,185,129,0.25)"
        >
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7, margin: "0 0 20px 0" }}>
            If you have any questions regarding these terms, please reach out to our team.
          </p>
          <a
            href="mailto:support@example.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#ffffff",
              background: "rgba(79,70,229,0.75)",
              border: "1px solid rgba(99,102,241,0.35)",
              textDecoration: "none",
              boxShadow: "0 0 18px rgba(79,70,229,0.45)",
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
        </TermsSection>

        {/* Footer */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            marginTop: "8px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 500, color: "#e2e8f0" }}>
            &copy; {new Date().getFullYear()} Smart Discount App
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link to="/privacy" style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textDecoration: "none" }}>
              Privacy
            </Link>
            <Link to="/terms" style={{ fontSize: "12px", fontWeight: 600, color: "#818cf8", textDecoration: "none" }}>
              Terms
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function TermsSection({
  title,
  icon,
  iconBg,
  iconBorder,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        background: "rgba(0,0,0,0.50)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: "20px",
        padding: "24px 28px",
        backdropFilter: "blur(24px)",
        boxShadow: "0 0 30px rgba(0,0,0,0.3)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: iconBg,
            border: `1px solid ${iconBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#f8fafc",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}