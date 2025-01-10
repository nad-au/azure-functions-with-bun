import { Type, type Static } from "@sinclair/typebox";
import { pathNameEquals, validateAndParseSchema, validationErrorOutputs, type Handler } from "../handler";
import { baseHttpInputBindingSchema, createHttpInputBindings, type Outputs } from "../schema";

type NameCheckInputs = Static<typeof nameCheckInputs>
const nameCheckInputs = createHttpInputBindings(Type.Object({
    req: baseHttpInputBindingSchema
}))

export const nameCheck: Handler<NameCheckInputs> = {
    canHandle: async (req: Request) => pathNameEquals(req, '/name-check'),
    parse: async (body: unknown) =>
        validateAndParseSchema(body, nameCheckInputs, (errors) =>
            validationErrorOutputs(errors),
        ),
    handle: async ({ body, logger }): Promise<Outputs> => {
        console.log('name-check:body', body);

        const name = body.Data.req.Params.name ?? 'nothing';
        if (name === "bun") {
            await logger.log('Name check passed', `Name: ${name}`);
            return {
                res: {
                    statusCode: 200,
                    body: "Correct answer. Bun FTW!!",
                },
            }
        }
        await logger.log('Name check failed', `Name: ${name}`);
        return {
            res: {
                statusCode: 400,
                body: `No, best not use ${name}`,
            },
        }
    }
}
