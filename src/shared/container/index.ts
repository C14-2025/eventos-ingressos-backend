import './providers';
import { container } from 'tsyringe';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { UsersRepository } from '@modules/users/repositories/UsersRepository';
import { ITicketsRepository } from '@modules/events/repositories/ITicketsRepository';
import { TicketsRepository } from '@modules/events/repositories/TicketsRepository';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { EventsRepository } from '@modules/events/repositories/EventsRepository';
import { IFilesRepositoryDTO } from '@modules/system/repositories/IFilesRepository';
import { FilesRepository } from '@modules/system/repositories/FilesRepository';
import { IFoldersRepositoryDTO } from '@modules/system/repositories/IFoldersRepository';
import { FoldersRepository } from '@modules/system/repositories/FoldersRepository';

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

container.registerSingleton<IFilesRepositoryDTO>(
  'FilesRepository',
  FilesRepository,
);

container.registerSingleton<IFoldersRepositoryDTO>(
  'FoldersRepository',
  FoldersRepository,
);


