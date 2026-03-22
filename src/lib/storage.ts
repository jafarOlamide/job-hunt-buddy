import browser from "webextension-polyfill";
import type { JobApplication } from "./types";

export const getJobs = async (): Promise<JobApplication[]> => {
    const result = await browser.storage.local.get("jobs");
    return (result.jobs as JobApplication[]) ?? [];
};

export const saveJob = async (job: JobApplication): Promise<void> => {
    const jobs = await getJobs();
    await browser.storage.local.set({ jobs: [...jobs, job] });
};

export const updateJob = async (id: string, updates: Partial<JobApplication>): Promise<void> => {
    const jobs = await getJobs();
    const updated = jobs.map(j => j.id === id ? { ...j, ...updates } : j);
    await browser.storage.local.set({ jobs: updated });
};

export const deleteJob = async (id: string): Promise<void> => {
    const jobs = await getJobs();
    await browser.storage.local.set({ jobs: jobs.filter(j => j.id !== id) });
};