---
date: 2020-03-18
title: "Definitions"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

I recommend to collect all constants and definitions of your project in one folder. This makes it really easy for your mates to find them, change them or get an overview about your project.

For example you can make a role/permission definition file to describe your role system:

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

As a fresh developer of this project, its really easy to understand this role system without seeing the underlying implementation.
