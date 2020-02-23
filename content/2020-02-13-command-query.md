---
date: 2020-02-13
title: "Command - Query"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

In object-oriented programming, the command pattern is a behavioral design pattern in which an object is used to encapsulate all information needed to perform an action or trigger an event at a later time. This information includes the method name, the object that owns the method and values for the method parameters. Since I am using use cases to encapsulate the business logic I only use commands and queries as data transfer objects with validation rules.

## Example
In this Example we take a look at a create user command. I use the `class-validator` framework to define validation rules for the input information. Later in the use case we can validate this command and create an validation error on failure.

```javascript
export class CreateUserCommand {
  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @IsNotEmpty()
  @IsInt()
  public readonly age: number;

  constructor(payload: { name: string, age: number }) {
    this.name = payload.name;
    this.age  = payload.age;
  }
}
```
<br></br>
The following example shows the query variant of this pattern. Because the most queries to our system will follow the same structure we can use an abstract implementation to unify input parameters like pagination or id filter.

```javascript
export class GetUserQuery extends AbstractQuery {
  constructor(payload: { id?: string, pagination?: Pagination }) {
    this.id         = payload.id;
    this.pagination = payload.pagination;
    super();
  }
}
```
<br></br>
The way the information get passed to the Commands and Queries is shown in the [Front Controller Pattern](/front-controller)
