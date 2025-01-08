import type { Handler } from "./handler";
import { AzureFunctionsCustomLogger } from "./logger";

export class Router {

    constructor(private readonly handlers: Handler<any>[]) { }

    async handle(req: Request): Promise<Response> {
        for (const handler of this.handlers) {
            const key = handler.config?.defaultOutputKey ?? 'res'
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
                if (handler.config?.throwOnError) throw new Error(`Error parsing request: ${JSON.stringify(result.error)}`);
                return Response.json({
                    Outputs: {
                        [key]: {
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
        throw new Error('Route not found');
    }
}
