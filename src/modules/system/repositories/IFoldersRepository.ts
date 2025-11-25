import { Folder } from '@modules/system/entities/Folder';
import { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IFoldersRepositoryDTO extends IBaseRepository<Folder> { }
