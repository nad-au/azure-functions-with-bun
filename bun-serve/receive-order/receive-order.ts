import { Type, type StaticDecode } from "@sinclair/typebox";
import { baseHttpInputBindingSchema, createHttpInputBindings, orderItemSchema, type Outputs } from "../schema";
import { Value } from "@sinclair/typebox/value";
import { pathNameEquals, validateAndParseSchema, type Handler } from "../handler";

const transformProductOrder = Type.Transform(Type.String())
    .Decode(value => Value.Parse(orderItemSchema, JSON.parse(value)))
    .Encode(value => JSON.stringify(value))

type OrderReceiveInputs = StaticDecode<typeof orderReceiveInputs>
const orderReceiveInputs = createHttpInputBindings(Type.Object({
    req: Type.Composite([
        baseHttpInputBindingSchema, Type.Object({ Body: transformProductOrder })])
}))

export const receiveOrder: Handler<OrderReceiveInputs> = {
    canHandle: async (req: Request) => pathNameEquals(req, '/receive-order'),
    parse: async (body: unknown) => validateAndParseSchema(orderReceiveInputs, body),
    handle: async ({ body, logger }): Promise<Outputs> => {
        await logger.log('receive-order:body', body);

        const { productId, quantity } = body.Data.req.Body;

        await logger.log('Order received', { productId, quantity });

        return {
            res: {
                Headers: { 'Content-Type': 'application/json' },
                statusCode: 200,
                body: { message: `Order received for ${productId} qty ${quantity}` },
            },
            out: JSON.stringify(body.Data.req.Body)
        }
    }
}
