export function parseResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("Content-Type")

  if (contentType?.includes("json")) {
    return res.json() as Promise<T>
  } else if (contentType === "text/plain") {
    return res.text() as Promise<T>
  }

  return res.blob() as Promise<T>
}
