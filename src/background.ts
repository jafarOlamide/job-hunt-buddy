import browser from "webextension-polyfill";
import { v4 as uuidv4 } from "uuid";
import { saveJob, updateJob, deleteJob, getJobs } from "./lib/storage";
import type { BrowserRuntimeMessage, BrowserTabSendMessage, JobApplication } from "./lib/types";
import { ErrorCodes, ExtensionError } from "./lib/errors";


browser.runtime.onMessage.addListener((message: BrowserRuntimeMessage, sender, sendResponse) => {
  (async () => {
    if (message.type === "SCRAPE_REQUEST") {
      try {
        // Get the current active tab
        const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });

        if (!activeTab.id) {
          throw new ExtensionError("No active tab found", ErrorCodes.NO_ACTIVE_TAB)
        }

        const response: BrowserTabSendMessage = await browser.tabs.sendMessage(activeTab.id, {
          type: "SCRAPE_REQUEST"
        });

        if (response.type === "SCRAPE_RESULT") {
          const { url, title, description } = response.payload;

          // Prevent double entry of jobs
          const existingJobs = await getJobs();
          const urlExists = existingJobs.find((job) => job.url === url);

          if (urlExists) {
            throw new ExtensionError("You already saved this job", ErrorCodes.DUPLICATE_JOB)
          }

          // Create a new job application object
          const newJob: JobApplication = {
            id: uuidv4(),
            url,
            title,
            description,
            status: "saved",
            savedAt: new Date().toISOString(),
            appliedAt: undefined
          };

          await saveJob(newJob);

          sendResponse({ success: true, job: newJob });
          return;
        }
      } catch (error) {
        sendResponse({ success: false, error: String(error) });
        return;
      }
    }

    if (message.type === "GET_JOBS") {
      const jobs = await getJobs();
      sendResponse({ jobs });
      return;
    }

    if (message.type === "UPDATE_JOB") {
      await updateJob(message.payload.id, message.payload.updates);
      sendResponse({ success: true });
      return;
    }

    if (message.type === "DELETE_JOB") {
      await deleteJob(message.payload.id);
      sendResponse({ success: true });
      return;
    }
  })();

  return true;
});

browser.runtime.onInstalled.addListener(() => {
  console.log("Job Tracker extension installed successfully!");
});
