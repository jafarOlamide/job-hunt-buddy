import "./style.css"

import { Button } from "./components/Button"
import { JobList } from "./components/JobList"
import { useJobs } from "./hooks/useJobs"

function IndexPopup() {
  const {
    jobs,
    loading,
    message,
    handleSaveJob,
    handleDeleteJob,
    handleMarkAsApplied,
    handleViewDetails,
    handleOpenJob
  } = useJobs()

  return (
    <div className="w-[400px] h-[600px] bg-gray-50 flex flex-col">
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Job Hunt Buddy</h1>
        <p className="text-sm text-blue-100">
          Easily visualise your job hunting
        </p>
      </div>

      <div className="p-4 bg-white border-b border-gray-200">
        <Button onClick={handleSaveJob} loading={loading} fullWidth size="lg">
          <span>💾</span>
          Save This Job
        </Button>
      </div>

      {message && (
        <div
          className={`mx-4 mt-4 p-3 rounded-lg text-sm font-medium ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
          {message.text}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <JobList
          jobs={jobs}
          onMarkAsApplied={handleMarkAsApplied}
          onDelete={handleDeleteJob}
          onViewDetails={handleViewDetails}
          onOpenUrl={handleOpenJob}
        />
      </div>
    </div>
  )
}

export default IndexPopup
