"use client";

import { useState, useEffect, useRef } from "react";
import type { ClientSnapshot } from "@/lib/types";
import { OverviewSection } from "./sections/OverviewSection";
import { RoadmapSection } from "./sections/RoadmapSection";
import { KeywordsSection } from "./sections/KeywordsSection";
import { PerformanceSection } from "./sections/PerformanceSection";
import { ResourcesSection } from "./sections/ResourcesSection";

type Section = "overview" | "roadmap" | "keywords" | "performance" | "resources";

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="11" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="11" width="6" height="6" rx="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    id: "roadmap",
    label: "Roadmap & Phases",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="3" cy="3" r="2" />
        <circle cx="15" cy="9" r="2" />
        <circle cx="3" cy="15" r="2" />
        <path d="M5 3h4a4 4 0 0 1 4 4v2" />
        <path d="M13 9H9a4 4 0 0 0-4 4v2" />
      </svg>
    ),
  },
  {
    id: "keywords",
    label: "Keywords & Content",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="7.5" r="5.5" />
        <path d="M16 16l-3.5-3.5" />
      </svg>
    ),
  },
  {
    id: "performance",
    label: "Performance",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 13 5 8 9 11 17 3" />
        <polyline points="12 3 17 3 17 8" />
      </svg>
    ),
  },
  {
    id: "resources",
    label: "Resources",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 16H4a2 2 0 0 1-2-2V2h10l4 4v10z" />
        <path d="M12 2v4h4" />
        <line x1="6" y1="9" x2="12" y2="9" />
        <line x1="6" y1="12" x2="10" y2="12" />
      </svg>
    ),
  },
];

function HorseshoeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M6 22V12a8 8 0 1 1 16 0v10"
        stroke="#C41230"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="6" cy="22" r="2" fill="#C41230" />
      <circle cx="22" cy="22" r="2" fill="#C41230" />
    </svg>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ProjectShell({
  snapshot,
  clientName,
}: {
  snapshot: ClientSnapshot;
  clientName: string;
}) {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // Close sidebar on outside click (mobile)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sidebarOpen]);

  function handleNavClick(id: Section) {
    setActiveSection(id);
    setSidebarOpen(false);
  }

  function renderSection() {
    switch (activeSection) {
      case "overview":
        return <OverviewSection snapshot={snapshot} />;
      case "roadmap":
        return <RoadmapSection snapshot={snapshot} />;
      case "keywords":
        return <KeywordsSection snapshot={snapshot} />;
      case "performance":
        return <PerformanceSection snapshot={snapshot} />;
      case "resources":
        return <ResourcesSection snapshot={snapshot} />;
    }
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#FAF9F7" }}>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-40 flex h-full w-[260px] flex-col border-r border-gray-200 bg-white
          transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Branding */}
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-5">
          <HorseshoeIcon />
          <div className="min-w-0">
            <p
              className="text-[15px] font-semibold leading-tight"
              style={{ color: "#1C1C1C" }}
            >
              Cavallo Inc.
            </p>
            <p className="text-[12px] leading-tight text-gray-400">
              SEO Project Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[14px] font-medium
                      transition-colors duration-100
                      ${
                        isActive
                          ? "border-l-2"
                          : "border-l-2 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                      }
                    `}
                    style={
                      isActive
                        ? {
                            backgroundColor: "#FEF2F2",
                            color: "#C41230",
                            borderLeftColor: "#C41230",
                          }
                        : undefined
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-[11px] text-gray-400">Last updated</p>
          <p className="text-[12px] text-gray-500">
            {formatDate(snapshot.lastUpdated)}
          </p>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded p-1 text-gray-600 hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="19" y2="6" />
              <line x1="3" y1="11" x2="19" y2="11" />
              <line x1="3" y1="16" x2="19" y2="16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <HorseshoeIcon />
            <span
              className="text-[15px] font-semibold"
              style={{ color: "#1C1C1C" }}
            >
              Cavallo Inc.
            </span>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1100px] px-6 py-8 lg:px-10 lg:py-10">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
}
