const cds = require('@sap/cds');
const nodemailer = require('nodemailer');

const { User, Applications } = cds.entities('insurance');

// Helper: Send email
async function sendMail({ to, subject, text, html }) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sankeertherra01@gmail.com',
            pass: 'doqp gmpl ujyh ubme'
        }
    });
    return transporter.sendMail({
        from: '"LTI Life Insurance" <ltiinsurance@gmail.com>',
        to,
        subject,
        text,
        html
    });
}

module.exports = cds.service.impl(async function () {
    const fs = require('fs');
    const path = require('path');

    this.on('uploadDocument', async (req) => {

      const { fileName, fileContent, documentType, applicationId } = req.data;
      const buffer = Buffer.from(fileContent, 'base64');

      // Define the path to save the file

      const dirPath = path.join(__dirname, 'files');
      const filePath = path.join(dirPath, fileName);

      // Ensure the directory exists

      if (!fs.existsSync(dirPath)) {

        fs.mkdirSync(dirPath, { recursive: true });

      }

      // Save the file to disk

      fs.writeFileSync(filePath, buffer);

      // Return the URL to access the file

      const fileUrl = `/files/${fileName}`;

      return fileUrl;
    }); 

// Send OTP to user's email
    this.on('sendOtp', async (req) => {
            const { email } = req.data;
            
            try {
                const user = await cds.run(SELECT.one.from(User).where({ email }));
                if (!user) {
                    req.error(404, 'User not found');
                    return;
                }

                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpGeneratedAt = new Date().toISOString();

                await cds.run(UPDATE(User).set({ otp, otpGeneratedAt }).where({ userId: user.userId }));

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'sankeertherra01@gmail.com',
                        pass: 'doqp gmpl ujyh ubme'
                    }
                });
                // need to improve the email content alot
                const mailOptions = {
                    from: '"LTI Life Insurance" <ltiinsurance@gmail.com>',
                    to: email,
                    subject: 'Your One-Time Password (OTP) for LTI Life Insurance',
                    text: `Dear ${user.username || "Valued Customer"},

    Thank you for choosing LTI Life Insurance.

    Your One-Time Password (OTP) is: ${otp}

    This OTP is valid for 10 minutes. Please do not share this code with anyone for security reasons.

    If you did not request this OTP, please contact our support team immediately.

    Best regards,
    LTI Life Insurance Team

    ----------------------------------------
    LTI Life Insurance
    Customer Support: support@ltilifeinsurance.com
    Website: https://www.ltilifeinsurance.com
    `,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                            <div style="text-align: center; margin-bottom: 16px;">
                                <img src="https://companieslogo.com/img/orig/LTIM.NS-dea59dc6.png" alt="LTI Life Insurance" style="height: 60px;" />
                            </div>
                            <h2 style="color: #2c3e50;">Your One-Time Password (OTP)</h2>
                            <p>Dear <strong>${user.username || "Valued Customer"}</strong>,</p>
                            <p>Thank you for choosing <b>LTI Life Insurance</b>.</p>
                            <p style="font-size: 18px; color: #1565c0; margin: 24px 0;">
                                <b>Your OTP is: <span style="letter-spacing: 2px;">${otp}</span></b>
                            </p>
                            <p>This OTP is valid for <b>10 minutes</b>. Please do not share this code with anyone for security reasons.</p>
                            <p>If you did not request this OTP, please contact our support team immediately.</p>
                            <hr style="margin: 24px 0;">
                            <p style="font-size: 13px; color: #888;">
                                Best regards,<br>
                                <b>LTI Life Insurance Team</b><br>
                                <a href="mailto:support@ltilifeinsurance.com">support@ltilifeinsurance.com</a><br>
                                <a href="https://www.ltilifeinsurance.com">www.ltilifeinsurance.com</a>
                            </p>
                        </div>
                    `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Email send error:", error);
                        req.error(500, 'Failed to send OTP');
                    } else {
                        console.log("Email sent:", info.response);
                    }
                });

                return { message: 'OTP sent successfully' };

            } catch (error) {
                console.error('Error sending OTP:', error);
                req.error(500, 'Failed to send OTP');
            }
        });

    this.on('sendApplicationConfirmation', async (req) => {
    const { userId, applicationId } = req.data;
    try {
        const user = await cds.run(SELECT.one.from(User).where({ userId }));
        if (!user || !user.email) {
            req.error(404, 'User not found');
            return;
        }

        const subject = 'Your Insurance Application Received';
        const text = `Dear ${user.username || "Customer"},
Thank you for applying for insurance with LTI Life Insurance.
Your application (ID: ${applicationId}) has been received and is currently being reviewed.
We will notify you once your application is processed.

Best regards,
LTI Life Insurance Team`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                <div style="text-align: center; margin-bottom: 16px;">
                    <img src="https://companieslogo.com/img/orig/LTIM.NS-dea59dc6.png" alt="LTI Life Insurance" style="height: 60px;" />
                </div>
                <h2 style="color: #2c3e50;">Application Received</h2>
                <p>Dear <strong>${user.username || "Customer"}</strong>,</p>
                <p>Thank you for applying for insurance with <b>LTI Life Insurance</b>.</p>
                <p>Your application <b>(ID: ${applicationId})</b> has been received and is currently being reviewed.</p>
                <p>We will notify you once your application is processed.</p>
                <hr style="margin: 24px 0;">
                <p style="font-size: 13px; color: #888;">
                    Best regards,<br>
                    <b>LTI Life Insurance Team</b><br>
                    <a href="mailto:support@ltilifeinsurance.com">support@ltilifeinsurance.com</a><br>
                    <a href="https://www.ltilifeinsurance.com">www.ltilifeinsurance.com</a>
                </p>
            </div>
        `;

        await sendMail({ to: user.email, subject, text, html });
        return { message: 'Application confirmation email sent.' };
    } catch (err) {
        console.error("Error sending application confirmation email:", err);
        req.error(500, 'Failed to send confirmation email');
    }
});

