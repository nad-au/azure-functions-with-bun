import { Type, type StaticDecode } from "@sinclair/typebox";
import { createStorageQueueInputBindings, orderItemSchema, type Outputs } from "../schema";
import { Value } from "@sinclair/typebox/value";
import { pathNameEquals, validateAndParseSchema, type Handler } from "../handler";

// Message is a stringified JSON object
export const transformProductOrder = Type.Transform(Type.String())
    .Decode(value => Value.Parse(orderItemSchema, JSON.parse(JSON.parse(value))))
    .Encode(value => JSON.stringify(value))

type ProcessOrderInputs = StaticDecode<typeof processOrderInputs>
const processOrderInputs = createStorageQueueInputBindings(Type.Object({
    in: transformProductOrder
}))

export const processOrder: Handler<ProcessOrderInputs> = {
    config: {
        throwOnError: true
    },
    canHandle: async (req: Request) => pathNameEquals(req, '/process-order'),
    parse: async (body: unknown) => validateAndParseSchema(processOrderInputs, body),
    handle: async ({ body, logger }): Promise<Outputs> => {
        await logger.log('process-order:body', body);

        const { productId, quantity } = body.Data.in;

        await logger.log('Order processed', { productId, quantity });

        return {}
    }
}
