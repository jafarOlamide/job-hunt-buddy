import { useEffect, useState } from "react"
import browser from "webextension-polyfill"

import { Button } from "../components/Button"
import type { BrowserRuntimeResponse, JobApplication } from "../lib/types"

import "../style.css"

import CloseIcon from "~src/components/Icons/CloseIcon"
import formatDate from "~src/utils/dateFormat"

function JobDetailPage() {
  const [job, setJob] = useState<JobApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadJobDetails()
  }, [])

  const loadJobDetails = async () => {
    try {
      const params = new URLSearchParams(window.location.search)
      const jobId = params.get("id")

      if (!jobId) {
        setError("No job ID provided")
        setLoading(false)
        return
      }

      const response: BrowserRuntimeResponse =
        await browser.runtime.sendMessage({
          type: "GET_JOBS"
        })

      const allJobs = response.jobs || []
      const foundJob = allJobs.find((j) => j.id === jobId)

      if (!foundJob) {
        setError("Job not found")
      } else {
        setJob(foundJob)
      }
    } catch (err) {
      setError("Failed to load job details")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenUrl = () => {
    if (job) {
      browser.tabs.create({ url: job.url })
    }
  }

  const handleMarkAsApplied = async () => {
    if (!job) return

    try {
      await browser.runtime.sendMessage({
        type: "UPDATE_JOB",
        payload: {
          id: job.id,
          updates: {
            status: "applied",
            appliedAt: new Date().toISOString()
          }
        }
      })

      setJob((prev) =>
        prev
          ? {
              ...prev,
              status: "applied",
              appliedAt: new Date().toISOString()
            }
          : null
      )
    } catch (err) {
      alert("Failed to update job status")
    }
  }

  const handleDelete = async () => {
    if (!job) return
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      await browser.runtime.sendMessage({
        type: "DELETE_JOB",
        payload: { id: job.id }
      })

      alert("Job deleted successfully")
      window.close()
    } catch (err) {
      console.error("Failed to delete job:", err)
      alert("Failed to delete job")
    }
  }

  const handleCloseTab = () => {
    window.close()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Job not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            The job you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={handleCloseTab} variant="primary">
            Close Tab
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCloseTab}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              aria-label="Go back">
              <span className="font-medium">
                <CloseIcon />
              </span>
            </button>

            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={handleOpenUrl}>
                Open Original
              </Button>
              {job.status === "saved" && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={handleMarkAsApplied}>
                  Mark as Applied
                </Button>
              )}
              <Button size="sm" variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex-1">
              {job.title}
            </h1>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap ${
                job.status === "applied"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
              {job.status === "applied" ? "Applied" : "Saved"}
            </span>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Saved: {formatDate(job.savedAt)}</span>
            </div>
            {job.appliedAt && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Applied: {formatDate(job.appliedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Job Description
          </h2>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">
              {job.description || "No description available"}
            </div>
          </div>
        </div>

        {/* Job URL Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Original Job Posting
          </h3>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm break-all hover:underline">
            {job.url}
          </a>
        </div>
      </main>
    </div>
  )
}

export default JobDetailPage
