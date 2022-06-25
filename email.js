const nodemailer = require("nodemailer");

// in the execution block of the mailer function in the file that will be importing this function, there needs to be a try catch block, so that the error can then be covered with an error message!

const sendMail = async options => {
    // transporter
    const transporter = nodemailer.createTransport({
        // service: "Gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "your email",
            pass: "your password"
        }
    });

    // var transporter = nodemailer.createTransport({
    //     host: "smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //       user: "614c49e92dd259",
    //       pass: "e954befc9d774e"
    //     }
    //   });

    // mail options
    const mailOptions = {
        from: "name <email>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // sending the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;