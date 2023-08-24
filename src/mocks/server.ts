import { rest } from "msw"
import { setupServer, SetupServer } from "msw/node"

export const server: SetupServer = setupServer(
  rest.all("http://localhost/method", (req, res, ctx) => {
    return res(ctx.json({ method: req.method, success: true }))
  }),
  rest.all("http://localhost/body", async (req, res, ctx) => {
    return res(
      ctx.json({
        body: await req.json(),
        method: req.method,
        success: true,
      }),
    )
  }),
)
