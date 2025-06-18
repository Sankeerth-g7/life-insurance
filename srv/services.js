const cds=require('@sap/cds');
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');

const{User,Policies}=cds.entities('insurance');
module.exports=(srv) => {
    
    srv.on('CREATE', 'InsertUserDetails', async (req) => {
        const tx = cds.transaction(req);
        const { email, phone, username, password, role } = req.data;

        try {
            // Generate salt and hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const userData = {
                userId: new Date().getTime().toString(),
                email,
                phone,
                username,
                password: hashedPassword, // Store hashed password
                role: role || "User"
            };

            const res = await tx.run(INSERT.into(User).entries(userData));
            return res;
        } catch (err) {
            console.error('Error during CREATE:', err);
            req.error(500, 'Failed to insert user details');
        }
    });

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
                    user: 'tharuninaini@gmail.com',    // Replace with your Gmail address
                     pass: 'Tharuni@1114'       // Replace with your Gmail app password
                    }
                });
    
const mailOptions = {
    from: `" LTI Life Insurance " <tharuninaini@gmail.com>`,
     to: email,
     subject: 'Your OTP Code',
     text: `Your OTP is: ${otp}`
    };
    
    await transporter.sendMail(mailOptions);
    return { message: 'OTP sent successfully' };
    
    } catch (error) {
        console.error('Error sending OTP:', error);
        req.error(500, 'Failed to send OTP');
    }
     });
    };


