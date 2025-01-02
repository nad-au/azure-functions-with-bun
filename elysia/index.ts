import { Elysia } from 'elysia'

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

new Elysia({ prefix: '/api' })
  .get('/simplehttptrigger', ({ headers }) => {
    const userAgent = headers["user-agent"];
    console.log(`user agent is: ${userAgent}`);

    const invocationId = headers["x-azure-functions-invocationid"];
    console.log(`invocationid is: ${invocationId}`);

    return 'Hello World from Elysia'
  })
  .listen(port)