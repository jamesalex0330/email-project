import emailer from "./baseEmailer";
import config from "../config";
import ejsTemplate from "./ejs";
export default {

  forgotPassword(data) {
    return new Promise((resolve, reject) => {
      ejsTemplate.generateEjsTemplate(
        {
          template:"reset-link.ejs",
          data,
        },
        async (err, result) => {
          if (err) {
            reject(err);
          } else {
            const options = {
              to: data.to,
              subject: data.subject,
              message: result,
            };
            emailer
              .sendEmail(options)
              .then((object) => {
                resolve(object);
              })
              .catch((error) => {
                reject(error);
              });
          }
        }
      );
    });
  },
  
};
