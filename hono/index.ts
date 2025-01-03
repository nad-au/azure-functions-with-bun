import { Hono } from "hono";
import { type Serve } from "bun";

const app = new Hono();

// Matches endpoint directory name
app.post("name-check", async (c) => {
  const body = await c.req.json();
  console.log('body', JSON.stringify(body));

  const userAgent = c.req.header("user-agent");
  console.log(`user agent is: ${userAgent}`);

  const invocationId = c.req.header("x-azure-functions-invocationid");
  console.log(`invocationid is: ${invocationId}`);

  const name = body.Data.req.Params.name ?? 'nothing';
  if (name === "bun") {
    return c.json({
      Outputs: {
        res: {
          statusCode: "200",
          body: "Correct answer. Bun FTW!!",
        },
      }
    });
  }
  return c.json({
    Outputs: {
      res: {
        statusCode: "400",
        body: `No, best not use ${name}`,
      },
    }
  });
});

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

export default {
  fetch: app.fetch,
  port,
} satisfies Serve;
