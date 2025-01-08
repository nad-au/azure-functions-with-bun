import type { Handler } from "./handler";
import { AzureFunctionsCustomLogger } from "./logger";
import { nameCheck } from "./name-check/name-check";
import { receiveOrder } from "./receive-order/receive-order";

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

export class Router {

  constructor(private readonly handlers: Handler<any>[]) { }

  async handle(req: Request): Promise<Response> {
    for (const handler of this.handlers) {
      if (await handler.canHandle(req)) {
        const body = await req.json();
        const result = await handler.parse(body);
        if (result.isOk()) {
          const logger = new AzureFunctionsCustomLogger();
          const outputs = await handler.handle({ headers: req.headers, body: result.value, logger });
          const logs = logger.get();
          return Response.json({
            Outputs: outputs,
            Logs: logs,
          });
        }
        return Response.json({
          Outputs: {
            res: {
              statusCode: 400,
              headers: { 'Content-Type': 'application/json' },
              body: {
                type: 'validation',
                errors: result.error,
              },
            },
          }
        });
      }
    }
    return Response.json({
      Outputs: {
        res: {
          statusCode: 404,
          body: "Route not Found!!!",
        },
      }
    });
  }
}

const routes = new Router([nameCheck, receiveOrder]);

Bun.serve({
  port,
  async fetch(req) {
    return routes.handle(req);
  },
});
