---
date: 2020-03-17
title: "Repository"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

To encapsulate database access and access to external resources we use repositories. There are several ORM-Implementations which supports a base repository to inherit from. In the most cases it makes sense to write a repository for each root aggregate. Creating a repository for each model will end in a big mess, trust me.

This is an example of the repository implementation of TypeORM:

```javascript
...

let allPhotos = await photoRepository.find();
console.log("All photos from the db: ", allPhotos);

let firstPhoto = await photoRepository.findOne(1);
console.log("First photo from the db: ", firstPhoto);

let meAndBearsPhoto = await photoRepository.findOne({ name: "Me and Bears" });
console.log("Me and Bears photo from the db: ", meAndBearsPhoto);

let photoToUpdate = await photoRepository.findOne(1);
photoToUpdate.name = "Me, my friends and polar bears";
await photoRepository.save(photoToUpdate);

...
```

Providing an interface to get an empty model will helps you to mock all the database specific dependencies in your unit tests (preventing constructor calls):


```javascript
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  public getEmptyUserModel(): User {
    return new User();
  }
}

```
