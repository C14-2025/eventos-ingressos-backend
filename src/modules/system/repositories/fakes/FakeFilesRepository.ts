import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';
import { IFilesRepositoryDTO } from '../IFilesRepository';

import { File } from '@modules/system/entities/File';

export class FakeFilesRepository
  extends FakeBaseRepository<File>
  implements IFilesRepositoryDTO {
  public constructor() {
    super(File);

    // non-generic methods here
  }
}
