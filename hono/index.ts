import { Hono } from "hono";
import { type Serve } from "bun";

const app = new Hono().basePath("/api");

app.get("/simplehttptrigger", (c) => {
  const userAgent = c.req.header("user-agent");
  console.log(`user agent is: ${userAgent}`);

  const invocationId = c.req.header("x-azure-functions-invocationid");
  console.log(`invocationid is: ${invocationId}`);

  return c.text("Hello World from Hono");
});

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

export default {
  fetch: app.fetch,
  port,
} satisfies Serve;
