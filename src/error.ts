import { RequestData } from "./types.js"

export class ReqError extends Error {
  constructor(
    message: string,
    public code: number,
    public request: RequestData,
    public response: Response,
  ) {
    super(message)
  }
}
