const cds=require('@sap/cds');
const{User}=cds.entities('insurance');
module.exports=(srv)=>{
    srv.on('CREATE','InsertUserDetails',async(req)=>{
        const tx=await cds.tx(req);
        try{
            var res=await tx.run(INSERT.into(User).entries(req.data));
            return res;
        }
        catch(err){
            console.log(err);
        }
    }
);
}