const multer = require('multer');
const path = require('path');

// Use memory storage to avoid local file persistence
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    // Extract extension name
    const extName = path.extname(file.originalname).toLowerCase();
    const extname = allowedTypes.test(extName);
    
    // Check mimetype (allowing generic image/ prefixes common in React Native uploads)
    const mimetype = file.mimetype.startsWith('image/') || allowedTypes.test(file.mimetype);

    console.log('[Multer FileFilter] Uploading file:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        extName,
        isValidExt: extname,
        isValidMime: mimetype
    });

    if (extname || mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpg, jpeg, png, webp, gif) are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit (support high-res mobile uploads)
    fileFilter: fileFilter
});

module.exports = upload;
