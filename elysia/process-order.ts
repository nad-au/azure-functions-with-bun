import { Elysia } from 'elysia'
import { Value } from "@sinclair/typebox/value";
import { orderProcessInputBindingSchema } from './schema';

export const processOrder = new Elysia()
  .derive(({ body }) => {
    return {
      binding: Value.Parse(orderProcessInputBindingSchema, body)
      //binding: body
    }
  })
  // Matches endpoint directory name
  .post('/process', ({ binding }) => {
    binding.Data.in.productId
    console.log('process:body', JSON.stringify(binding));
    return {}
  })
