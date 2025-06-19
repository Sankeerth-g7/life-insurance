const cds = require('@sap/cds');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const { User, Policies } = cds.entities('insurance');

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
                    user: 'ltilifeinsurance@gmail.com',
                    pass: 'eyoi pobq rbpt gerg' // Gmail App Password
                }
            });

            const mailOptions = {
                from: '"LTI Life Insurance" <ltilifeinsurance@gmail.com>',
                to: email,
                subject: 'Your OTP Code',
                text: `Dear ${user.username || "User"},\n\nYour OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nRegards,\nLTI Life Insurance`
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
};



    