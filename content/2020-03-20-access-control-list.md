---
date: 2020-03-20
title: "Access Control List"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

Implementing an access control list can be a very difficult challenge. In the most cases we find a RBAC (Role Based Access Control) or ABAC (Attribute Based AccessControl) implementation when we come into an existing project. But when you start a new project and some requirements are unclear, I can recommend starting with this approach:

### Creating a resource based access control with user/resource hierarchy

We start building a permission model which represent standard (CRUD) actions at the beginning:

```javascript
export enum PermissionType {
  ALLOWED_TO_CREATE = "ALLOWED_TO_CREATE",
  ALLOWED_TO_READ   = "ALLOWED_TO_READ",
  ALLOWED_TO_UPDATE = "ALLOWED_TO_UPDATE",
  ALLOWED_TO_DELETE = "ALLOWED_TO_DELETE",
}

@Entity()
export class Permission extends BaseModel {

  @Column({
      type: "enum",
      enum: PermissionType,
      unique: true,
  })
  type: PermissionType;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

}
```
You should seed your database with one instance of each.

<br></br>

At the second step we build a role model to group some permissions together:

```javascript
export enum RoleType {
  CREATOR = "CREATOR",
  EDITOR  = "EDITOR",
  VISITOR = "VISITOR"
}

@Entity()
export class Role extends BaseModel {

    @Column({
        type: "enum",
        enum: RoleType,
        unique: true,
    })
    type: RoleType;

    @ManyToMany(() => Permission)
    @JoinTable()
    permissions: Permission[];
}
```
<br></br>
A role definition will help you taking an overview about your ACL and easy introduce new developers.

```javascript
export default {
  [RoleType.CREATOR]: [
    PermissionType.ALLOWED_TO_CREATE,
    PermissionType.ALLOWED_TO_UPDATE,
    PermissionType.ALLOWED_TO_FIND,
    PermissionType.ALLOWED_TO_DELETE,
    PermissionType.ALLOWED_TO_INVITE,
  ],
  [RoleType.EDITOR]: [
    PermissionType.ALLOWED_TO_FIND,
    PermissionType.ALLOWED_TO_UPDATE,
  ],
  [RoleType.VISITOR]: [
    PermissionType.ALLOWED_TO_FIND,
  ]
};
```
<br></br>

Okay now we need to bring our resource together with the roles and permissions. We call this: taking responsibility.

```javascript
export enum ResponsibilityType {
  COMPANY = "COMPANY",
  BUSINESS = "BUSINESS"
}

@Entity()
export class Responsibility extends BaseModel {

    @ManyToOne(() => User, (user) => user.responsibilities)
    user: User;

    @Column({
        type: "enum",
        enum: ResponsibilityType,
    })
    type: ResponsibilityType;

    @Column()
    targetId: number;

    @ManyToMany(() => Role)
    @JoinTable()
    roles: Role[];

}
```
<br></br>

Starting with this project a user can create a company, which means he is the creator of the company.
User -> Responsibility -> COMPANY
                       -> CREATOR Role -> CRUD Permission

Now this user invite another user to the project to maintain the created company.
User -> Responsibility -> COMPANY
                       -> EDITOR Role -> RU Permission

All callcenter agents needs access to the company data to inform clients:
User -> Responsibility -> COMPANY
                       -> VISITOR Role -> R Permission

Okay you see this works really great based on single user invites and single user-resource responsibility handling.
<br></br>

#### Why this approach fails

It's very common not to invite someone to maintain one resource, in the most cases users will be a part of an hierarchy based on company structures. Or the underlaying model structure depends on permission inheritance.

For example: You own a company
User -> Responsibility -> COMPANY
                       -> CREATOR Role -> CRUD Permission
For all Businesses of this company you inherit the company rules:
User -> Responsibility -> BUSINESS
                       -> CREATOR Role -> CRUD Permission                   


... I will finish this post later ... 
