const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vivekpawar51@gmail.com', // use your email
    pass: 'uxerirjrcuxogtwd',    // use App Password from Google
  },
});

async function sendOTP(email, otp) {
 const mailOptions = {
  from: '"ATS Pvt Ltd" <vivekpawar51@gmail.com>',
  to: email,
  subject: 'Your One-Time Password (OTP) for Verification',
  html: `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Welcome to ATS Pvt Ltd</h2>
      <p>Dear User,</p>
      <p>Your One-Time Password (OTP) for account verification is:</p>
      <h3 style="color:rgb(57, 142, 239);">${otp}</h3>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you did not request this OTP, please ignore this email.</p>
      <br />
      <p>Regards,<br />
      ATS Pvt Ltd Team</p>
    </div>
  `,
};


  await transporter.sendMail(mailOptions);
}

module.exports = { sendOTP };
