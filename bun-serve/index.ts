const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

Bun.serve({
  port,
  async fetch(req) {
    const body = await req.json();
    console.log('body', JSON.stringify(body));

    const url = new URL(req.url);
    if (url.pathname === "/name-check")  // Matches endpoint directory name
    {
      const userAgent = req.headers.get("user-agent");
      console.log(`user agent is: ${userAgent}`);
    
      const invocationId = req.headers.get("x-azure-functions-invocationid");
      console.log(`invocationid is: ${invocationId}`);
      
      const name = body.Data.req.Params.name ?? 'nothing';
      if (name === "bun") {
        return Response.json({
          Outputs: {
            res: {
              statusCode: "200",
              body: "Correct answer. Bun FTW!!",
            },
          }
        });
      }
      return Response.json({
        Outputs: {
          res: {
            statusCode: "400",
            body: `No, best not use ${name}`,
          },
        }
      });
    }
    return Response.json({
      Outputs: {
        res: {
          statusCode: "404",
          body: "Not Found!!!",
        },
      }
    });
  },
});
