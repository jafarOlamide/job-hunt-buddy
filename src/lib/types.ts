export type ApplicationStatus = "saved" | "applied";

export type Platform = "linkedin" | "greenhouse" | "lever" | "workday" | "workable" | "ashby" | "generic";

export interface JobApplication {
    id: string;
    url: string;
    title: string;
    company: string;
    description: string;
    status: ApplicationStatus;
    savedAt: string;
    appliedAt?: string;
}


type Message =
    | { type: "SCRAPE_REQUEST" }
    | { type: "SCRAPE_RESULT"; payload: Pick<JobApplication, "url" | "title" | "description"> }

export interface BrowserRuntimeResponse {
    success: unknown;
    error: unknown;
    jobs: JobApplication[]
}

export interface BrowserRuntimeMessage {
    type: string
    payload: {
        id: string
        updates: unknown
    }
}

export interface BrowserTabSendMessage {
    type: string;
    payload: {
        url: string;
        title: string;
        company: string;
        description: string;
        isJobPage: boolean;
    };
}