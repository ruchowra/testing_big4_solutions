# v4-backend
Backend of RSV4

Folder structure
```
v4-backend
├── config                          <- Configuration files, .env files etc. go here. Pure JSON or javascript, since files will be read by js not ts.
├── dist                            <- Out-folder for compiled js files.
├── logs                            <- Out-folder for logs 
├── src                             <- Typescript source-directory
│   ├── api-controllers             <- API controllers are the classes that are called by the Express router
│   ├── application-services        <- Application services handle infrastructure or application based services, not fit for domain models.
│   │   └── system                  <- Module
│   ├── domain-objects              <- Domain objects make up the DDD entities, value objects and aggregate roots of the system.
│   ├── domain-services             <- Domain services are business logic encapsulations that do not fit into domain objects.
│   ├── events                      <- Contains all the custom event types (extending IEvent) used by the eventing system.
│   ├── event-handlers              <- Contains all the custom event handlers (extending IEventHandler) used by the eventing system
│   ├── framework                   <- Framework interfaces, adapters and other superclasses are put here.
│   │   ├── adapters                <- Adapters are non-business logic related implementations of interfaces.
│   │   │   ├── express             <- Module
│   │   │   └── persistence         <- Module
│   │   ├── ddd                     <- This folder contains the basic "DDD primitives", entity, value object and aggregate root.
│   │   ├── di                      <- This folder contains the setup for reading routes, as well as the setup of the IoC container.
│   │   ├── interfaces              <- This is where all framework interfaces are declared.
│   │   └── repositories            <- This folder contains mock repositories.
│   ├── middleware                  <- Middleware are non-business logic services, often put in before API handlers are run.
│   ├── mocks                       <- This contains controlled implementations of interfaces. All output is known ahead of time. Used for testing.
│   │   ├── domain                  <- This folder contains mocks for domain-related concepts.
│   │   └── express                 <- This folder contains mocks for express-related concepts (IRequest and IRequire)
│   └── system
└── unit-tests                      <- Mocha and Chai test files. Folder structure similar to src, but all test files end with "-test.ts"
    ├── api-controllers
    ├── domain-services
    └── framework
```

**Rules**
- Tests are placed inside the top-level unit-tests folder, and should have a filename ending with .test.ts
- Framework files are placed in the src/framework folder and aliased to `@framework`

## Life-cycle of a request
This part gives an example for the life-cycle of a GET and POST request, respectively. 
The idea is to get a feel for how the different parts operate.

`GET`:
  - Request reaches Express router.
  - Express router middleware (`read-routes.ts`) transform request and response objects into implementations of `IRequest` and `IResponse`.
  - The requested `Middleware` are resolved through inversify`Middleware.action` is called
  - The requested `ApiController` is resolved through inversify
  - `APIController.preDispatch()` is called
  - `APIController.action(params)` is called
    - `ApiController` uses an implementation of `IResourceRepository` to request persisted data, received as one ore more `aggregate roots`.
    - `ApiController` transforms persisted `aggregate root(s)` to `JSON`
    - `ApiController` sets response code and response body, returns.
  - `ApiController.postDispatch()` is called
  - `ApiController's IResponse` is transformed back into an Express compatible response
  - Response is sent back to user.

`POST`:
  - Request reaches Express router.
  - Express router middleware (`read-routes.ts`) transform request and response objects into implementations of `IRequest` and `IResponse`.
  - The requested `Middleware` are resolved through inversify
    - `Middleware.action` is called
  - The requested `ApiController` is resolved through inversify
  - `ApiController.preDispatch()` is called
  - `ApiController.action(params)` is called
    - `ApiController` sends `params` to `ResourceFactory`
      - `ResourceFactory` validates input, throws on invalid data.
      - `ResourceFactory` builds a new `Resource`, returns it.
    - `ApiController` uses `IResourceRepository` to persist newly built resource
    - `ApiController` sets response code and body, returns
  - `ApiController.postDispatch()` is called
  - `ApiController's IResponse` is transformed back into an Express compatible response
  - Response is sent back to user.

## IDE recommendation
Recommend IDE is vscode with the following plugins:
* gitlens
* JSON tools
* Markdown All in One
* ESLint
* ErrorLens

But any IDE which, at least, supports ESLint plugin should suffice.
