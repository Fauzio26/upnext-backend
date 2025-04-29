// utils/multer.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

function createStorage(folderName) {
  const uploadPath = path.join('uploads', folderName);

  // Make sure directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });
}

export const uploadBanner = multer({ storage: createStorage('banners') });
export const uploadDocument = multer({ storage: createStorage('documents') });
export const uploadOrgAsset = multer({ storage: createStorage('orgs') });
