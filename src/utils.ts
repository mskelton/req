import { RequestData } from "./types.js"

export const isJSON = (request: RequestData) =>
  request.headers?.["Content-Type" as keyof typeof request.headers] ===
    "application/json" && request.body
