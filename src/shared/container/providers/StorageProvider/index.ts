import { storageConfig } from '@config/storage';
import { container } from 'tsyringe';
import { DiskStorageProvider } from './implementations/DiskStorageProvider';
import { IStorageProviderDTO } from './models/IStorageProvider';

const providers: Record<
  typeof storageConfig.driver,
  () => IStorageProviderDTO
> = {
  disk: () => container.resolve(DiskStorageProvider),
};

container.registerInstance<IStorageProviderDTO>(
  'StorageProvider',
  providers[storageConfig.driver](),
);
