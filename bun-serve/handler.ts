import {
  type Static,
  type StaticDecode,
  type TSchema,
  TypeBoxError,
} from '@sinclair/typebox'
import {
  AssertError,
  TransformDecodeError,
  Value,
  type ValueError,
  ValueErrorType,
} from '@sinclair/typebox/value'
import { Err, Ok, type Result } from 'ts-results-es'
import { type Outputs } from './schema'
import type { Logger } from './logger'

export type Context<T> = {
  headers: Headers
  body: T
  logger: Logger
}

/// dewdew
export type Config = {
  /** Should throw instead of returning error through HTTP response. Would typically set to true for non-http triggers */
  throwOnError?: boolean
}

export type Handler<T> = {
  canHandle: (req: Request) => Promise<boolean>
  config?: Config
  parse: <
    Type extends TSchema,
    Output = Static<Type>,
    TResult extends Output = Output,
  >(
    body: unknown,
    logger: Logger,
  ) => Promise<Result<TResult, Outputs>>
  handle: (context: Context<T>) => Promise<Outputs>
}

export type HandlerArray<T> = Handler<T>[]

export const pathNameEquals = (req: Request, pathname: string) => {
  const url = new URL(req.url)
  return url.pathname === pathname
}

export const validateAndParseSchema = <
  Type extends TSchema,
  Output = StaticDecode<Type>,
  TResult extends Output = Output,
>(
  body: unknown,
  schema: TSchema,
  onError: (errors: ValueError[]) => Outputs,
): Result<TResult, Outputs> => {
  try {
    return Ok(Value.Parse(schema, body))
  } catch (e) {
    if (e instanceof AssertError) {
      const iterator = e.Errors()
      const errors = [...iterator]

      return Err(onError(errors))
    } else if (e instanceof TransformDecodeError) {
      const innerError = e.error
      if (innerError instanceof AssertError) {
        const iterator = innerError.Errors()
        const errors = [...iterator]

        return Err(onError(errors))
      }
      return Err(
        onError([
          {
            type: ValueErrorType.Object,
            schema: e.schema,
            path: e.path,
            value: e.value,
            message: e.message,
            errors: [],
          },
        ]),
      )
    } else if (e instanceof TypeBoxError) {
      throw new Error(`Unknown TypeBoxError: ${e.message}`, { cause: e })
    }
    throw e
  }
}

export const validationErrorOutputs = (errors: ValueError[]): Outputs => ({
  res: {
    statusCode: 422,
    Headers: { 'Content-Type': 'application/json' },
    body: {
      type: 'validation',
      errors,
    },
  },
})
