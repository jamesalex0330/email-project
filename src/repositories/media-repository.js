import fs from "fs";
import path from "path";
import multer from "multer";
import config from "../config";
import models from "../models";
import HttpStatus from "http-status";


const { BlogImages } = models;
const { Op, literal } = models.Sequelize;


// using below function for local file system diskStorage
const storages = multer.diskStorage({
  destination: function (req, file, cb) {
    var uplds = path.join(__dirname, `../../public/uploads`)
    file.path= uplds
    cb(null, uplds)
  },
  filename: (req, file, cb) => {
    console.log(file);
    const datetimestamp = Date.now();
    const filename = file.originalname.replace(/[^A-Z0-9.]/gi, "-");
    const fileArray = filename.split(".");
    const ext = fileArray.pop();
    cb(null, `${fileArray.join("-")}-${datetimestamp}.${ext}`);
  }
});
export default {
  // we will decide here storage type
  async uploadFile(req, res, next) {
    console.log(req.file);
        
    try {
      const upload= multer({
        storage: storages
      })
      upload.array("file",5)(req,res,async(error)=>{
        console.log(error);
      })
      
      console.log(req.file);
    var savemedia = await BlogImages.create({
        Name: req.body.name});
        return savemedia
    } catch (error) {
      console.log(error);
    }
  }
}