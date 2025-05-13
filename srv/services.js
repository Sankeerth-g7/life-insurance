const cds=require('@sap/cds');
const{User}=cds.entities('insurance');
module.exports=(srv) => {
    
    srv.on('CREATE', 'InsertUserDetails', async (req) => {
        const tx = cds.transaction(req);
         try {
            const res = await tx.run(INSERT.into(User).entries(req.data));
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