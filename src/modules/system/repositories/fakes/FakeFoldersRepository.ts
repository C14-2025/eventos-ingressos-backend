import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';
import { Folder } from '@modules/system/entities/Folder';
import { IFoldersRepositoryDTO } from '../IFoldersRepository';

export class FakeFoldersRepository
  extends FakeBaseRepository<Folder>
  implements IFoldersRepositoryDTO {
  public constructor() {
    super(Folder);

    // non-generic methods here
  }
}
