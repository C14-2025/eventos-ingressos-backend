import './providers';
import { container } from 'tsyringe';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { UsersRepository } from '@modules/users/repositories/UsersRepository';
import { ITicketsRepository } from '@modules/events/repositories/ITicketsRepository';
import { TicketsRepository } from '@modules/events/repositories/TicketsRepository';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { EventsRepository } from '@modules/events/repositories/EventsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ITicketsRepository>(
  'TicketsRepository',
  TicketsRepository,
);

container.registerSingleton<IEventsRepository>(
  'EventsRepository',
  EventsRepository,
);