this.on('sendApplicationStatusUpdate', async (req) => {
    const { applicationId } = req.data;
    try {
        // Fetch updated application and user
        const app = await cds.run(SELECT.one.from(Applications).where({ applicationId }));
        if (!app) {
            req.error(404, 'Application not found');
            return;
        }
        const user = await cds.run(SELECT.one.from(User).where({ userId: app.user_userId }));
        if (!user || !user.email) {
            req.error(404, 'User not found');
            return;
        }

        const subject = 'Update on Your Insurance Application';
        const text = `Dear ${user.username || "Customer"},
Your insurance application (ID: ${applicationId}) status has been updated to: ${app.status}.
${app.status === 'Approved' ? 'Congratulations! Your application has been approved.' : app.status === 'Rejected' ? 'Unfortunately, your application was not approved.' : ''}
For more details, please log in to your account.

Best regards,
LTI Life Insurance Team`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
                <div style="text-align: center; margin-bottom: 16px;">
                    <img src="https://companieslogo.com/img/orig/LTIM.NS-dea59dc6.png" alt="LTI Life Insurance" style="height: 60px;" />
                </div>
                <h2 style="color: #2c3e50;">Application Status Update</h2>
                <p>Dear <strong>${user.username || "Customer"}</strong>,</p>
                <p>Your insurance application <b>(ID: ${applicationId})</b> status has been updated to: <b>${app.status}</b>.</p>
                <p>
                    ${
                        app.status === 'Approved'
                            ? 'Congratulations! Your application has been approved.'
                            : app.status === 'Rejected'
                                ? 'Unfortunately, your application was not approved.'
                                : ''
                    }
                </p>
                <p>For more details, please log in to your account.</p>
                <hr style="margin: 24px 0;">
                <p style="font-size: 13px; color: #888;">
                    Best regards,<br>
                    <b>LTI Life Insurance Team</b><br>
                    <a href="mailto:support@ltilifeinsurance.com">support@ltilifeinsurance.com</a><br>
                    <a href="https://www.ltilifeinsurance.com">www.ltilifeinsurance.com</a>
                </p>
            </div>
        `;

        await sendMail({ to: user.email, subject, text, html });
        return { message: 'Application status update email sent.' };
    } catch (err) {
        console.error("Error sending application status update email:", err);
        req.error(500, 'Failed to send status update email');
    }
});

});