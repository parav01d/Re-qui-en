---
date: 2020-02-27
title: "Domain Event"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

To reduce noise in our business logic and notify external systems we trigger fire and forget events. Let's take a look at this use case:

```javascript

injectable();
export class UpdateUserUseCase extends AbstractUseCase implements IUseCase {

  public static DOMAIN_EVENT_NAME: string = "UpdateUserEvent";

  public constructor(
    @inject(FrameworkServiceModule.EventService) protected eventService: IEventService,
    @inject(RepositoryModule.UserRepository) protected userRepository: IUserRepository,
    @inject(HydrationModule.UserHydrator) protected userHydrator: IUserHydrator,
  ) {
      super();
  }

  public async execute(command: UpdateUserCommand, currentUser: User): Promise<User> {
    this.checkAuthentication(currentUser);

    await this.validate(command);

    const hydratedUser = await this.userHydrator.hydrate(currentUser, command);
    const persistedUser = await this.userRepository.save(hydratedUser);

    this.fireDomainEvent({ name: UpdateUserUseCase.DOMAIN_EVENT_NAME, account: currentUser, payload: command, target: currentUser });

    return persistedUser;
  }
}

```

In this case we:
* get an command with the corresponding user input
* validate the input data
* update the current user with the input information
* persist it.

In most systems there are logging services to create an history to make changes comprehensible. This is really easy in our case, because the underlaying implementation uses the node event emitter and it's easy to subscribe to it. It's possible to connect for example Rabbit MQ with our event emitter to unify the event structure and make it accessible for external systems.
<br></br>
Here is an example for a notification listener:

```javascript

@injectable()
class UserListener {

  constructor(
    @inject(FrameworkServiceModule.EventService) private readonly eventService: IEventService,
    @inject(FrameworkServiceModule.TranslationService) protected translationService: ITranslationService,
    @inject(ServiceModule.NotificationService) private readonly notificationService: INotificationService,
  ) {
      this.eventService.addEventListener(UpdateUserUseCase.DOMAIN_EVENT_NAME, this.notify, this);
    }

    public unsubscribe() {
      this.eventService.removeEventListener(UpdateUserUseCase.DOMAIN_EVENT_NAME, this.notify, this);
    }

    private async notify({target: payload}: {target: IEventPayload<UpdateUserCommand, User>}) {
      return this.notificationService.sendSlackNotification(
        this.translationService.translate(BOT_USER_UPDATED, { name: payload.target.name }),
        config.slack.SLACK_APP_CHANNEL
      );
    }
}

```
<br></br>
If you have no idea how to develop an easy event service here is an example with "eventbusjs"
```javascript

import EventBus from "eventbusjs";
...

@injectable()
export class EventService implements IEventService {

  public dispatch<Payload, Model>(name: string, payload: IEventPayload<Payload, Model>): void {
    EventBus.dispatch(name, payload);
  }

  public addEventListener(name: string, func: (event: any) => void, reference: object): void {
    EventBus.addEventListener(name, func, reference);
  }

  public removeEventListener(name: string, func: (event: any) => void, reference: object): void {
    EventBus.removeEventListener(name, func, reference);
  }

  public getEvents(): string {
    return EventBus.getEvents();
  }
}

```
