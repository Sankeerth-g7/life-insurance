using { insurance as details } from '../db/datamodel';

service MyService {
    entity users as projection on details.User;
    entity policies as projection on details.Policies;
    entity applications as projection on details.Applications;
    @cds.redirection.target : 'MyService.InsertUserDetails'
    entity InsertUserDetails as projection on details.User;
    @cds.redirection.target : 'MyService.getPolicies'
    entity getPolicies as projection on details.Policies;
    action sendOtp(email: String) returns String;
    action uploadDocument(
        fileName: String,
        fileContent: String) 
        returns String;
    action sendApplicationConfirmation(
        userId: String,
        applicationId: String) 
        returns String;

    action sendApplicationStatusUpdate(
        applicationId: String,
        email: String,
        status: String) 
        returns String;

}


