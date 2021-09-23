const nodemailer = require('nodemailer');

const sendEmail = async options => {

     const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
               user: process.env.ADMIN_EMAIL,
               pass: process.env.ADMIN_PASSWORD
          }
     });

     const emailOptions = {
          from: 'Adil Nehal <adilnehal22@outlook.com>',
          to: options.email,
          subject: options.subject,
          text: options.message
     };

     await transporter.sendMail(emailOptions);
     
};

module.exports = sendEmail;