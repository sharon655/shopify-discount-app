import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { GrainGradient } from '@paper-design/shaders-react';
import { login } from "../../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [shop, setShop] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isLoggingIn = navigation.state === "submitting" && navigation.formAction === "/auth/login";

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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Decorative Background Mesh */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
        {/* Full-screen Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[20px]" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10 w-full max-w-6xl mx-auto">
        <div className="w-full flex-1 flex flex-col items-center justify-center text-center space-y-12 py-16">
          
          {/* Header Section */}
          <div className="space-y-6 max-w-3xl animate-fade-in-up bg-black/40 p-8 rounded-3xl backdrop-blur-md shadow-2xl border border-white/5">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Smarter Discounts for Shopify
            </h1>
            <p className="text-lg lg:text-xl text-slate-100 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)] font-medium">
              Take complete control of your promotional budgets. Set percentage or fixed-amount limits and let our app automatically disable codes before you overspend.
            </p>
          </div>

          {/* Login Card */}
          {showForm && (
            <div className="w-full max-w-md bg-black/60 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              
              <Form method="post" action="/auth/login" className="relative space-y-6">
                <div className="space-y-2 text-left">
                  <label htmlFor="shop" className="block text-sm font-semibold text-slate-200">
                    Store domain
                  </label>
                  <div className="relative">
                    <input
                      id="shop"
                      type="text"
                      name="shop"
                      value={shop}
                      onChange={(e) => setShop(e.target.value)}
                      placeholder="e.g. my-shop.myshopify.com"
                      className="w-full bg-black/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!shop}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-md font-bold text-white bg-indigo-600/90 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_rgba(79,70,229,0.8)] backdrop-blur-md"
                >
                  Install / Log In to App
                </button>
              </Form>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full text-left">
            <FeatureCard 
              title="Budget Caps" 
              description="Define exact maximum spending limits for your discounts, either as a percentage or a strict flat rate."
              icon={
                <svg className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <FeatureCard 
              title="Auto Deactivation" 
              description="Sleep easy knowing our Shopify logic automatically kills the code the second your budget threshold is reached."
              icon={
                <svg className="w-6 h-6 text-fuchsia-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
            <FeatureCard 
              title="Native Integration" 
              description="Built directly into Shopify Admin. Toggle discounts, review usage, and tweak amounts without leaving your dashboard."
              icon={
                <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
          </div>
        </div>
      </main>
       {/* Footer */}
      <footer
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "960px",
          margin: "0 auto",
          padding: "20px 20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 500, color: "#e2e8f0" }}>
          &copy; {new Date().getFullYear()} Smart Discount App
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link
            to="/privacy"
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textDecoration: "none" }}
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textDecoration: "none" }}
          >
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="bg-black/60 border border-white/20 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.3)] lg:hover:bg-black/80 transition-colors duration-300">
      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{title}</h3>
      <p className="text-slate-200 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  );
}
