import formatDate from "~src/utils/dateFormat"

import type { JobApplication } from "../lib/types"
import { Button } from "./Button"

interface JobCardProps {
  job: JobApplication
  onMarkAsApplied: (id: string) => void
  onDelete: (id: string) => void
  onViewDetails: (id: string) => void
  onOpenUrl: (url: string) => void
}

export function JobCard({
  job,
  onMarkAsApplied,
  onDelete,
  onViewDetails,
  onOpenUrl
}: JobCardProps) {
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job?")) {
      onDelete(job.id)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header: Title + Link Icon */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
          {job.title || "Untitled Job"}
        </h3>
        <button
          onClick={() => onOpenUrl(job.url)}
          className="text-blue-600 hover:text-blue-800 flex-shrink-0"
          title="Open job posting"
          aria-label="Open job posting in new tab">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
            job.status === "applied"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}>
          {job.status === "applied" ? "Applied" : "Saved"}
        </span>
      </div>

      {/* Dates */}
      <div className="text-xs text-gray-600 space-y-1 mb-3">
        <p>Saved: {formatDate(job.savedAt)}</p>
        {job.appliedAt && <p>Applied: {formatDate(job.appliedAt)}</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onViewDetails(job.id)}
          className="flex-1">
          View Details
        </Button>

        {job.status === "saved" && (
          <Button
            size="sm"
            variant="success"
            onClick={() => onMarkAsApplied(job.id)}
            className="flex-1">
            Mark as Applied
          </Button>
        )}

        <Button size="sm" variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}
