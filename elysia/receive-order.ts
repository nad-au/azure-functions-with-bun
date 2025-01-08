import { Elysia } from 'elysia'
import { Value } from "@sinclair/typebox/value";
import { orderInputBindingSchema, orderOutputBindingSchema } from './schema';

export const receiveOrder = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 200
      return {
        Outputs: {
          res: {
            body: error.message,
            headers: { 'Content-Type': 'application/json' },
          },
        }
      }
    }
  })
  // Matches endpoint directory name
  .derive(({ body }) => {
    return {
      binding: Value.Parse(orderInputBindingSchema, body)
    }
  })
  .post('/order', ({ binding }) => {
    console.log('body', binding);

    const { Body: productOrder } = binding.Data.req;

    return {
      Outputs: {
        out: productOrder,
        res: {
          Headers: { 'Content-Type': 'application/json' },
          body: { message: 'Order received', quantity: productOrder.quantity },
        },
      },
      Logs: ['Order received', "Order quantity: " + productOrder.quantity],
    };
  }, {
    response: orderOutputBindingSchema
  })
