import { useEffect, useState } from "react"
import browser from "webextension-polyfill"
import type { BrowserRuntimeResponse, JobApplication } from "~src/lib/types"


export const useJobs = () => {
    const [jobs, setJobs] = useState<JobApplication[]>([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{
    text: string
    type: "success" | "error"
    } | null>(null)

    useEffect(() => {
        loadJobs()
    }, []);
    
    const loadJobs = async () => {
        try {
          const response: BrowserRuntimeResponse =
            await browser.runtime.sendMessage({ type: "GET_JOBS" })
          setJobs(response.jobs || [])
        } catch (error) {
            setMessage({text: "Error Loading Jobs!", type: "error"})
        }
    }

    const handleSaveJob = async () => {
        setLoading(true)
        setMessage(null)
    
        try {
          const response: BrowserRuntimeResponse =
            await browser.runtime.sendMessage({ type: "SCRAPE_REQUEST" })
    
          if (response.success) {
            setMessage({ text: "Job saved successfully!", type: "success" })
            await loadJobs()
          } else {
            setMessage({
              text: `${response.error || "Failed to save job"}`,
              type: "error"
            })
          }
        } catch (error) {
          setMessage({ text: "Error: " + String(error), type: "error" })
        } finally {
          setLoading(false)
          setTimeout(() => setMessage(null), 3000)
        }
    }

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
            })

            setJobs((prev) =>
                prev.map((job) =>
                job.id === jobId
                    ? { ...job, status: "applied", appliedAt: new Date().toISOString() }
                    : job
                )
            )

            setMessage({ text: "Marked as applied!", type: "success" })
            setTimeout(() => setMessage(null), 2000)
        } catch (error) {
            setMessage({
                text: "Error updating job",
                type: "error"
            })
        }
    } 

    const handleDeleteJob = async (jobId: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return

        try {
            await browser.runtime.sendMessage({
                type: "DELETE_JOB",
                payload: { id: jobId }
            })

            setJobs((prev) => prev.filter((job) => job.id !== jobId))

            setMessage({ text: "Job deleted", type: "success" })
            setTimeout(() => setMessage(null), 2000)
        } catch (error) {
            setMessage({
                text: "Error deleting job:",
                type: "error"
            })
        }
    }

    const handleOpenJob = (url: string) => {
        browser.tabs.create({ url })
    }

    const handleViewDetails = (jobId: string) => {
        const detailUrl = browser.runtime.getURL(`tabs/job-detail.html?id=${jobId}`)
        browser.tabs.create({ url: detailUrl })
    }

    return {
        jobs,
        loading,
        message,
        handleSaveJob,
        handleMarkAsApplied,
        handleDeleteJob,
        handleOpenJob,
        handleViewDetails
    }
}