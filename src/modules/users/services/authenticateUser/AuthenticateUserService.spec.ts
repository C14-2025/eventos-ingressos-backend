import { AuthenticateUserService } from "./AuthenticateUserService";
import { AppError } from "@shared/errors/AppError";

describe("AuthenticateUserService", () => {
  let usersRepository: any;
  let hashProvider: any;
  let cryptoProvider: any;
  let cacheProvider: any;
  let queryRunner: any;
  let connection: any;
  let service: AuthenticateUserService;

  beforeEach(() => {
    queryRunner = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      isTransactionActive: true,
      isReleased: false
    };

    connection = {
      mysql: {
        createQueryRunner: jest.fn(() => queryRunner)
      }
    };

    usersRepository = {
      findBy: jest.fn()
    };

    hashProvider = {
      compareHash: jest.fn()
    };

    cryptoProvider = {
      generateJwt: jest.fn()
    };

    cacheProvider = {
      save: jest.fn(),
      recover: jest.fn(),
      invalidate: jest.fn()
    };

    service = new AuthenticateUserService(
      usersRepository,
      hashProvider,
      cryptoProvider,
      cacheProvider,
      connection
    );
  });


  it("deve autenticar com sucesso", async () => {
    const fakeUser = { id: "123", password: "hash123" };
    const fakeTokens = { jwt_token: "jwt123", refresh_token: "ref123" };

    usersRepository.findBy.mockResolvedValue(fakeUser);
    hashProvider.compareHash.mockResolvedValue(true);
    cryptoProvider.generateJwt.mockReturnValue(fakeTokens);

    const result = await service.execute({
      email: "test@test.com",
      password: "123456"
    });

    expect(result.data).toEqual(fakeTokens);

    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });


  it("deve falhar quando email ou senha estão vazios", async () => {
    await expect(
      service.execute({ email: "", password: "" })
    ).rejects.toBeInstanceOf(AppError);

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });


  it("deve falhar quando o usuário não for encontrado", async () => {
    usersRepository.findBy.mockResolvedValue(null);

    await expect(
      service.execute({ email: "x@x.com", password: "123" })
    ).rejects.toThrow("User not found");

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });


  it("deve falhar quando a senha estiver incorreta", async () => {
    usersRepository.findBy.mockResolvedValue({
      id: "999",
      password: "hash"
    });

    hashProvider.compareHash.mockResolvedValue(false);

    await expect(
      service.execute({ email: "x@x.com", password: "wrong" })
    ).rejects.toThrow("Email or password are incorrect");

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });

  // --------------------------------------------------------------------
});
