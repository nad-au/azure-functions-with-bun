import { TypeBoxError, type Static, type StaticDecode, type TSchema } from "@sinclair/typebox";
import { AssertError, TransformDecodeError, Value, ValueErrorType } from "@sinclair/typebox/value";
import type { Logger } from "./logger";
import { type Outputs } from "./schema";
import { Err, Ok, type Result } from "ts-results-es";
import type { ValueError } from "@sinclair/typebox/errors";

export type Context<T extends unknown> = {
    headers: Headers;
    body: T;
    logger: Logger
}

/// dewdew
export type Config = {
    /** Should throw instead of returning error through HTTP response. Would typically set to true for non-http triggers */
    throwOnError?: boolean;
    
    /** Default output key to use when returning response. Default is 'res' */    
    defaultOutputKey?: string;
}

export type Handler<T extends unknown> = {
    canHandle: (req: Request) => Promise<boolean>;
    config?: Config;
    parse: <Type extends TSchema, Output = Static<Type>, TResult extends Output = Output> (body: unknown) => Promise<Result<TResult, ValueError[]>>;
    handle: (context: Context<T>) => Promise<Outputs>;
}

export type HandlerArray<T extends unknown> = Handler<T>[]

export const pathNameEquals = (req: Request, pathname: string) => {
    const url = new URL(req.url);
    return url.pathname === pathname;
}

export const validateAndParseSchema = <Type extends TSchema, Output = StaticDecode<Type>, TResult extends Output = Output>(schema: TSchema, body: unknown): Result<TResult, ValueError[]> => {
    try {
        return Ok(Value.Parse(schema, body));
    } catch (e) {
        if (e instanceof AssertError) {
            const iterator = e.Errors()
            const errors = [...iterator]

            return Err(errors)
        }
        else if (e instanceof TransformDecodeError) {
            const innerError = e.error
            if (innerError instanceof AssertError) {
                const iterator = innerError.Errors()
                const errors = [...iterator]

                return Err(errors)
            }
            return Err([{
                type: ValueErrorType.Object,
                schema: e.schema,
                path: e.path,
                value: e.value,
                message: e.message,
                errors: []
            }])
        }
        else if (e instanceof TypeBoxError) {
            throw new Error(`Unknown TypeBoxError: ${e.message}`, { cause: e })
        }
        throw e
    }
}
