import { injectable, inject } from 'tsyringe';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import { IFoldersRepositoryDTO } from '@modules/system/repositories/IFoldersRepository';
import { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import { Folder } from '@modules/system/entities/Folder';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { Connection } from '@shared/typeorm';

@injectable()
export class CreateFolderService {

  public constructor(
    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepositoryDTO,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('Connection')
    private readonly connection: Connection,
  ) {
  }

  public async execute(
    folderData: IFolderDTO,
  ): Promise<IResponseDTO<Folder>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {

      const folder = await this.foldersRepository.create(folderData, trx);

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:folders`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        message_code: 'CREATED',
        message: 'Folder successfully created',
        data: instanceToInstance(folder),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
