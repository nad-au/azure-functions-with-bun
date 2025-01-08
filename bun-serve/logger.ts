export interface Logger {
  log: (message: string, ...args: unknown[]) => Promise<void>
  error: (message: string, ...args: unknown[]) => Promise<void>
  warn: (message: string, ...args: unknown[]) => Promise<void>
  info: (message: string, ...args: unknown[]) => Promise<void>
  debug: (message: string, ...args: unknown[]) => Promise<void>
  trace: (message: string, ...args: unknown[]) => Promise<void>
}

export class AzureFunctionsCustomLogger implements Logger {
  private readonly logs: string[] = []

  async log(message: string, ...args: unknown[]): Promise<void> {
    this.logs.push(buildMessage(message, ...args))
  }

  async error(message: string, ...args: unknown[]): Promise<void> {
    this.logs.push(buildMessage(message, ...args))
  }

  async warn(message: string, ...args: unknown[]): Promise<void> {
    this.logs.push(buildMessage(message, ...args))
  }

  async info(message: string, ...args: unknown[]): Promise<void> {
    this.logs.push(buildMessage(message, ...args))
  }

  async debug(message: string, ...args: unknown[]): Promise<void> {
    this.logs.push(buildMessage(message, ...args))
  }

  async trace(message: string, ...args: unknown[]): Promise<void> {
    this.logs.push(buildMessage(message, ...args))
  }

  clear(): void {
    this.logs.length = 0
  }

  get(): Readonly<string[]> {
    return this.logs
  }
}

export const buildMessage = (message: string, ...args: unknown[]): string => {
  if (!args) return message

  let log = message
  for (const arg of args) {
    log += ` ${JSON.stringify(arg)}`
  }
  return log
}

export const NullLogger = (): Logger => {
  return {
    log: (message: string, ...args: unknown[]) => nop(message, ...args),
    error: (message: string, ...args: unknown[]) => nop(message, ...args),
    warn: (message: string, ...args: unknown[]) => nop(message, ...args),
    info: (message: string, ...args: unknown[]) => nop(message, ...args),
    debug: (message: string, ...args: unknown[]) => nop(message, ...args),
    trace: (message: string, ...args: unknown[]) => nop(message, ...args),
  }
}

const nop = (_message: string, ..._args: unknown[]): Promise<void> => {
  return Promise.resolve()
}
