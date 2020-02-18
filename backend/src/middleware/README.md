# Middleware
Middleware are part of the application layer, and come between the client application (frontend) and the `API handlers`. A middleware gets access to the `request` and `response` objects, and is free to manipulate them before the `handler` does. A middleware can also make the decision to terminate a request, by having its action method return false.

The signature for a middleware is:
```
class Middleware extends IMiddleware {
  public async action(): Promise<boolean> {
    return true | false
  }
}
```

If `Middleware.action` returns true, the next middleware/handler is invoked like normal. If the method returns false, the response object is sent back to the frontend. This way, a validator middleware or authenticator middleware can be used to safeguard a handler.

Middleware is defined as part of the routes json files, and can be placed at any point in the routes chain.

Middleware placed in the top level:
```
*routes/core/notes.json*
{
  "middleware": [...]
}
```

get called for all requests to that route, so in this case, any request to `/core/notes/*` pass through the middleware.

If placed in the endpoint level:
```
*routes/core/notes.json*
{
  ":journalId": {
    "middleware": [...]
  }
}
```
the middleware gets called for all endpoints `/core/notes/:journalId/*`, regardless of `HTTP method`.

If placed in the handler level: 
```
*routes/core/notes.json*
{
  ":journalId": {
    "handlers: [{
      "method": "<METHOD>",
      "middleware": [...]
  }
}
```
the middleware gets called for all `<METHOD> /core/notes/:journalId/*` requests on the endpoint.

The special middleware Authentication runs before all endpoints on all routes, _unless_ it is explicitly disabled in the top-level of the routes file.
```
*routes/core/notes.json*
{
  "authentication": false,
  ...
}
```

Authentication is done using JWT, by passing the token in the `Authorization: Bearer <token>` header.

The authorization middleware decodes the token and places the payload into the request object. Helper getters `Request.User` and `Request.Permissions` allow quick access to the user and permissions part of the token payload.