---
date: 2020-03-17
title: "Validation"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

There is only one place for validation: The Backend! If you think your frontend validation is enough, you are wrong. Every frontend validation follows a UX/UI concept to improve the usability and prevent unnecessary input failures. Validation from the aspect of security and database compatibility can only be a part of the backend itself.

There are different strategies of information validation in the backend. The two most common strategies are input-validation and model-validation.

Input-validation means, you validate the input information without change or transforming. This is really nice, because you can provide a good validation error object with target and error message.

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

The second one is model-validation, in this case you use the input information and hydrate your model. After this you check if your model is valid. The problem in this case is you have no target left which you can provide to the frontend. E.g. The request property <username> get's split in the backend and the first part will be forename and the last part will be surname. The model itself can only send validation errors for forename and surname and not for the username itself.

```javascript
@Entity()
export class Address extends BaseModel {

  @IsNotEmpty()
  @IsString()
  @Column()
  addressLineOne: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  addressLineTwo: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  city: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  zipCode: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  country: string;

  asJson() {
    return {
      addressLineOne: this.addressLineOne,
      addressLineTwo: this.addressLineTwo,
      city: this.city,
      zipCode: this.zipCode,
      country: this.country,
    };
  }
}

```
