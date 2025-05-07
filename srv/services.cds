using { insurance } from '../db/datamodel';

service MyService {

    entity users as projection on insurance.User;
    entity policies as projection on insurance.Policies;
    entity applications as projection on insurance.Applications;
    
}