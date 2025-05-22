namespace insurance;

entity User {
    key userId: String;
    email: String;
    phone: String;
    username: String;
    password: String;
    role: String;
    failedAttempts: Integer;
    lastFailedAttempt: DateTime;
    isLocked: String;
    lockUntil: DateTime;
}


entity Policies {
    key policyId: String;
    policyName: String;
    policyType: String;
    policyDescription: String;
    premiumAmount: Decimal;
    coverageAmount: Decimal;
    termLength: Integer;
    startDate: Date;
}

entity Applications {
    key applicationId: String;
    user: Association to one User;
    policy: Association to one Policies;
    applicantName: String;
    applicantAge: String;
    applicantAddress: String;
    applicantMobileNo: String;
    applicantEmail: String;
    applicantAadhar: String;
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




