export const Status={
    Success:"success",
    Loading:"loading",
    Error:"error"
} as const

export type StatusType=(typeof Status)[keyof typeof Status];