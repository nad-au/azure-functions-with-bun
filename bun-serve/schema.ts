import { Type, type Static, type StaticDecode, type TSchema } from "@sinclair/typebox";

const Nullable = <T extends TSchema>(schema: T) => Type.Union([schema, Type.Null()])

export type identity = Static<typeof identitySchema>
export const identitySchema = Type.Object({
    AuthenticationType: Nullable(Type.String()),
    IsAuthenticated: Type.Boolean(),
    Actor: Nullable(Type.String()),
    BootstrapContext: Nullable(Type.String()),
    Claims: Type.Array(Type.String()),
    Label: Nullable(Type.String()),
    Name: Nullable(Type.String()),
    NameClaimType: Nullable(Type.String()),
    RoleClaimType: Nullable(Type.String()),
})

export type Sys = Static<typeof sysSchema>
export const sysSchema = Type.Object({
    MethodName: Type.String(),
    UtcNow: Type.String(),
    RandGuid: Type.String(),
})
export type HttpInputMetadata = Static<typeof httpInputMetadataSchema>
export const httpInputMetadataSchema = Type.Object({
    name: Type.Optional(Type.String()),
    Query: Type.Record(Type.String(), Nullable(Type.String())),
    Headers: Type.Record(Type.String(), Type.String()),
    sys: sysSchema,
})

export type StorageQueueInputMetadata = Static<typeof storageQueueInputMetadataSchema>
export const storageQueueInputMetadataSchema = Type.Object({
    DequeueCount: Type.String(),
    ExpirationTime: Type.String(),
    Id: Type.String(),
    InsertionTime: Type.String(),
    NextVisibleTime: Type.String(),
    PopReceipt: Type.String(),
    sys: sysSchema,
})

export type ServiceBusInputMetadata = Static<typeof serviceBusInputMetadataSchema>
export const serviceBusInputMetadataSchema = Type.Object({
    MessageReceiver: Type.Object({}),
    MessageSession: Type.Object({}),
    MessageActions: Type.Object({}),
    SessionActions: Type.Object({}),
    ReceiveActions: Type.Object({}),
    Client: Type.Object({
        FullyQualifiedNamespace: Type.String(),
        IsClosed: Type.Boolean(),
        TransportType: Type.Number(),
        Identifier: Type.String(),
    }),
    DeliveryCount: Type.String(),
    LockToken: Type.String(),
    ExpiresAtUtc: Type.String(),
    ExpiresAt: Type.String(),
    EnqueuedTimeUtc: Type.String(),
    EnqueuedTime: Type.String(),
    MessageId: Type.String(),
    ContentType: Type.String(),
    SequenceNumber: Type.String(),
    ApplicationProperties: Type.Object({
        '$AzureWebJobsParentId': Type.String(),
        'Diagnostic-Id': Type.String(),
    }),
    UserProperties: Type.Object({
        '$AzureWebJobsParentId': Type.String(),
        'Diagnostic-Id': Type.String(),
    }),
    sys: sysSchema,
})

export type HttpOutputBinding = Static<typeof httpOutputBindingSchema>
export const httpOutputBindingSchema = Type.Object({
    statusCode: Type.Optional(Type.Number()),
    body: Type.Optional(Type.Union([Type.String(), Type.Object({})])),
    Headers: Type.Optional(Type.Record(Type.String(), Type.String())),
})

export type Output = Static<typeof outputSchema>
export const outputSchema = Type.Union([httpOutputBindingSchema, Type.String()])

export type Outputs = Static<typeof outputsSchema>
export const outputsSchema = Type.Record(Type.String(), outputSchema)

export type OutputBinding = Static<typeof outputBindingSchema>
export const outputBindingSchema = Type.Object({
    message: Type.Optional(Type.String()),
    Outputs: outputsSchema,
    Logs: Type.Optional(Nullable((Type.Array(Type.String())))),
    ReturnValue: Type.Optional(Nullable(Type.String())),
})

export const baseHttpInputBindingSchema = Type.Object({
    Url: Type.String(),
    Method: Type.Union([Type.Literal('GET'), Type.Literal('POST')]),
    Query: Type.Record(Type.String(), Nullable(Type.String())),
    Headers: Type.Record(Type.String(), Type.Array(Type.String())),
    Params: Type.Record(Type.String(), Nullable(Type.String())),
    Identities: Type.Array(identitySchema)
})

export type HttpInputBindings<T extends TSchema> = StaticDecode<ReturnType<typeof createHttpInputBindings<T>>>
export const createHttpInputBindings = <T extends TSchema>(dataSchema: T) => Type.Object({
    Data: dataSchema,
    Metadata: httpInputMetadataSchema
})
