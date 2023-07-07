const axios = require("axios");
const { generateConfig, postGenerateConfig } = require("../utils/utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("../utils/constants");
import models from "../models";
const { google } = require("googleapis");
const { log } = require("winston");
require("dotenv").config();
const { setting } = models;
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

const getRefreshToken = async () => {
    let settingData = await setting.findOne({ where: { field: "googleAuth" } });
    if (settingData) {
        var tokens = JSON.parse(settingData.value);
        oAuth2Client.setCredentials(tokens);
        const expiryDate = new Date(oAuth2Client.credentials.expiry_date);
        const now = new Date();
        const timeToExpiry = expiryDate.getTime() - now.getTime();
        const minutesToExpiry = Math.floor(timeToExpiry / (1000 * 60));
        if (minutesToExpiry < 6) {
            // Refresh the access token
            return new Promise(async (resolve, reject) => {
                oAuth2Client.refreshAccessToken(async (err, tokens) => {
                    if (err) {
                        reject(false);
                    } else {
                        // Save the new access token for future use
                        await setting.update({ value: JSON.stringify(tokens) }, { where: { field: "googleAuth" } });
                        resolve(tokens.access_token);
                    }
                });
            });
        } else {
            return tokens?.access_token;
        }

    } else {
        oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
        return new Promise(async (resolve, reject) => {
            oAuth2Client.refreshAccessToken(async (err, tokens) => {
                if (err) {
                    reject(false);
                } else {
                    // Save the new access token for future use
                    await setting.create({ field: "googleAuth", value: JSON.stringify(tokens) });
                    resolve(tokens.access_token);
                }
            });
        });
    }
}
async function messageList(email) {
    try {
        await getRefreshToken();
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages?q=is:unread&maxResults=10`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = generateConfig(url, token);
        const response = await axios(config);
        return await response.data;
    } catch (error) {
        throw error;
    }
}
async function readMail(email, messageId) {
    try {
        await getRefreshToken();
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = generateConfig(url, token);
        const response = await axios(config);
        return await response.data;
    } catch (error) {
        throw error;
    }
}
async function getAttachment(email, messageId, attachmentId) {
    try {
        await getRefreshToken();
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}/attachments/${attachmentId}`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = generateConfig(url, token);
        const response = await axios(config);
        return await response.data;
    } catch (error) {
        throw error;
    }
}
async function markAsRead(email, messageId) {
    try {
        await getRefreshToken();
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}/modify`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = postGenerateConfig(url, token, "post");
        const response = await axios(config);
        return await response.data;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    readMail,
    messageList,
    getAttachment,
    markAsRead,
    getRefreshToken
};