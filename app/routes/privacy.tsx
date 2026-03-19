import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { GrainGradient } from '@paper-design/shaders-react';

export const meta: MetaFunction = () => {
  return [
    { title: "Privacy Policy - Shopify App" },
    { name: "description", content: "Privacy Policy for our Shopify App" },
  ];
};

export default function Privacy() {
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
      {/* Background */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
            Privacy Policy
          </h1>

          <p style={{ fontSize: "13px", fontWeight: 500, color: "#64748b", margin: 0 }}>
            Last updated:{" "}
            <span style={{ color: "#cbd5e1" }}>
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </p>
        </div>

        {/* Section: What data we collect */}
        <PolicySection
          title="What data we collect"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgb(165,180,252)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          iconBg="rgba(99,102,241,0.15)"
          iconBorder="rgba(99,102,241,0.25)"
        >
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7, margin: "0 0 16px 0" }}>
            To provide our services, we collect information from your Shopify store, including:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {['Order info', 'Product details', 'Store settings', 'Customer identifiers'].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#818cf8", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0" }}>{item}</span>
              </div>
            ))}
          </div>
        </PolicySection>

        {/* Section: How we use your data */}
        <PolicySection
          title="How we use your data"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgb(240,171,252)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          iconBg="rgba(217,70,239,0.15)"
          iconBorder="rgba(217,70,239,0.25)"
        >
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
            We use collected information exclusively to provide and improve our App's services — including managing discount thresholds, processing order-related logic, and providing store analytics within your dashboard.
          </p>
        </PolicySection>

        {/* Section: Data storage */}
        <PolicySection
          title="Data storage"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgb(147,197,253)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          iconBg="rgba(59,130,246,0.15)"
          iconBorder="rgba(59,130,246,0.25)"
        >
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>
            Your data is stored securely using industry-standard encryption protocols. It's retained only as long as necessary and automatically removed when the App is uninstalled — in full accordance with Shopify's data protection policies.
          </p>
        </PolicySection>

        {/* Section: Contact */}
        {/* <PolicySection
          title="Contact us"
          icon={
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="rgb(110,231,183)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          iconBg="rgba(16,185,129,0.15)"
          iconBorder="rgba(16,185,129,0.25)"
        >
          <p style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7, margin: "0 0 20px 0" }}>
            Questions about this policy or how we handle your data? We're happy to help.
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
              transition: "background 0.2s",
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@example.com
          </a>
        </PolicySection> */}

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
            <Link to="/privacy" style={{ fontSize: "12px", fontWeight: 600, color: "#818cf8", textDecoration: "none" }}>
              Privacy
            </Link>
            <Link to="/terms" style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textDecoration: "none" }}>
              Terms
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function PolicySection({
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
      {/* Header */}
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