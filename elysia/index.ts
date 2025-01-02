import { Elysia } from 'elysia'

new Elysia({ prefix: '/api' })
  .get('/SimpleHttpTrigger', ({ headers }) => {
    const userAgent = headers["user-agent"];
    console.log(`user agent is: ${userAgent}`);

    const invocationId = headers["x-azure-functions-invocationid"];
    console.log(`invocationid is: ${invocationId}`);

    return 'Hello World from Elysia'
  })
  .listen(parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000"))