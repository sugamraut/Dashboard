export const Status={
    Success:"success",
    Loading:"loading",
    Error:"error",
    Idle:"idle"
} as const

export type StatusType=(typeof Status)[keyof typeof Status];