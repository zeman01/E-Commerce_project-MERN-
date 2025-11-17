import nodemailer from 'nodemailer';

// create transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,  //drtl ysqr ftkz azwl
  },
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        

        await transporter.sendMail({
            from: `"No Reply" <${process.env.SMTP_USER}>`,
            to:"shresthajaman@gmail.com",
            subject:"testing mail services",
            text:"this is test mail",
        
        });
    } catch (error) {
        console.log("Error sending email:", error);
    }
};