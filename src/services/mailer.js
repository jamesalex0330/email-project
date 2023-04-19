// const nodemailer = require('nodemailer');

// // Replace the following values with your own:
// const email = 'harishmahajan646@gmail.com';
// const password = '8085057546';
// const attachmentName = 'Axis BANK: Statment for february 2023';

// // Create a new transporter using your email account.
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: email,
//     pass: password,
//   }
// });

// // Listen for new emails.
// const emailListener = transporter.on('mail', (mail) => {
//   console.log(`New email received: ${mail.subject}`);
//   const attachment = mail.attachments.find(a => a.filename === attachmentName);
//   if (attachment) {
//     console.log(`Attachment found: ${attachment.filename}`);
//     // Do something with the attachment, for example, save it to a file.
//     // See step 3 for an example.
//   } else {
//     console.log(`Attachment not found: ${attachmentName}`);
//   }
// });

// // Log in to your email account.
// transporter.verify((error, success) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('Logged in to email account.');
//   }
// });

// // Handle errors.
// transporter.on('error', (error) => {
//   console.error(error);
// });
