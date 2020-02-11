---
date: 2020-02-10
title: "Front Controller"
cover: "/images/empty.png"
categories:
    - Patterns
tags:
    - clean code
    - architecture
---

## About the Pattern

The term front controller denotes a design pattern in software technology. A front controller serves as an entry point into a web application.

All requests to the web application are received by the front controller and delegated to a specific controller. To do this, he initializes the router (usually relocated to an external component) and performs general tasks.

## Example

In this example we are taking a look at a *find filtered and paged user* implementation in typescript. The front controller is the most logic-less part of our application. It dispatches the incomming request to a controller function, map the request parameters to an query or command and execute an use-case. Creating error and success responses are also a part of the front controller. In our case we dispatch the `/user get call` to the `userController` and the corresponding `ffapUser` method. To handle access control tasks we register a middleware to load the account from the system who made the request.
<br/><br/>
```javascript
class Routes {
  ...
  public getRoutes() {
    return [
      {
        path: "/user",
        name: Routes.FFAP_USER,
        method: "get",
        action: this.userController.ffapUser,
        middlewares: [this.fetchCurrentAccount]
      },
      ...
    ]
  }
}
```
Routes.ts
<br/><br/>
Inside the `UserController` we use a dependency injection container for our use cases. The controller method itself has only 3 tasks:
* mapping the request data to a query or command object
* executing the use case
* creating a success or error response

The `createErrorResponse` function made a response object in predefined structure and depending on the error code ( 404 response looks different to 403 or 401 )
<br/><br/>

```javascript
@injectable()
export class UserController extends AbstractController implements IServiceController {
  public constructor(
    @inject(UseCaseModule.UseCase)
    @named(UseCaseModule.FFAPUserUseCase)
    private readonly ffapUserUseCase: FFAPUserUseCase,
  ) { super(); }

  public async ffapUser(request: Request, response: Response): Promise<Response> {
    return this.ffapUserUseCase.execute(new FFAPUserQuery({
      pagination: { take: request.query.take, page: request.query.page },
    }), request.body.currentAccount).then((users) => {
      return response.status(STATUS_CODE.SUCCESS).send(
        CollectionResponse.builder().setResources(users).build().asJson()
      );
    }).catch((error: IError) => {
      return this.createErrorResponse(response, error);
    });
  }
}
```
UserController.ts
<br/><br/>
In this example we are using `class-validator` to define validation rules in decorator syntax for the input information. We can use this to validate the input data in the use case later.
<br/><br/>
```javascript
export class FFAPUserQuery {

  @IsOptional()
  @ValidateNested()
  public readonly pagination: Pagination;

  constructor( payload: { pagination?: IPaginationPayload }) {
    this.pagination = new Pagination(payload.pagination);
  }
}
```
FFAPUserQuery.ts
<br/><br/>
I like to use unified response objects for single or collection responses. The response body always include `response` or `responses` for the corresponding model. It's easier to decode on the frontend side. Response objects are easy to enhance later. Maybe you need a XML response as well?! No problem just add a `asXml()` method.
<br/><br/>
```javascript
class CollectionResponse extends AbstractResponse implements IResponse {

  ...
  private resources: any[];
  ...

  asJson() {
    return {
      resources: this.resources.map((res) => res.asJson())
    };
  }
}
```
CollectionResponse.ts
<br/><br/>
Okay now you know some fundamentals about the front controller pattern. Use it in your next project and you will see you raise the level of cohesion and separation of concerns.
