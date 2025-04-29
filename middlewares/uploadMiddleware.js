import multer from 'multer';
import path from 'path';
import fs from 'fs';

const createFolder = (folder) => {
  const fullPath = path.join('uploads', folder);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
  return fullPath;
};

// Create multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = file.fieldname === 'banners' ? 'banners' : 'documents';
    cb(null, createFolder(folder));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});

const upload = multer({ storage });

export default upload;
