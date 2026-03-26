
export enum ErrorCodes {
    NO_ACTIVE_TAB = "NO_ACTIVE_TAB",
    DUPLICATE_JOB = "DUPLICATE JOB"
}
export class ExtensionError extends Error{
    constructor (
        message: string,
        public code?: string,
        public details?: unknown
    ){
        super(message)
    }
}