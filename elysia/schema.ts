import { t, type Static } from "elysia"
import { Value } from "@sinclair/typebox/value";

export type identity = Static<typeof identitySchema>
export const identitySchema = t.Object({
    AuthenticationType: t.Nullable(t.String()),
    IsAuthenticated: t.Boolean(),
    Actor: t.Nullable(t.String()),
    BootstrapContext: t.Nullable(t.String()),
    Claims: t.Array(t.String()),
    Label: t.Nullable(t.String()),
    Name: t.Nullable(t.String()),
    NameClaimType: t.Nullable(t.String()),
    RoleClaimType: t.Nullable(t.String()),
})

export const orderItemSchema = t.Object({
    productId: t.String(),
    quantity: t.Number(),
})

export const productOrderSchema = t.Transform(t.String())
    .Decode(value => {
        const json = JSON.parse(value)
        return Value.Parse(orderItemSchema, json)
    })
    .Encode(value => JSON.stringify(value))

export type HttpInputBinding = Static<typeof httpInputMetadataSchema>
export const httpInputBindingSchema = t.Object({
    Url: t.String(),
    Method: t.Union([t.Literal('GET'), t.Literal('POST')]),
    Query: t.Record(t.String(), t.Nullable(t.String())),
    Headers: t.Record(t.String(), t.Array(t.String())),
    Params: t.Record(t.String(), t.Nullable(t.String())),
    Identities: t.Array(identitySchema),
    Body: t.Optional(t.String()),
})

export type HttpInputMetadata = Static<typeof httpInputMetadataSchema>
export const httpInputMetadataSchema = t.Object({
    name: t.Optional(t.String()),
    Query: t.Record(t.String(), t.Nullable(t.String())),
    Headers: t.Record(t.String(), t.String()),
    sys: t.Object({
        MethodName: t.String(),
        UtcNow: t.String(),
        RandGuid: t.String(),
    }),
})

export type InputBinding = Static<typeof inputBindingSchema>
export const inputBindingSchema = t.Object({
    Data: t.Record(t.String(), t.Union([httpInputBindingSchema])),
    Metadata: httpInputMetadataSchema,
})

export type HttpOutputBinding = Static<typeof inputBindingSchema>
export const httpOutputBindingSchema = t.Object({
    statusCode: t.Optional(t.Number()),
    body: t.Optional(t.Union([t.String(), t.Object({})])),
    Headers: t.Optional(t.Record(t.String(), t.String())),
})

export type OutputBinding = Static<typeof outputBindingSchema>
export const outputBindingSchema = t.Object({
    message: t.Optional(t.String()),
    Outputs: t.Optional(t.Record(t.String(), httpOutputBindingSchema)),
    Logs: t.Optional(t.Nullable((t.Array(t.String())))),
    ReturnValue: t.Optional(t.Nullable(t.String())),
})

export type OrderOutputBinding = Static<typeof outputBindingSchema>
export const orderOutputBindingSchema = t.Object({
    Outputs: t.Object({
        res: t.Object({
            Headers: t.Record(t.Literal('Content-Type'), t.Literal('application/json')),
            body: t.Object({
                message: t.String(),
                quantity: t.Number(),
            })
        }),
    })
})