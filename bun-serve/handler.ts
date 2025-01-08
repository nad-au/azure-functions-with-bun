import type { Static, StaticDecode, TSchema } from "@sinclair/typebox";
import type { Logger } from "./logger";
import { type Outputs } from "./schema";
import { Err, Ok, type Result } from "ts-results-es";
import type { ValueError } from "@sinclair/typebox/errors";
import { Value } from "@sinclair/typebox/value";

export type Context<T extends unknown> = {
    headers: Headers;
    body: T;
    logger: Logger
}

export type Handler<T extends unknown> = {
    canHandle: (req: Request) => Promise<boolean>;
    parse: <Type extends TSchema, Output = Static<Type>, TResult extends Output = Output> (body: unknown) => Promise<Result<TResult, ValueError[]>>;
    handle: (context: Context<T>) => Promise<Outputs>;
}

export type HandlerArray<T extends unknown> = Handler<T>[]

export const pathNameEquals = (req: Request, pathname: string) => {
    const url = new URL(req.url);
    return url.pathname === pathname;
}

export const validateAndParseSchema = async <Type extends TSchema, Output = StaticDecode<Type>, TResult extends Output = Output>(schema: TSchema, body: unknown): Promise<Result<TResult, ValueError[]>> => {
    if (Value.Check(schema, body)) {
        return Ok(Value.Parse(schema, body));
    }
    const iterator = Value.Errors(schema, body)
    const errors = [...iterator]

    return Err(errors)
}
