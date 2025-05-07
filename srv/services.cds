using { insurance as details } from '../db/datamodel';

service MyService {

    entity users as projection on details.User;
    entity policies as projection on details.Policies;
    entity applications as projection on details.Applications;
    @cds.redirection.target : 'MyService.InsertUserDetails'
    entity InsertUserDetails as projection on details.User;
    
}