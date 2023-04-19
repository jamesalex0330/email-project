import HttpStatus from "http-status";
import repositories from "../repositories";
import models from "../models";
import { error } from "winston";

const { accountRepository, attachmentRepository } = repositories;


export default {

    /**
     * Read CSV
     */
    async uploadCsv(req, res, next) {
        try {
            let user = await attachmentRepository.uploadCsv(req);
            res.status(HttpStatus.OK).json({
                success: true,
                data: user,
            });
        } catch (error) {
            res.json({
                success: false,
                data: {},
            });
        }
    }
}