namespace insurance;

entity User {
    key userId: String;
    email: String;
    mobilenumber: String;
    username: String;
    password: String;
    role: String; //admin or customer
}

entity Policies {
    key policyId: String;
    policyName: String;
    policyType: String;
    policyDescription: String;
    premiumAmount: Decimal;
    coverageAmount: Decimal;
    termLength: Integer;  // means years
    startDate: Date;
}

entity Applications {
    key applicationId: String;
    user: Association to one User;
    policy: Association to one Policies;
    applicantName: String;
    applicantAge: String;
    applicantAddress: String;
    applicantMobile: String;
    applicantEmail: String;
    applicationAadhar: String;
    applicationPan: String;
    applicantOccupation: String;
    applicationDate: Date;
    status: String;
    documentType: String;
}

entity Documents {
    key documentId: String;
    documentType: String;
    documentUpload: LargeBinary;
    application: Association to one Applications;
}




