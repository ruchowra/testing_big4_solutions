## Framework
The framework folder is mostly a collection of interfaces (abstract classes) that can be extended by the different application layers, as well as framework-layer adapters to those interfaces. The interfaces can be seen in the `/interfaces` folder, and the adapter implementations under `/adapters`. Interfaces are not sorted into folders, but instead simply named after the layer segment they describe.

```
framework
├── adapters              <- This folder contains implementations of framework interfaces.
├── application-services  <- This folder contains application service interfaces (IAuthenticationService, for example)
├── ddd <- This folder contains ddd primitives
├── di <- This folder contains the parts of the system in charge of dependency injection, starting the chain of dependency bindings and setting up routes. 
├── domain-objects <- This folder contains interfaced domain objects; objects whose behavior is complicated enough to warrant isolation.
├── domain-services <- This folder contains domain-service interfaces, similar to application services
├── event-handlers <- This folder contains all the event handlers that automate callings of application or domain services. 
├── interfaces <- This folder contains all framework layer interfaces that are used in the system
├── mocks <- This folder contains mock implementations of our interfaces
└── repositories <- This folder contains the repository interfaces used
```

## Index:
- [Domain objects](domain-objects)
- [Domain services](domain-services)
- [Application services](application-services)
- [Api controllers](api-controllers)
- [Framework](framework)
- [Middleware](middleware)
- [Mocks](mocks)