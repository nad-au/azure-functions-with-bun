import { Elysia, t } from 'elysia'
import { inputBindingSchema, outputBindingSchema } from './schema';

const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

new Elysia()
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
        }
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
  .listen(port)