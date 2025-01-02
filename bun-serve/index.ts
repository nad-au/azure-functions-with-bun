const port = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT || "4000")
console.log(`Listening on port: ${port}`)

Bun.serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/api/simplehttptrigger") {
      const userAgent = req.headers.get("user-agent");
      console.log(`user agent is: ${userAgent}`);
    
      const invocationId = req.headers.get("x-azure-functions-invocationid");
      console.log(`invocationid is: ${invocationId}`);
    
      return new Response("Hello World from Bun");
    } 
    return new Response("404!");
  },
});
