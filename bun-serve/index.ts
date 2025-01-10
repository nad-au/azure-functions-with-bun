import { nameCheck } from "./name-check/name-check";
import { processOrder } from "./process-order/process-order";
import { receiveOrder } from "./receive-order/receive-order";
import { Router } from "./router";

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

const router = new Router([nameCheck, receiveOrder, processOrder]);

Bun.serve({
  port,
  fetch: async (req) => router.route(req)
});
