import { storageConfig } from '@config/storage';
import { Router } from 'express';
import multer from 'multer';
import { CreateFileController } from '@modules/system/services/createFile/CreateFileController';
import { CreateFolderController } from '@modules/system/services/createFolder/CreateFolderController';
import { GenerateKeyControllerController } from '@modules/system/services/generateKey/GenerateKeyController';

const systemRouter = Router();
const systemController = new GenerateKeyControllerController();
const createFileController = new CreateFileController();
const createFolderController = new CreateFolderController();

const upload = multer(storageConfig.config.multer);

systemRouter.route('/generate-keys').post(systemController.handle);

systemRouter
  .route('/files')
  .post(upload.fields([{ name: 'files' }]), createFileController.handle);

systemRouter.route('/folders').post(createFolderController.handle);

export { systemRouter };
