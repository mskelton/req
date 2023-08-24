import { ReqError } from "./error.js"
import { parseResponse } from "./parse.js"
import {
  HookType,
  RequestData,
  RequestHook,
  RequestOptions,
  RequestResult,
} from "./types.js"
import { isJSON } from "./utils.js"

export class Req {
  baseURL?: string
  headers: Record<string, string> = {}
  #hooks: RequestHook[] = []

  constructor(public readonly base?: Req) {
    if (base) {
      this.baseURL = base.baseURL
      this.headers = base.headers
      this.#hooks = base.#hooks
    }
  }

  extend() {
    return new Req(this)
  }

  use(type: "request", fn: (data: RequestData) => RequestData): void
  use(type: "response", fn: (data: unknown) => unknown): void
  use(type: "error", fn: (data: ReqError) => ReqError): void
  use<T>(type: HookType, fn: (data: T) => T): void {
    this.#hooks.push({ fn: fn as any, type })
  }

  #applyHooks<T>(type: HookType, data: T): T {
    return this.#hooks
      .filter((hook) => hook.type === type)
      .reduce((acc, hook) => hook.fn(acc), data)
  }

  #err(
    message: string,
    status: number,
    data: RequestData,
    res: Response,
  ): ReqError {
    return this.#applyHooks("error", new ReqError(message, status, data, res))
  }

  async request<T>(
    url: string,
    options: RequestOptions,
  ): Promise<RequestResult<T>> {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    const request = this.#applyHooks("request", {
      ...options,
      headers,
      url: (this.baseURL ?? "") + url,
    })

    const res = await fetch(request.url, {
      ...request,
      body: isJSON(request)
        ? JSON.stringify(request.body)
        : (request.body as BodyInit),
    })

    if (!res.ok) {
      throw this.#err(
        `Failed to fetch ${request.url} with status ${res.status}.`,
        res.status,
        request,
        res,
      )
    }

    try {
      const parsed = await parseResponse<T>(res)
      return this.#applyHooks<T>("response", parsed)
    } catch (e) {
      throw this.#err(
        `Failed to fetch ${request.url} with status ${res.status}.`,
        res.status,
        request,
        res,
      )
    }
  }

  options<T>(url: string, options?: RequestOptions) {
    return this.request<T>(url, { method: "OPTIONS", ...options })
  }

  head<T>(url: string, options?: RequestOptions): Promise<RequestResult<T>> {
    return this.request<T>(url, { method: "HEAD", ...options })
  }

  get<T>(url: string, options?: RequestOptions): Promise<RequestResult<T>> {
    return this.request<T>(url, { method: "GET", ...options })
  }

  post<T>(
    url: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<RequestResult<T>> {
    return this.request<T>(url, { body, method: "POST", ...options })
  }

  put<T>(
    url: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<RequestResult<T>> {
    return this.request<T>(url, { body, method: "PUT", ...options })
  }

  patch<T>(
    url: string,
    body: unknown,
    options?: RequestOptions,
  ): Promise<RequestResult<T>> {
    return this.request<T>(url, { body, method: "PATCH", ...options })
  }

  delete<T>(url: string, options?: RequestOptions): Promise<RequestResult<T>> {
    return this.request<T>(url, { method: "DELETE", ...options })
  }
}
