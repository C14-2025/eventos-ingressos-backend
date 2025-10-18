import { CryptoProvider } from '../container/providers/CryptoProvider/implementations/CryptoProvider';


(async () => {
  const crypto = new CryptoProvider();
  crypto.generateKeys();
  console.log('✅ Chaves RSA regeneradas com sucesso!');
})();
