require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "mf.manishshah@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "Manish <mf.manishshah@gmail.com>",
  to: "mf.manishshah@gmail.com",
  subject: "Gmail API NodeJS",
};

module.exports = {
  auth,
  mailoptions,
};