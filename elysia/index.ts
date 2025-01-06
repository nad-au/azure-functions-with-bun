import { Elysia } from 'elysia'
import { nameCheck } from './name-check';
import { order } from './order';

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

new Elysia()
  .use(nameCheck)
  .use(order)
  .listen(port)