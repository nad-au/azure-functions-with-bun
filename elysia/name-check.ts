import { Elysia } from 'elysia'
import { inputBindingSchema, outputBindingSchema } from './schema';

export const nameCheck = new Elysia()
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
  .post('/name-check', ({ headers, body }) => {
    console.log('body', JSON.stringify(body));

    const userAgent = headers["user-agent"];
    console.log(`user agent is: ${userAgent}`);

    const invocationId = headers["x-azure-functions-invocationid"];
    console.log(`invocationid is: ${invocationId}`);

    const name = body.Data.req.Params.name ?? 'nothing';
    if (name === "bun") {
      return {
        Outputs: {
          res: {
            statusCode: 200,
            body: "Correct answer. Bun FTW!!",
          },
        },
      };
    }
    return {
      Outputs: {
        res: {
          statusCode: 400,
          body: `No, best not use ${name}`,
        },
      }
    };
  }, {
    body: inputBindingSchema,
    response: outputBindingSchema
  })
