/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import config from '../config';

const allowedFormats = {
    image: ['.png', '.jpg', '.gif', '.jpeg'],
    video: ['.mp4', '.mov', '.wmv', '.avi'],
    presentations: ['.pdf', '.html', '.ppt', '.pptx'],
    audio: ['.aac', '.m4a', '.mp3'],
    upload: ['.xlsx', '.xls', '.csv','.dat'],
};
const format = ['jpeg', 'png', 'jpg', 'docx', 'xlsx', 'csv', 'doc', 'mp3', 'mp4', 'pdf','dat'];



// using below function for local file system diskStorage
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const { mediaFor } = req.params;
        const fileDir = path.join(
            __dirname,
            `../../public/uploads/${mediaFor}/thumb`,
        );
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true }, (err) => {
                throw Error(err);
            });
        }

        file.thumbDir = fileDir;

        cb(null, `public/uploads/${mediaFor}/`);
    },
    filename: (req, file, cb) => {
        const dateTimeStamp = Date.now();
        const filename = file.originalname.replace(/[^A-Z0-9.]/gi, '-');
        const fileArray = filename.split('.');
        const ext = fileArray.pop();
        cb(null, `${fileArray.join('-')}-${dateTimeStamp}.${ext}`);
    },
});

async function getStorage(type = 'local') {
    return multer({
        storage: type = storage,
        fileFilter: (req, file, callback) => {
            let fileFormats = [];
            const { params: { mediaType } } = req;
            const ext = path.extname(file.originalname);
            if (mediaType === 'image') {
                fileFormats = allowedFormats.image;
            } else if (mediaType === 'video') {
                fileFormats = allowedFormats.video;
            } else if (mediaType === 'presentations') {
                fileFormats = allowedFormats.presentations;
            } else if (mediaType === 'audio') {
                fileFormats = allowedFormats.audio;
            } else if (mediaType === 'upload') {
                fileFormats = allowedFormats.upload;
            }
            if (!fileFormats.includes(ext.toLowerCase())) {
                return callback(new Error('Invalid file format.'));
            }
            callback(null, true);
        },
        limits: {
            fileSize: config.app.mediaUploadSizeLimit,
        },
    });
}
async function getFileStorage(type = 'local') {
    return multer({
        storage: type === 's3' ? storageAWS : storage,
        fileFilter: (req, file, callback) => {
            const ext = path.extname(file.originalname).split('.').pop();
            if (!format.includes(ext.toLowerCase())) {
                return callback(new Error(`Please add either a ${format.toString()} file`));
            }
            callback(null, true);
        },
        limits: {
            fileSize: config.app.mediaUploadSizeLimit,
        },
    });
}

export default {
    getStorage,
    getFileStorage,
};
