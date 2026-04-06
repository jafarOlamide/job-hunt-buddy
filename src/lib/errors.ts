
export enum ErrorCodes {
    NO_ACTIVE_TAB = "NO_ACTIVE_TAB",
    DUPLICATE_JOB = "DUPLICATE JOB",
    NOT_A_JOB_PAGE = "NOT_A_JOB_PAGE"
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