export type RequestResult<T> = T

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

export interface RequestData extends RequestOptions {
  url: string
}

export type HookType = "error" | "request" | "response"

export interface RequestHook {
  fn: <T>(data: T) => T
  type: HookType
}
