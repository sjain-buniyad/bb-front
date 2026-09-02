"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "../../../../components/AuthGuard";
import Sidebar from "../../../../components/Sidebar";
import ProjectSidebar from "../../../../components/project/Sidebar";
import TopHeader from "../../../../components/TopHeader";
import { getProject, type Project } from "../../../../lib/api";

type ProjectDetails = Project & { contractor?: string };

const formatDate = (date?: string) => {
  if (!date) return "Not set";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

function DetailCard({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-[#e4e4e7] bg-[#ffffff] p-5">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </p>
      <p className="mt-1.5 break-words text-sm font-medium text-zinc-800">
        {value || "Not assigned"}
      </p>
    </div>
  );
}

export default function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getProject(projectId)
      .then((data) => {
        if (active) setProject(data);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Failed to load project",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  useEffect(() => {
    const sidebar = document.querySelector<HTMLElement>(
      '[data-sidebar="project"]',
    );
    const main = mainRef.current;
    if (!sidebar || !main) return;

    const syncSidebar = () => {
      main.style.marginLeft = `${72 + sidebar.offsetWidth}px`;
    };
    syncSidebar();

    const observer = new MutationObserver(syncSidebar);
    observer.observe(sidebar, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    window.addEventListener("resize", syncSidebar);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncSidebar);
    };
  }, []);

  const contractor = project?.contractor || project?.contrator;

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#f7f7f8]">
        <Sidebar hoverable />
        <ProjectSidebar projectId={projectId} />

        <div
          ref={mainRef}
          className="flex min-h-screen flex-1 flex-col transition-all duration-300"
        >
          <TopHeader />

          <main className="flex-1 space-y-6 p-6 lg:p-8">
            <button
              type="button"
              onClick={() => router.push("/dashboard/projects")}
              className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-800"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to projects
            </button>

            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-[#e4e4e7] bg-[#ffffff]">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-accent" />
                  <p className="text-sm text-zinc-500">Loading project...</p>
                </div>
              </div>
            ) : error || !project ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                <h1 className="text-lg font-semibold text-zinc-900">
                  Project unavailable
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                  {error || "The selected project could not be found."}
                </p>
              </div>
            ) : (
              <>
                <section className="rounded-xl border border-[#e4e4e7] bg-[#ffffff] p-6 lg:p-8">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-md border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent">
                      {project.type || "Project"}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Project dashboard
                    </span>
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
                    {project.name || "Untitled project"}
                  </h1>
                  {project.description && (
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
                      {project.description}
                    </p>
                  )}
                </section>

                <section>
                  <h2 className="mb-3 text-sm font-semibold text-zinc-800">
                    Project details
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <DetailCard
                      label="Start date"
                      value={formatDate(project.start_date)}
                    />
                    <DetailCard
                      label="End date"
                      value={formatDate(project.end_date)}
                    />
                    <DetailCard label="Manager" value={project.manager} />
                    <DetailCard label="Developer" value={project.developer} />
                    <DetailCard label="Contractor" value={contractor} />
                    <DetailCard label="Consultant" value={project.consultant} />
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
