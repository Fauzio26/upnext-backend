import multer from 'multer';

const imageMimeTypes = [
  'image/jpeg', 
  'image/png', 
  'image/jpg'
];

const documentMimeTypes = [
  'application/pdf',
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
];


const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'documents') {
    if (!documentMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF and DOC/DOCX documents are allowed for documents field'), false);
    } else {
      return cb(null, true);
    }
  } else if (['banners', 'profilePic', 'membershipProof'].includes(file.fieldname)) {
    if (!imageMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, JPEG, and PNG images are allowed for image fields'), false);
    } else {
      return cb(null, true);
    }
  } else {
    return cb(null, true); 
  }
};


const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter,
});

export default upload;
