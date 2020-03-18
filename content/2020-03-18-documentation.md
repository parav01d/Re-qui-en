---
date: 2020-03-18
title: "Documentation"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

Maintaining an API Documentation can be very hard, so I recommend to generate dynamic parts of the documentation with scripts. This needs some experience in software craftsmanship, because the structure of the project can be avoid this. I will show you one hacky method which helps me creating a api documentation generation script in one day.
<br></br>
In my typescript projects I use the "class-validator" library to validate my input data. With decorators I can define rules for all different input values:

```javascript
export class CreateImpressionCommand {
  @IsNotEmpty()
  @IsInt()
  public readonly businessId: number;

  @IsNotEmpty()
  @IsString()
  public readonly description: string;

  @IsNotEmpty()
  public readonly image: Express.Multer.File;

  @IsIn(["image/jpeg", "image/png"])
  public readonly mimetype: string;

  constructor(payload: { businessId: string, description: string, image: Express.Multer.File }) {
    this.businessId    = parseInt(payload.businessId, 10);
    this.description   = payload.description;
    this.image         = payload.image;
    this.mimetype      = payload.image.mimetype;
  }
}

```
<br></br>
In my documentation generation script I bootstrap my application and initialise the dependency injection container with presets:

```javascript
const appRouteLoader = new AppRoutes();
appRouteLoader.initializeContainer();
appRouteLoader.initializeDependencies();
```
<br></br>

The "class-validator" library stores all rules with the corresponding objects in an MetaStorage object. This can be used to read all rules in JSON format:

```javascript
const metadata = get(getFromContainer(MetadataStorage), "validationMetadatas");
const schemas = validationMetadatasToSchemas(metadata);
```
<br></br>

The last step is dereferencing the JSON schema to get all rules for nested objects:

```javascript
dereference(s).then((dereferencedSchemas) => {
  ...
}
```
<br></br>

Using this approach and some file system writes later we get an api request documentation like this:

>## [PATCH] /activity/showcase/:activityShowcaseId
>#### Payload
>```javascript
>{
>  "activityShowcaseId": {
>    "type": "string",
>    "minLength": 1
>  },
>  "name": {
>    "minLength": 1,
>    "type": "string"
>  },
>  "description": {
>    "minLength": 1,
>    "type": "string"
>  },
>  "categoryIds": {
>    "minLength": 1,
>    "type": "array",
>    "items": {
>      "type": "integer"
>    }
>  }
>}
>
>Required: ["activityShowcaseId"]
>```
