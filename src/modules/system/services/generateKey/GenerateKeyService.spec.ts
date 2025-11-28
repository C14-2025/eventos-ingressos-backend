import { GenerateKeyService } from './GenerateKeyService';
import { FakeCryptoProvider } from '@shared/container/providers/CryptoProvider/fakes/FakeCryptoProvider';
import { ICryptoProviderDTO } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';

let generateKeyService: GenerateKeyService;
let fakeCryptoProvider: ICryptoProviderDTO;

describe('GenerateKeyService', () => {
  beforeEach(() => {
    fakeCryptoProvider = new FakeCryptoProvider();
    generateKeyService = new GenerateKeyService(fakeCryptoProvider);
  });

  it('should be able to generate a key', async () => {
    const spyGenerate = jest.spyOn(fakeCryptoProvider, 'generateKeys');

    const result = await generateKeyService.execute();

    expect(spyGenerate).toHaveBeenCalled();


    expect(result).toHaveProperty('kty');
    expect(result).toHaveProperty('use');
    expect(result.use).toBe('sig');


    expect(result).toHaveProperty('n');
    expect(result).toHaveProperty('e');
  });
});
