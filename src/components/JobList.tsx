import { memo } from "react"

import type { JobApplication } from "../lib/types"
import { JobCard } from "./JobCard"

interface JobListProps {
  jobs: JobApplication[]
  onMarkAsApplied: (id: string) => void
  onDelete: (id: string) => void
  onViewDetails: (id: string) => void
  onOpenUrl: (url: string) => void
}

export const JobList = memo(function JobList({
  jobs,
  onMarkAsApplied,
  onDelete,
  onViewDetails,
  onOpenUrl
}: JobListProps) {
  const sortedJobs = [...jobs].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  )

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12">
        <p className="text-4xl mb-2">📋</p>
        <p className="text-sm">No saved jobs yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Visit a job page and click "Save This Job"
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sortedJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onMarkAsApplied={onMarkAsApplied}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onOpenUrl={onOpenUrl}
        />
      ))}
    </div>
  )
})
