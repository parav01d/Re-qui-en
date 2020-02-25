---
date: 2020-02-15
title: "Dependency Injection"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

Dependency Injection is a technique of object oriented programming whereby one object supplies the dependencies of another object. Two principles are followed in this pattern. The first one is `separation of concerns` of construction and use of objects and the second one is `inversion of control`, because a client who wants to call some services should not have to know how to construct those services. Instead, the client delegates the responsibility of providing its services to external code.

In general we distinguish four different parts:

* the `service object` to be used
* the `client object` that is depending on the service
* the `interfaces` that define how the client may use the service
* the `injector`, which is responsible for constructing the services and injecting them into the client

<br/><br/>
## Example without dependency injection

```javascript
class Service implements IService {
  ...
}
```

```javascript
class Client implements IClient {

  service: IService;

  constructor() {
    super();
    this.service = new Service();
  }
}
```
You see there are no explicit injector because the client class becomes the injector itself creating the service in its own constructor. If you see this, you should talk with your technical lead about this problem, because you will get in trouble in the future.
<br/><br/>
## Problems that occur with this implementation

When unit testing a method of the client object which is using the service instance created by the constructor, you will get trouble mocking the service. Because in unit tests you should test the functionality of the method and not the implementation of the service.

```javascript

class Client implements IClient {

  service: IService;

  constructor() {
    super();
    this.service = new Service();
  }

  public methodToTest(x: number, y: number): number {
    return this.service.dontTestMe(x) + this.service.dontTestMe(y)
  }
}
```

```javascript
const client = new Client();
const result = client.methodToTest(1,2);
expect(result).toBe(3);
```

The significance of the test is reduced because the test fails even if the service implementation is faulty. In more complex implementations this problem can be
<br/><br/>
## Example with dependency injection (Constructor injection)

```javascript
class Client implements IClient {

  service: IService;

  constructor(service: Service) {
    super();
    this.service = service;
  }

  public methodToTest(x: number, y: number): number {
    return this.service.dontTestMe(x) + this.service.dontTestMe(y)
  }
}
```

```javascript
class MockService {
  public dontTestMe(x: number): number {
    return x;
  }
}
const mockService = new MockService();
const client = new Client(mockService);
const result = client.methodToTest(1,2);
expect(result).toBe(3);
```

This solution is more elegant, but it shifts the problem of the constructor call to the upper level. So at the application entry point we will have a large amount of constructor calls.
<br/><br/>
## Example with dependency injection (Setter injection)

```javascript
class Client implements IClient {

  service?: IService;

  constructor() {
    super();
  }

  set service(service:IService) {
    this.service = service;
  }

  public methodToTest(x: number, y: number): number {
    if(!this.service) {
      throw Error("Invalid Parameter: service must not be null")
    }
    return this.service.dontTestMe(x) + this.service.dontTestMe(y)
  }
}
```

```javascript
class MockService {
  public dontTestMe(x: number): number {
    return x;
  }
}
const mockService = new MockService();
const client = new Client();
client.service = mockService;
const result = client.methodToTest(1,2);
expect(result).toBe(3);
```

This offers flexibility, but if there is more than one dependency to be injected, it is difficult for the client to ensure that all dependencies are injected before the client could be provided for use.
<br/><br/>
## Example with dependency injection (Static Factory Method)

```javascript
class Client implements IClient {

  service?: IService;

  constructor(service: IService) {
    super();
    this.service = service;
  }

  public methodToTest(x: number, y: number): number {
    return this.service.dontTestMe(x) + this.service.dontTestMe(y)
  }
}
```

```javascript
class Injector implements IInjector {

  static create() {
    const service = new Service();
    const client = new Client(service);
    return client;
  }
}
```

```javascript
// the create function is static so there is no way to change it for test purposes.
// so the dontTestMe() function gets called without change or replacement. 
const client = Injector.create();
const result = client.methodToTest(1,2);
expect(result).toBe(3);
```

The use of this generation pattern amounts to subclassing. There must be a separate class that can accommodate the class method for generation. But sometimes its helpful to create an instance from different inputs. For example, a `Color.createFromRGB()` method can create a color object from RGB values, and a `Color.createFromHSV()` method can create a color object from HSV values.

Long Story Short: There are several ways to create an object. Obvious the worst way is to use a constructor call in another one. For real, you will lost all your fame if you do it.
The `Gang of Four` (Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides) defined 5 patterns to create an object:

* Factory method
* Abstract Factory
* Singleton
* Builder
* Prototype

These are enough and you should understand these patterns before writing your next line of code.
