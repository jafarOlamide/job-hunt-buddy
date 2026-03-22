import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import type { BrowserRuntimeResponse, JobApplication } from "./lib/types";
import "./style.css";


function IndexPopup() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response: BrowserRuntimeResponse = await browser.runtime.sendMessage({ type: "GET_JOBS" });
      console.log(jobs)
      setJobs(response.jobs || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }
  };

  const handleSaveJob = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response: BrowserRuntimeResponse  = await browser.runtime.sendMessage({ type: "SCRAPE_REQUEST" });

      if (response.success) {
        setMessage({ text: "✅ Job saved successfully!", type: "success" });
        await loadJobs();
      } else {
        console.log('error response!!',response)
        setMessage({ text: `${response.error || 'Failed to save job'}`, type: "error" });
      }
    } catch (error) {
      console.error("Error saving job:", error);
      setMessage({ text: "❌ Error: " + String(error), type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleMarkAsApplied = async (jobId: string) => {
    try {
      await browser.runtime.sendMessage({
        type: "UPDATE_JOB",
        payload: {
          id: jobId,
          updates: {
            status: "applied",
            appliedAt: new Date().toISOString()
          }
        }
      });

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? { ...job, status: "applied", appliedAt: new Date().toISOString() }
            : job
        )
      );

      setMessage({ text: "✅ Marked as applied!", type: "success" });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await browser.runtime.sendMessage({
        type: "DELETE_JOB",
        payload: { id: jobId }
      });

      setJobs((prev) => prev.filter((job) => job.id !== jobId));

      setMessage({ text: "🗑️ Job deleted", type: "success" });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleOpenJob = (url: string) => {
    browser.tabs.create({ url });
  };


  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };


  return (
    <div className="w-[400px] h-[600px] bg-gray-50 flex flex-col">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Job Tracker</h1>
        <p className="text-sm text-blue-100">Track your job applications</p>
      </div>

      <div className="p-4 bg-white border-b border-gray-200">
        <button
          onClick={handleSaveJob}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <span>💾</span>
              Save This Job
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`mx-4 mt-4 p-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {jobs.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm">No saved jobs yet</p>
            <p className="text-xs text-gray-400 mt-1">Visit a job page and click "Save This Job"</p>
          </div>
        ) : (
          jobs
            .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
            .map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                    {job.title || "Untitled Job"}
                  </h3>
                  {/* LINK ICON */}
                  <button
                    onClick={() => handleOpenJob(job.url)}
                    className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                    title="Open job posting"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      job.status === "applied"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {job.status === "applied" ? "Applied" : "Saved"}
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1 mb-3">
                  <p>Saved: {formatDate(job.savedAt)}</p>
                  {job.appliedAt && <p>Applied: {formatDate(job.appliedAt)}</p>}
                </div>

                <div className="flex gap-2">
                  {job.status === "saved" && (
                    <button
                      onClick={() => handleMarkAsApplied(job.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors duration-200"
                    >
                      Mark as Applied
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default IndexPopup;

