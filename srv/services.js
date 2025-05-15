const cds=require('@sap/cds');
const bcrypt = require('bcryptjs');
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
}