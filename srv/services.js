const cds = require('@sap/cds');

const nodemailer = require('nodemailer');

const { User, Policies, Documents } = cds.entities('insurance');

module.exports = (srv) => {

    // Insert user details with hashed password
    srv.on('CREATE', 'InsertUserDetails', async (req) => {
        const tx = cds.transaction(req);
        const { email, phone, username, password, role } = req.data;

        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const userData = {
                userId: new Date().getTime().toString(),
                email,
                phone,
                username,
                password: hashedPassword,
                role: role || "User"
            };

            const res = await tx.run(INSERT.into(User).entries(userData));
            return res;
        } catch (err) {
            console.error('Error during CREATE:', err);
            req.error(500, 'Failed to insert user details');
        }
    });

    // Read policies
    srv.on('READ', 'policies', async (req) => {
        try {
            const policiesData = await cds.run(SELECT.from(Policies));
            return policiesData;
        } catch (error) {
            console.error("Error fetching policies:", error);
            req.error(500, "Failed to retrieve policies data");
        }
    });

    // file upload function
        const fs = require('fs');

    const path = require('path');

    srv.on('uploadDocument', async (req) => {

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

//     // const fileUrl = `${req.protocol}://${req.headers.host}/files/${fileName}`;
//     // return fileUrl;
    
// // Construct full URL
//     const fileUrl = `${req.protocol}://${req.headers.host}/files/${fileName}`;
//     // Save metadata to HANA
//     await INSERT.into(Documents).entries({
//         documentId: cds.utils.uuid(),
//         documentType,
//         fileUrl,
//         uploadedAt: new Date(),
//         application_applicationId: applicationId // foreign key
//         });
    
//         return { fileUrl };

//     });
 

// Send OTP to user's email
srv.on('sendOtp', async (req) => {
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
                from: '"LTI Life Insurance" <ltilifeinsurance@gmail.com>',
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
});
};


    