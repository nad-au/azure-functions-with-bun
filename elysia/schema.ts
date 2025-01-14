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

export const transformProductOrder = t.Transform(t.String())
    .Decode(value => Value.Parse(orderItemSchema, JSON.parse(value)))
    .Encode(value => JSON.stringify(value))

export const transformDoubleParseProductOrder = t.Transform(t.String())
    .Decode(value => Value.Parse(orderItemSchema, JSON.parse(JSON.parse(value))))
    .Encode(value => JSON.stringify(value))

export type HttpInputBinding = Static<typeof httpInputMetadataSchema>
export const httpInputBindingSchema = t.Object({
    Url: t.String(),
    Method: t.Union([t.Literal('GET'), t.Literal('POST')]),
    Query: t.Record(t.String(), t.Nullable(t.String())),
    Headers: t.Record(t.String(), t.Array(t.String())),
    Params: t.Record(t.String(), t.Nullable(t.String())),
    Identities: t.Array(identitySchema),
    Body: transformProductOrder,
})

export type Sys = Static<typeof sysSchema>
export const sysSchema = t.Object({
    MethodName: t.String(),
    UtcNow: t.String(),
    RandGuid: t.String(),
})
export type HttpInputMetadata = Static<typeof httpInputMetadataSchema>
export const httpInputMetadataSchema = t.Object({
    name: t.Optional(t.String()),
    Query: t.Record(t.String(), t.Nullable(t.String())),
    Headers: t.Record(t.String(), t.String()),
    sys: sysSchema,
})

export type StorageQueueInputMetadata = Static<typeof storageQueueInputMetadataSchema>
export const storageQueueInputMetadataSchema = t.Object({
    DequeueCount: t.String(),
    ExpirationTime: t.String(),
    Id: t.String(),
    InsertionTime: t.String(),
    NextVisibleTime: t.String(),
    PopReceipt: t.String(),
    sys: sysSchema,
})

export type ServiceBusInputMetadata = Static<typeof serviceBusInputMetadataSchema>
export const serviceBusInputMetadataSchema = t.Object({
    MessageReceiver: t.Object({}),
    MessageSession: t.Object({}),
    MessageActions: t.Object({}),
    SessionActions: t.Object({}),
    ReceiveActions: t.Object({}),
    Client: t.Object({
        FullyQualifiedNamespace: t.String(),
        IsClosed: t.Boolean(),
        TransportType: t.Number(),
        Identifier: t.String(),
    }),
    DeliveryCount: t.String(),
    LockToken: t.String(),
    ExpiresAtUtc: t.String(),
    ExpiresAt: t.String(),
    EnqueuedTimeUtc: t.String(),
    EnqueuedTime: t.String(),
    MessageId: t.String(),
    ContentType: t.String(),
    SequenceNumber: t.String(),
    ApplicationProperties: t.Object({
        '$AzureWebJobsParentId': t.String(),
        'Diagnostic-Id': t.String(),
    }),
    UserProperties: t.Object({
        '$AzureWebJobsParentId': t.String(),
        'Diagnostic-Id': t.String(),
    }),
    sys: sysSchema,
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
    Outputs: t.Optional(t.Record(t.String(), t.Union([httpOutputBindingSchema, t.String()]))),
    Logs: t.Optional(t.Nullable((t.Array(t.String())))),
    ReturnValue: t.Optional(t.Nullable(t.String())),
})

export type OrderInputBinding = Static<typeof orderInputBindingSchema>
export const orderInputBindingSchema = t.Object({
    Data: t.Object({
        req: t.Object({
            Url: t.String(),
            Method: t.Union([t.Literal('GET'), t.Literal('POST')]),
            Query: t.Record(t.String(), t.Nullable(t.String())),
            Headers: t.Record(t.String(), t.Array(t.String())),
            Params: t.Record(t.String(), t.Nullable(t.String())),
            Identities: t.Array(identitySchema),
            Body: transformProductOrder,
        })
    }),
    Metadata: httpInputMetadataSchema,
})

export type OrderOutputBinding = Static<typeof orderOutputBindingSchema>
export const orderOutputBindingSchema = t.Object({
    Outputs: t.Object({
        out: orderItemSchema,
        res: t.Object({
            Headers: t.Record(t.Literal('Content-Type'), t.Literal('application/json')),
            body: t.Object({
                message: t.String(),
                quantity: t.Number(),
            })
        }),
    }),
    Logs: t.Optional(t.Nullable((t.Array(t.String())))),
    ReturnValue: t.Optional(t.Nullable(t.String())),
})

export type OrderProcessInputBinding = Static<typeof orderProcessInputBindingSchema>
export const orderProcessInputBindingSchema = t.Object({
    Data: t.Object({
        in: transformDoubleParseProductOrder
    }),
    Metadata: storageQueueInputMetadataSchema,
})
