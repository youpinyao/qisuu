const nodemailer = require('nodemailer');
const chalk = require('chalk');
const cliSpinners = require('cli-spinners');
const ora = require('ora');
const loading = ora({
  spinner: cliSpinners.dost
});


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
      subject: `${params.title}-${params.author}${params.convert ? ' convert' : ''}`, // Subject line
      text: `${params.title}-${params.author}`, // plain text body
      html: `<b>${JSON.stringify(params)}</b>`, // html body
      attachments: [{
        filename: params.filename,
        path: params.download_url,
      }],
    };

    loading.start('邮件发送中');

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      loading.stop();
      if (error) {
        reject(error);
        process.exit();
        return console.log(chalk.red(error));
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
