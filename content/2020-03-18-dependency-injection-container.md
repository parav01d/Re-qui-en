---
date: 2020-03-18
title: "Dependency Injection Container"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

### Here is how a code _not_ using DI will roughly work:

- Application needs Foo (e.g. a controller), so:
- Application creates Foo
- Application calls Foo
  - Foo needs Bar (e.g. a service), so:
  - Foo creates Bar
  - Foo calls Bar
    - Bar needs Bim (a service, a repository, …), so:
    - Bar creates Bim
    - Bar does something

### Here is how a code using DI will roughly work:

- Application needs Foo, which needs Bar, which needs Bim, so:
- Application creates Bim
- Application creates Bar and gives it Bim
- Application creates Foo and gives it Bar
- Application calls Foo
  - Foo calls Bar
    - Bar does something

This is the pattern of Inversion of Control. The control of the dependencies is inverted from one being called to the one calling.

The main advantage: the one at the top of the caller chain is always you. You can control all dependencies and have complete control over how your application works. You can replace a dependency by another (one you made for example).

For example what if Library X uses Logger Y and you want to make it use your logger Z? With dependency injection, you don't have to change the code of Library X.

### Now how does a code using PHP-DI works:

- Application needs Foo so:
- Application gets Foo from the Container, so:
  - Container creates Bim
  - Container creates Bar and gives it Bim
  - Container creates Foo and gives it Bar
- Application calls Foo
  - Foo calls Bar
    - Bar does something

In short, the container takes away all the work of creating and injecting dependencies.
<br></br>

## Typescript Example

In my Typescript applications I use "inversify" as my recommended dependency injection container. It works straight forward and has a nice documentation.
<br></br>
As a part of my front controller, the routes file contains the root container and provide all controller functions:
```javascript
class Routes {

  static TRACKING_TRACK_INTERACTION = "TRACKING_TRACK_INTERACTION";

  private container: Container;

  private trackingInteractionController: ITrackingInteractionController;

  public getRoutes() {
    return [
      {
        path: "/tracking/interaction",
        name: Routes.TRACKING_TRACK_INTERACTION,
        method: "post",
        action: this.trackingInteractionController.trackInteraction.bind(this.trackingInteractionController),
        middlewares: [this.fetchCurrentUser.bind(this)],
        documentation: {
          payload: "TrackInteractionCommand",
          resource: null,
          resources: null
        }
      }
    ];
  }

  public getContainer(): Container {
    return this.container as Container;
  }

  public setContainer(container: Container) {
    this.container = container;
  }

  public initializeContainer() {
    this.container = Container.merge(DependencyInjectionContainer, FrameworkContainer) as Container;
  }

  public initializeDependencies() {
    this.trackingInteractionController = this.container.get<ITrackingInteractionController>(TrackingControllerModule.InteractionController);
  }

  public async fetchCurrentUser(request: Request, _: Response, next: NextFunction) {
    ...
    next();
  }
}
```
<br></br>

In the bootstrapping process of my application I initialise the routes like this (using Express):

```javascript
const app = express();
app.use(cors());
app.use(bodyParser.json());

const routes = new Routes();
routes.initializeContainer();
routes.initializeDependencies();

routes.getRoutes().forEach((route) => {
  console.log(`[${route.method.toUpperCase()}]${route.path}`);
  if (route.middlewares.length > 0) {
    app.use(route.path, ...route.middlewares);
  }
  app[route.method](route.path, (request: Request, response: Response, next: any) => {
    route.action(request, response)
      .then(() => next)
      .catch((err: any) => next(err));
  });
});
```
<br></br>
In my E2E tests I use the "cucumber" library and an instance of my application in their "world"-object, now I can rebind all dependencies in the container for test purposes. In the following example I mock the email and crypto service to prevent sending emails and hashing my passwords etc.:

```javascript
this.appRoutes.initializeContainer();

const appContainer = this.appRoutes.getContainer() as Container;
// rewire dependencies
appContainer.unbind(FrameworkServiceModule.MailService);
appContainer.bind<IMailService>(FrameworkServiceModule.MailService).to(MockEmailService);
appContainer.unbind(FrameworkServiceModule.CryptoService);
appContainer.bind<ICryptoService>(FrameworkServiceModule.CryptoService).to(MockCryptoService);
// setup dependencies for routes
this.appRoutes.setContainer(appContainer);
this.appRoutes.initializeDependencies();
```
