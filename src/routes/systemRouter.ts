import { storageConfig } from '@config/storage';
import { Router } from 'express';
import multer from 'multer';
import { CreateFileController } from '@modules/system/services/generateKey/createFile/CreateFileController';
import { CreateFolderController } from '@modules/system/services/generateKey/createFolder/CreateFolderController';
import { GenerateKeyControllerController } from '@modules/system/services/generateKey/GenerateKeyController';
import { ListFileController } from '@modules/system/services/generateKey/listFile/ListFileController';

const systemRouter = Router();
const systemController = new GenerateKeyControllerController();
const createFileController = new CreateFileController();
const createFolderController = new CreateFolderController();
const listFileController = new ListFileController()

const upload = multer(storageConfig.config.multer);

systemRouter.route('/generate-keys').post(systemController.handle);

systemRouter
  .route('/files')
  .post(upload.fields([{ name: 'files' }]) as any, createFileController.handle)
  .get(listFileController.handle);


systemRouter
  .route('/folders')
  .post(createFolderController.handle)

export { systemRouter };
