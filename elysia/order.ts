import { Elysia } from 'elysia'
import { Value } from "@sinclair/typebox/value";
import { inputBindingSchema, orderOutputBindingSchema, productOrderSchema } from './schema';

export const order = new Elysia()
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
  .post('/order', ({ body }) => {
    console.log('body', JSON.stringify(body));

    const { Body } = body.Data.req;
    const productOrder = Value.Parse(productOrderSchema, Body);
    console.log('productOrder.Qty', productOrder.quantity);

    return {
      Outputs: {
        res: {
          Headers: { 'Content-Type': 'application/json' },
          body: { message: 'Order received', quantity: productOrder.quantity },
        },
      },
    };
  }, {
    body: inputBindingSchema,
    response: orderOutputBindingSchema
  })
