export class ReqError extends Error {
  constructor(
    message: string,
    public code: number,
    public request: RequestInit,
    public response: Response,
  ) {
    super(message)
  }
}
