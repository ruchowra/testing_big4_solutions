# api controllers
API handlers are a variety of application services, that are directly called by Express' router as part of an HTTP request's lifecycle.
API handlers have three methods, one required and two optional.

The `ApiController` interface exposes one method, `action` that takes an arbitrary amount of arguments.

_However_, any implementation of `ApiController` must follow these rules

* The `action` method **must** be decorated with `@ApiAction()`.
* The `action` method's argument list must be in **alphabetical order**
* Every URI and Query parameter of `action` **must** be listed in the routes definition for the end point. The parameters must be given a default value, but if the default value is `null` in the routes file, it will be passed to action as `undefined` (no default value given).

`IApiController::action` does not return a value, instead the method should use `this.Response.setResponseCode(code: number)` and `this.Resposne.setBody(body: object)` to set the response body and code to be sent to the client. These functions can be chained, `this.setResponseCode(200).setResponseBody({ message: 'ok' });`.

`preDispatch` is a function without parameters that is called immediately before the action is called, and after any middleware is called.

`postDispatch` is called after the action method has been invoked, and before the response is sent to the client.

`preDispatch` and `postDispatch` are free to change request and response object as necessary.