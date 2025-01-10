import type { Handler } from './handler'
import { AzureFunctionsCustomLogger } from './logger'

export class Router {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  constructor(private readonly handlers: Handler<any>[]) {}

  async route(req: Request): Promise<Response> {
    console.log('Request:', JSON.stringify(req))
    for (const handler of this.handlers) {
      if (await handler.canHandle(req)) {
        const logger = new AzureFunctionsCustomLogger()
        const body = await req.json()
        const result = await handler.parse(body, logger)
        if (result.ok) {
          const outputs = await handler.handle({
            headers: req.headers,
            body: result.val,
            logger,
          })
          const logs = logger.get()
          return Response.json({
            Outputs: outputs,
            Logs: logs,
          })
        }

        if (handler.config?.throwOnError)
          throw new Error(
            `Error parsing request: ${JSON.stringify(result.val)}`,
          )
        const logs = logger.get()
        return Response.json({
          Outputs: result.val,
          Logs: logs,
        })
      }
    }
    return new Response('Not Found', { status: 404 })
  }
}
