import { t, type Static } from "elysia"

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

export type HttpInputBinding = Static<typeof httpInputBindingSchema>
export const httpInputBindingSchema = t.Object({
    Url: t.String(),
    Method: t.Union([t.Literal('GET'), t.Literal('POST')]),
    Query: t.Record(t.String(), t.String()),
    Headers: t.Record(t.String(), t.Array(t.String())),
    Params: t.Record(t.String(), t.String()),
    Identities: t.Array(identitySchema),
})

export type HttpInputMetadata = Static<typeof httpInputMetadataSchema>
export const httpInputMetadataSchema = t.Object({
    name: t.String(),
    Query: t.Record(t.String(), t.String()),
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
    statusCode: t.Number(),
    body: t.String(),
})

export type OutputBinding = Static<typeof outputBindingSchema>
export const outputBindingSchema = t.Object({
    message: t.Optional(t.String()),
    Outputs: t.Record(t.String(), httpOutputBindingSchema),
    Logs: t.Optional(t.Nullable((t.Array(t.String())))),
    ReturnValue: t.Optional(t.Nullable(t.String())),
})