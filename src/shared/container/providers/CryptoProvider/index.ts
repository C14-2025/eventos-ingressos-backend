import { container, delay } from 'tsyringe';
import { CryptoProvider } from './implementations/CryptoProvider';
import { ICryptoProviderDTO } from './models/ICryptoProvider';

console.log('[Container] Registrando CryptoProvider...');

container.registerSingleton<ICryptoProviderDTO>(
  'CryptoProvider',
  delay(() => CryptoProvider),
);
