import { Elysia } from 'elysia'
import { nameCheck } from './name-check';
import { receiveOrder } from './receive-order';
import { processOrder } from './process-order';

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

new Elysia()
  .use(nameCheck)
  .use(receiveOrder)
  .use(processOrder)
  .listen(port)