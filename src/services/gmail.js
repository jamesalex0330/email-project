const axios = require("axios");
const { generateConfig, postGenerateConfig } = require("../utils/utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("../utils/constants");
const { google } = require("googleapis");

require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function messageList(email) {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages?q=is:unread`;
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
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}/modify`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = postGenerateConfig(url, token, "post");
        const response = await axios(config);
        console.log(response.data);
        return await response.data;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    readMail,
    messageList,
    getAttachment,
    markAsRead
};