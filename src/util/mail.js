const nodemailer = require('nodemailer');

const user = '497400448@qq.com';
const password = 'herutnlsqumvbiec';

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// eslint-disable-next-line
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: user, // generated ethereal user
    pass: password // generated ethereal password
  }
});

function sendTo(params) {
  return new Promise((reslove, reject) => {
    // setup email data with unicode symbols
    let mailOptions = {
      from: `"qissu robot" <${user}>`, // sender address
      to: params.mail, // list of receivers
      subject: `${params.title} ${params.author}`, // Subject line
      text: `${params.title} ${params.author}`, // plain text body
      html: `<b>${JSON.stringify(params)}</b>`, // html body
      attachments: [{
        filename: params.filename,
        path: params.download_url,
      }],
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      reslove();

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
}

module.exports = {
  sendTo,
}
